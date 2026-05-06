from collections.abc import Callable
from dataclasses import dataclass
from datetime import UTC, datetime

from app.models import FacilityReview, ReservationStatus
from app.repositories.review_repository import ReviewRepository
from app.services.accounts import UserAccount


class ReviewError(Exception):
    pass


class ReviewReservationNotFound(ReviewError):
    pass


class ReviewReservationNotCompleted(ReviewError):
    pass


class ReviewAlreadySubmitted(ReviewError):
    pass


class ReviewNotFound(ReviewError):
    pass


class StaffReviewAccessDenied(ReviewError):
    pass


EDIT_WARNING = "Review tidak dapat diedit setelah dikirim."


@dataclass(frozen=True)
class ReviewSubmission:
    rating: int
    comment: str | None = None


@dataclass(frozen=True)
class StudentReview:
    id: str
    reservation_id: str
    facility_id: str
    rating: int
    comment: str | None
    author_name: str
    is_deleted: bool
    edit_warning: str = EDIT_WARNING


@dataclass(frozen=True)
class StaffFacilityReview:
    id: str
    reservation_id: str
    rating: int
    comment: str | None
    author_name: str
    created_at: datetime


@dataclass(frozen=True)
class StaffFacilityStatistics:
    facility_id: str
    review_count: int
    rating_average: float | None
    total_reservation_count: int
    completed_reservation_count: int


class ReviewModule:
    def __init__(self, *, review_repository: ReviewRepository, clock: Callable[[], datetime]) -> None:
        self._review_repository = review_repository
        self._clock = clock

    def submit_student_review(
        self,
        student: UserAccount,
        reservation_id: str,
        submission: ReviewSubmission,
    ) -> StudentReview:
        reservation = self._review_repository.get_student_reservation(reservation_id, student.id)
        if reservation is None:
            raise ReviewReservationNotFound
        if _effective_status(reservation.status, reservation.ends_at, _as_utc(self._clock())) != ReservationStatus.completed:
            raise ReviewReservationNotCompleted
        if reservation.review is not None:
            raise ReviewAlreadySubmitted

        review = FacilityReview(
            reservation_id=reservation.id,
            facility_id=reservation.facility_id,
            student_id=student.id,
            rating=submission.rating,
            comment=_optional_comment(submission.comment),
        )
        return _to_student_review(self._review_repository.add(review), author_name=reservation.student.full_name)

    def delete_student_review(self, student: UserAccount, review_id: str) -> StudentReview:
        review = self._review_repository.get_for_student(review_id, student.id)
        if review is None:
            raise ReviewNotFound
        review.is_deleted = True
        review.deleted_at = _as_utc(self._clock())
        return _to_student_review(review, author_name=review.student.full_name)

    def list_staff_facility_reviews(self, staff: UserAccount, facility_id: str) -> list[StaffFacilityReview]:
        self._require_staff_assignment(staff, facility_id)
        return [
            StaffFacilityReview(
                id=review.id,
                reservation_id=review.reservation_id,
                rating=review.rating,
                comment=review.comment,
                author_name=review.student.full_name,
                created_at=_as_utc(review.created_at),
            )
            for review in self._review_repository.list_visible_for_facility(facility_id)
        ]

    def get_staff_facility_statistics(self, staff: UserAccount, facility_id: str) -> StaffFacilityStatistics:
        self._require_staff_assignment(staff, facility_id)
        reviews = self._review_repository.list_visible_for_facility(facility_id)
        reservations = self._review_repository.list_reservations_for_facility(facility_id)
        now = _as_utc(self._clock())
        return StaffFacilityStatistics(
            facility_id=facility_id,
            review_count=len(reviews),
            rating_average=_rating_average(reviews),
            total_reservation_count=len(reservations),
            completed_reservation_count=sum(
                1
                for reservation in reservations
                if _effective_status(reservation.status, reservation.ends_at, now) == ReservationStatus.completed
            ),
        )

    def _require_staff_assignment(self, staff: UserAccount, facility_id: str) -> None:
        if not self._review_repository.staff_is_assigned(facility_id, staff.id):
            raise StaffReviewAccessDenied


def _to_student_review(review: FacilityReview, *, author_name: str) -> StudentReview:
    return StudentReview(
        id=review.id,
        reservation_id=review.reservation_id,
        facility_id=review.facility_id,
        rating=review.rating,
        comment=review.comment,
        author_name=author_name,
        is_deleted=review.is_deleted,
    )


def _effective_status(status: ReservationStatus, ends_at: datetime, now: datetime) -> ReservationStatus:
    if status == ReservationStatus.approved and _as_utc(ends_at) <= now:
        return ReservationStatus.completed
    return status


def _as_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=UTC)
    return value.astimezone(UTC)


def _optional_comment(value: str | None) -> str | None:
    if value is None:
        return None
    value = value.strip()
    return value or None


def _rating_average(reviews: list[FacilityReview]) -> float | None:
    if not reviews:
        return None
    return round(sum(review.rating for review in reviews) / len(reviews), 1)
