from collections.abc import Callable
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta

from sqlalchemy import select

from app.models import Reservation, ReservationStatus
from app.services.booking_settings import BookingSettings


@dataclass(frozen=True)
class DeadlineWorkerResult:
    expired: int = 0
    overdue_verification: int = 0
    completed: int = 0


class DeadlineWorkerModule:
    def __init__(
        self,
        *,
        session_factory: Callable,
        clock: Callable[[], datetime],
        booking_settings: BookingSettings | None = None,
    ) -> None:
        self._session_factory = session_factory
        self._clock = clock
        self._booking_settings = booking_settings or BookingSettings.defaults()

    def process_due_reservations(self) -> DeadlineWorkerResult:
        now = _as_utc(self._clock())
        expired = 0
        overdue_verification = 0
        completed = 0
        with self._session_factory() as session:
            reservations = list(session.scalars(select(Reservation)))
            for reservation in reservations:
                if _should_complete(reservation, now):
                    reservation.status = ReservationStatus.completed
                    completed += 1
                elif _overdue_cutoff_reached(reservation, now, self._booking_settings):
                    reservation.status = ReservationStatus.expired
                    expired += 1
                elif _should_mark_overdue_verification(reservation, now):
                    if _staff_overdue_cutoff_reached(reservation, now, self._booking_settings):
                        reservation.status = ReservationStatus.expired
                        expired += 1
                    else:
                        reservation.status = ReservationStatus.overdue_verification
                        overdue_verification += 1
                elif _should_expire_student_delay_or_normal_cutoff(reservation, now, self._booking_settings):
                    reservation.status = ReservationStatus.expired
                    expired += 1
            session.commit()
        return DeadlineWorkerResult(
            expired=expired,
            overdue_verification=overdue_verification,
            completed=completed,
        )


def _should_complete(reservation: Reservation, now: datetime) -> bool:
    return reservation.status == ReservationStatus.approved and _as_utc(reservation.ends_at) <= now


def _should_expire_student_delay_or_normal_cutoff(
    reservation: Reservation,
    now: datetime,
    booking_settings: BookingSettings,
) -> bool:
    if (
        reservation.status == ReservationStatus.pending_document_upload
        and reservation.document_upload_due_at is not None
        and _as_utc(reservation.document_upload_due_at) <= now
    ):
        return True
    if (
        reservation.status == ReservationStatus.pending_payment
        and reservation.payment_receipt is None
        and reservation.payment_upload_due_at is not None
        and _as_utc(reservation.payment_upload_due_at) <= now
    ):
        return True
    if reservation.status in (
        ReservationStatus.pending_document_upload,
        ReservationStatus.pending_document_review,
        ReservationStatus.pending_payment,
    ):
        return _as_utc(reservation.starts_at) - now <= timedelta(
            hours=booking_settings.final_approval_cutoff_hours
        )
    return False


def _overdue_cutoff_reached(reservation: Reservation, now: datetime, booking_settings: BookingSettings) -> bool:
    return reservation.status == ReservationStatus.overdue_verification and _staff_overdue_cutoff_reached(
        reservation,
        now,
        booking_settings,
    )


def _staff_overdue_cutoff_reached(
    reservation: Reservation,
    now: datetime,
    booking_settings: BookingSettings,
) -> bool:
    return _as_utc(reservation.starts_at) - now <= timedelta(
        hours=booking_settings.overdue_final_approval_cutoff_hours
    )


def _should_mark_overdue_verification(reservation: Reservation, now: datetime) -> bool:
    if (
        reservation.status == ReservationStatus.pending_document_review
        and reservation.document_verification_due_at is not None
        and _as_utc(reservation.document_verification_due_at) <= now
    ):
        return True
    return (
        reservation.status == ReservationStatus.pending_payment
        and reservation.payment_receipt is not None
        and reservation.payment_verification_due_at is not None
        and _as_utc(reservation.payment_verification_due_at) <= now
    )


def _as_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=UTC)
    return value.astimezone(UTC)
