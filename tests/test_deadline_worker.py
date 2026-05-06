from datetime import UTC, datetime

from app.main import create_app
from app.models import ReservationStatus
from app.services.deadline_worker import DeadlineWorkerModule
from tests.data_builder import DataBuilder


def test_approved_past_reservation_is_effectively_completed_before_worker_persistence():
    app = create_app(
        database_url="sqlite+pysqlite:///:memory:",
        clock=lambda: datetime(2026, 6, 2, tzinfo=UTC),
    )
    test_data = DataBuilder(app)
    facility_id = test_data.create_facility(name="Auditorium Andi Hakim Nasoetion")
    organization_unit_id = test_data.create_organization_unit(name="BEM KM IPB")
    reservation_id = test_data.create_reservation(
        facility_id=facility_id,
        organization_unit_id=organization_unit_id,
        activity_title="Past Approved Effective",
        starts_at="2026-06-01T02:00:00+00:00",
        ends_at="2026-06-01T04:00:00+00:00",
        status=ReservationStatus.approved,
    )

    from app.core.module_factories import FacilityModuleFactory
    from app.services.booking_settings import BookingSettings
    from app.storage import InMemoryPrivateStorage

    with app.state.session_factory() as session:
        reservations = FacilityModuleFactory(
            default_booking_settings=BookingSettings.defaults(),
            clock=lambda: datetime(2026, 6, 2, tzinfo=UTC),
            private_storage=InMemoryPrivateStorage(),
        ).build_reservations(session)

        effective = reservations.get_student_reservation(
            test_data.user_account_for_reservation(reservation_id),
            reservation_id,
        )

    assert effective.status == ReservationStatus.completed
    assert test_data.get_reservation_status(reservation_id) == ReservationStatus.approved


def test_deadline_worker_expires_missed_student_upload_deadlines_and_marks_staff_overdue():
    app = create_app(database_url="sqlite+pysqlite:///:memory:")
    test_data = DataBuilder(app)
    facility_id = test_data.create_facility(name="Auditorium Andi Hakim Nasoetion")
    organization_unit_id = test_data.create_organization_unit(name="BEM KM IPB")
    missed_document_upload_id = test_data.create_reservation(
        facility_id=facility_id,
        organization_unit_id=organization_unit_id,
        activity_title="Missed Document Upload",
        starts_at="2026-06-20T02:00:00+00:00",
        ends_at="2026-06-20T04:00:00+00:00",
        status=ReservationStatus.pending_document_upload,
        document_upload_due_at="2026-06-01T00:00:00+00:00",
    )
    missed_document_review_id = test_data.create_reservation(
        facility_id=facility_id,
        organization_unit_id=organization_unit_id,
        activity_title="Missed Document Review",
        starts_at="2026-06-20T05:00:00+00:00",
        ends_at="2026-06-20T07:00:00+00:00",
        status=ReservationStatus.pending_document_review,
        document_verification_due_at="2026-06-01T00:00:00+00:00",
    )
    pending_payment_without_receipt_id = test_data.create_reservation(
        facility_id=facility_id,
        organization_unit_id=organization_unit_id,
        activity_title="Missed Payment Upload",
        starts_at="2026-06-20T08:00:00+00:00",
        ends_at="2026-06-20T10:00:00+00:00",
        status=ReservationStatus.pending_payment,
        payment_upload_due_at="2026-06-01T00:00:00+00:00",
    )
    pending_payment_with_receipt_id = test_data.create_reservation(
        facility_id=facility_id,
        organization_unit_id=organization_unit_id,
        activity_title="Missed Payment Review",
        starts_at="2026-06-20T11:00:00+00:00",
        ends_at="2026-06-20T13:00:00+00:00",
        status=ReservationStatus.pending_payment,
        payment_verification_due_at="2026-06-01T00:00:00+00:00",
        has_payment_receipt=True,
    )

    processed = DeadlineWorkerModule(
        session_factory=app.state.session_factory,
        clock=lambda: datetime(2026, 6, 2, tzinfo=UTC),
    ).process_due_reservations()

    assert processed.expired == 2
    assert processed.overdue_verification == 2
    assert test_data.get_reservation_status(missed_document_upload_id) == ReservationStatus.expired
    assert test_data.get_reservation_status(missed_document_review_id) == ReservationStatus.overdue_verification
    assert test_data.get_reservation_status(pending_payment_without_receipt_id) == ReservationStatus.expired
    assert test_data.get_reservation_status(pending_payment_with_receipt_id) == ReservationStatus.overdue_verification


def test_deadline_worker_enforces_normal_and_staff_overdue_final_cutoffs():
    app = create_app(database_url="sqlite+pysqlite:///:memory:")
    test_data = DataBuilder(app)
    facility_id = test_data.create_facility(name="Auditorium Andi Hakim Nasoetion")
    organization_unit_id = test_data.create_organization_unit(name="BEM KM IPB")
    normal_cutoff_id = test_data.create_reservation(
        facility_id=facility_id,
        organization_unit_id=organization_unit_id,
        activity_title="Normal Cutoff",
        starts_at="2026-06-08T02:00:00+00:00",
        ends_at="2026-06-08T04:00:00+00:00",
        status=ReservationStatus.pending_payment,
    )
    staff_overdue_kept_id = test_data.create_reservation(
        facility_id=facility_id,
        organization_unit_id=organization_unit_id,
        activity_title="Staff Overdue Kept",
        starts_at="2026-06-08T05:00:00+00:00",
        ends_at="2026-06-08T07:00:00+00:00",
        status=ReservationStatus.overdue_verification,
    )
    staff_overdue_cutoff_id = test_data.create_reservation(
        facility_id=facility_id,
        organization_unit_id=organization_unit_id,
        activity_title="Staff Overdue Cutoff",
        starts_at="2026-06-05T02:00:00+00:00",
        ends_at="2026-06-05T04:00:00+00:00",
        status=ReservationStatus.overdue_verification,
    )

    processed = DeadlineWorkerModule(
        session_factory=app.state.session_factory,
        clock=lambda: datetime(2026, 6, 1, 2, tzinfo=UTC),
    ).process_due_reservations()

    assert processed.expired == 2
    assert test_data.get_reservation_status(normal_cutoff_id) == ReservationStatus.expired
    assert test_data.get_reservation_status(staff_overdue_kept_id) == ReservationStatus.overdue_verification
    assert test_data.get_reservation_status(staff_overdue_cutoff_id) == ReservationStatus.expired


def test_staff_missed_verification_gets_overdue_cutoff_instead_of_normal_cutoff():
    app = create_app(database_url="sqlite+pysqlite:///:memory:")
    test_data = DataBuilder(app)
    facility_id = test_data.create_facility(name="Auditorium Andi Hakim Nasoetion")
    organization_unit_id = test_data.create_organization_unit(name="BEM KM IPB")
    reservation_id = test_data.create_reservation(
        facility_id=facility_id,
        organization_unit_id=organization_unit_id,
        activity_title="Staff Missed Verification At Six Days",
        starts_at="2026-06-07T02:00:00+00:00",
        ends_at="2026-06-07T04:00:00+00:00",
        status=ReservationStatus.pending_document_review,
        document_verification_due_at="2026-06-01T00:00:00+00:00",
    )

    processed = DeadlineWorkerModule(
        session_factory=app.state.session_factory,
        clock=lambda: datetime(2026, 6, 1, 2, tzinfo=UTC),
    ).process_due_reservations()

    assert processed.overdue_verification == 1
    assert processed.expired == 0
    assert test_data.get_reservation_status(reservation_id) == ReservationStatus.overdue_verification


def test_deadline_worker_persists_completed_status_after_approved_reservation_end_time():
    app = create_app(database_url="sqlite+pysqlite:///:memory:")
    test_data = DataBuilder(app)
    facility_id = test_data.create_facility(name="Auditorium Andi Hakim Nasoetion")
    organization_unit_id = test_data.create_organization_unit(name="BEM KM IPB")
    reservation_id = test_data.create_reservation(
        facility_id=facility_id,
        organization_unit_id=organization_unit_id,
        activity_title="Past Approved",
        starts_at="2026-06-01T02:00:00+00:00",
        ends_at="2026-06-01T04:00:00+00:00",
        status=ReservationStatus.approved,
    )

    processed = DeadlineWorkerModule(
        session_factory=app.state.session_factory,
        clock=lambda: datetime(2026, 6, 2, tzinfo=UTC),
    ).process_due_reservations()

    assert processed.completed == 1
    assert test_data.get_reservation_status(reservation_id) == ReservationStatus.completed
