from collections.abc import Callable
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
import uuid

from app.models import ReservationApprovalLetter, ReservationSignedApprovalLetter, ReservationStatus
from app.pdf import ApprovalLetterInput, ApprovalLetterPdfGenerator
from app.repositories.reservation_repository import ReservationRepository
from app.services.accounts import UserAccount
from app.services.booking_settings import BookingSettings
from app.services.notifications import NotificationModule
from app.services.reservations import ReservationNotFound
from app.storage import PrivateStorage


@dataclass(frozen=True)
class StudentApprovalLetter:
    reservation_id: str
    reservation_code: str
    filename: str
    content_type: str
    size_bytes: int
    generated_at: datetime


@dataclass(frozen=True)
class StudentApprovalLetterDownload:
    filename: str
    content_type: str
    content: bytes


@dataclass(frozen=True)
class StaffSignedApprovalLetterDownload:
    filename: str
    content_type: str
    content: bytes


@dataclass(frozen=True)
class SignedApprovalLetterUpload:
    filename: str
    content_type: str
    content: bytes


@dataclass(frozen=True)
class StudentSignedApprovalLetter:
    reservation_id: str
    filename: str
    content_type: str
    size_bytes: int
    uploaded_at: datetime


@dataclass(frozen=True)
class StaffDocumentReview:
    reservation_id: str
    status: ReservationStatus
    rejection_reason: str | None = None


class ApprovalLetterNotGenerated(Exception):
    pass


class InvalidSignedApprovalLetterFile(Exception):
    pass


class SignedApprovalLetterFileTooLarge(Exception):
    pass


class StaffDocumentReviewAccessDenied(Exception):
    pass


class DocumentRejectionReasonRequired(Exception):
    pass


class ApprovalLetterModule:
    def __init__(
        self,
        *,
        reservation_repository: ReservationRepository,
        storage: PrivateStorage,
        pdf_generator: ApprovalLetterPdfGenerator,
        booking_settings: BookingSettings,
        clock: Callable[[], datetime],
        notifications: NotificationModule | None = None,
    ) -> None:
        self._reservation_repository = reservation_repository
        self._storage = storage
        self._pdf_generator = pdf_generator
        self._booking_settings = booking_settings
        self._clock = clock
        self._notifications = notifications

    def get_student_approval_letter(self, student: UserAccount, reservation_id: str) -> StudentApprovalLetter:
        letter = self._get_or_create_student_approval_letter(student, reservation_id)
        return _to_student_approval_letter(letter)

    def download_student_approval_letter(
        self,
        student: UserAccount,
        reservation_id: str,
    ) -> StudentApprovalLetterDownload:
        letter = self._get_or_create_student_approval_letter(student, reservation_id)
        return StudentApprovalLetterDownload(
            filename=letter.filename,
            content_type=letter.content_type,
            content=self._storage.get(letter.storage_key),
        )

    def upload_student_signed_approval_letter(
        self,
        student: UserAccount,
        reservation_id: str,
        upload: SignedApprovalLetterUpload,
    ) -> StudentSignedApprovalLetter:
        reservation = self._reservation_repository.get_for_student(reservation_id, student.id)
        if reservation is None:
            raise ReservationNotFound
        if reservation.approval_letter is None:
            raise ApprovalLetterNotGenerated

        if not _is_allowed_signed_approval_letter_file(upload):
            raise InvalidSignedApprovalLetterFile
        if len(upload.content) > 5 * 1024 * 1024:
            raise SignedApprovalLetterFileTooLarge

        uploaded_at = _as_utc(self._clock())
        storage_key = f"signed-approval-letters/{reservation.id}/{uuid.uuid4().hex}-{upload.filename}"
        self._storage.put(storage_key, upload.content, content_type=upload.content_type)
        reservation.signed_approval_letter = ReservationSignedApprovalLetter(
            reservation_id=reservation.id,
            storage_key=storage_key,
            filename=upload.filename,
            content_type=upload.content_type,
            size_bytes=len(upload.content),
            uploaded_at=uploaded_at,
        )
        reservation.status = ReservationStatus.pending_document_review
        reservation.document_verification_due_at = uploaded_at + timedelta(
            hours=self._booking_settings.document_verification_due_hours
        )
        if self._notifications is not None:
            self._notifications.student_action_recorded(
                reservation,
                title="Surat berhasil diunggah",
                message=f"Surat persetujuan {reservation.activity_title} sedang menunggu review.",
            )
            self._notifications.staff_action_needed(
                reservation,
                title="Surat menunggu review",
                message=f"Surat persetujuan {reservation.activity_title} menunggu verifikasi.",
            )
        return _to_student_signed_approval_letter(reservation.signed_approval_letter)

    def approve_signed_approval_letter(self, staff: UserAccount, reservation_id: str) -> StaffDocumentReview:
        reservation = self._get_staff_review_reservation(staff, reservation_id)
        if reservation.signed_approval_letter is None:
            raise ApprovalLetterNotGenerated

        if reservation.price_rupiah == 0:
            reservation.status = ReservationStatus.approved
            title = "Reservasi disetujui"
            message = f"Reservasi {reservation.activity_title} sudah disetujui."
        else:
            reservation.status = ReservationStatus.pending_payment
            reservation.payment_upload_due_at = _as_utc(self._clock()) + timedelta(
                hours=self._booking_settings.payment_upload_due_hours
            )
            title = "Pembayaran diperlukan"
            message = f"Reservasi {reservation.activity_title} disetujui dokumennya dan menunggu pembayaran."
        if self._notifications is not None:
            self._notifications.student_action_recorded(reservation, title=title, message=message)
        return StaffDocumentReview(reservation_id=reservation.id, status=reservation.status)

    def download_staff_signed_approval_letter(
        self,
        staff: UserAccount,
        reservation_id: str,
    ) -> StaffSignedApprovalLetterDownload:
        reservation = self._get_staff_review_reservation(staff, reservation_id)
        if reservation.signed_approval_letter is None:
            raise ApprovalLetterNotGenerated
        letter = reservation.signed_approval_letter
        return StaffSignedApprovalLetterDownload(
            filename=letter.filename,
            content_type=letter.content_type,
            content=self._storage.get(letter.storage_key),
        )

    def reject_signed_approval_letter(
        self,
        staff: UserAccount,
        reservation_id: str,
        *,
        reason: str,
    ) -> StaffDocumentReview:
        reason = reason.strip()
        if not reason:
            raise DocumentRejectionReasonRequired

        reservation = self._get_staff_review_reservation(staff, reservation_id)
        if reservation.signed_approval_letter is None:
            raise ApprovalLetterNotGenerated

        reservation.status = ReservationStatus.rejected
        reservation.rejection_reason = reason
        if self._notifications is not None:
            self._notifications.student_action_recorded(
                reservation,
                title="Surat ditolak",
                message=f"Surat persetujuan {reservation.activity_title} ditolak: {reason}",
            )
        return StaffDocumentReview(
            reservation_id=reservation.id,
            status=reservation.status,
            rejection_reason=reservation.rejection_reason,
        )

    def _get_staff_review_reservation(self, staff: UserAccount, reservation_id: str):
        reservation = self._reservation_repository.get_for_assigned_staff_review(reservation_id, staff.id)
        if reservation is not None:
            return reservation
        if self._reservation_repository.get_by_id_for_review(reservation_id) is not None:
            raise StaffDocumentReviewAccessDenied
        raise ReservationNotFound

    def _get_or_create_student_approval_letter(
        self,
        student: UserAccount,
        reservation_id: str,
    ) -> ReservationApprovalLetter:
        reservation = self._reservation_repository.get_for_student(reservation_id, student.id)
        if reservation is None:
            raise ReservationNotFound
        if reservation.approval_letter is None:
            generated_at = _as_utc(self._clock())
            pdf = self._pdf_generator.generate(
                ApprovalLetterInput(
                    reservation=reservation,
                    generated_at=generated_at,
                )
            )
            filename = f"{reservation.reservation_code}-surat-persetujuan.pdf"
            storage_key = f"approval-letters/{reservation.id}/{uuid.uuid4().hex}.pdf"
            self._storage.put(storage_key, pdf, content_type="application/pdf")
            reservation.approval_letter = ReservationApprovalLetter(
                reservation_id=reservation.id,
                storage_key=storage_key,
                filename=filename,
                content_type="application/pdf",
                size_bytes=len(pdf),
                generated_at=generated_at,
            )
        return reservation.approval_letter


def _to_student_approval_letter(letter: ReservationApprovalLetter) -> StudentApprovalLetter:
    return StudentApprovalLetter(
        reservation_id=letter.reservation_id,
        reservation_code=letter.reservation.reservation_code,
        filename=letter.filename,
        content_type=letter.content_type,
        size_bytes=letter.size_bytes,
        generated_at=_as_utc(letter.generated_at),
    )


def _to_student_signed_approval_letter(letter: ReservationSignedApprovalLetter) -> StudentSignedApprovalLetter:
    return StudentSignedApprovalLetter(
        reservation_id=letter.reservation_id,
        filename=letter.filename,
        content_type=letter.content_type,
        size_bytes=letter.size_bytes,
        uploaded_at=_as_utc(letter.uploaded_at),
    )


def _is_allowed_signed_approval_letter_file(upload: SignedApprovalLetterUpload) -> bool:
    allowed_content_types = {"application/pdf", "image/jpeg", "image/png"}
    allowed_extensions = (".pdf", ".jpg", ".jpeg", ".png")
    return upload.content_type.lower() in allowed_content_types and upload.filename.lower().endswith(allowed_extensions)


def _as_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=UTC)
    return value.astimezone(UTC)
