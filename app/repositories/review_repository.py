from typing import Protocol

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models import FacilityReview, FacilityStaffAssignment, Reservation


class ReviewRepository(Protocol):
    def get_student_reservation(self, reservation_id: str, student_id: str) -> Reservation | None:
        raise NotImplementedError

    def add(self, review: FacilityReview) -> FacilityReview:
        raise NotImplementedError

    def get_for_student(self, review_id: str, student_id: str) -> FacilityReview | None:
        raise NotImplementedError

    def staff_is_assigned(self, facility_id: str, staff_id: str) -> bool:
        raise NotImplementedError

    def list_visible_for_facility(self, facility_id: str) -> list[FacilityReview]:
        raise NotImplementedError

    def list_reservations_for_facility(self, facility_id: str) -> list[Reservation]:
        raise NotImplementedError


class SqlAlchemyReviewRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def get_student_reservation(self, reservation_id: str, student_id: str) -> Reservation | None:
        return self._session.scalar(
            select(Reservation)
            .options(joinedload(Reservation.review), joinedload(Reservation.student))
            .where(Reservation.id == reservation_id, Reservation.student_id == student_id)
        )

    def add(self, review: FacilityReview) -> FacilityReview:
        self._session.add(review)
        self._session.flush()
        return review

    def get_for_student(self, review_id: str, student_id: str) -> FacilityReview | None:
        return self._session.scalar(
            select(FacilityReview)
            .options(joinedload(FacilityReview.student))
            .where(FacilityReview.id == review_id, FacilityReview.student_id == student_id)
        )

    def staff_is_assigned(self, facility_id: str, staff_id: str) -> bool:
        return (
            self._session.scalar(
                select(FacilityStaffAssignment.id).where(
                    FacilityStaffAssignment.facility_id == facility_id,
                    FacilityStaffAssignment.staff_id == staff_id,
                )
            )
            is not None
        )

    def list_visible_for_facility(self, facility_id: str) -> list[FacilityReview]:
        return list(
            self._session.scalars(
                select(FacilityReview)
                .options(joinedload(FacilityReview.student))
                .where(FacilityReview.facility_id == facility_id, FacilityReview.is_deleted.is_(False))
                .order_by(FacilityReview.created_at.desc())
            )
        )

    def list_reservations_for_facility(self, facility_id: str) -> list[Reservation]:
        return list(self._session.scalars(select(Reservation).where(Reservation.facility_id == facility_id)))
