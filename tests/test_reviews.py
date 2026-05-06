from datetime import datetime

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import create_app
from app.models import ReservationStatus, UserRole
from tests.data_builder import DataBuilder


@pytest.mark.anyio
async def test_student_creates_one_review_for_own_completed_reservation():
    app = create_app(
        database_url="sqlite+pysqlite:///:memory:",
        clock=lambda: datetime.fromisoformat("2026-06-02T00:00:00+00:00"),
    )
    test_data = DataBuilder(app)
    facility_id = test_data.create_facility(name="Auditorium Andi Hakim Nasoetion")
    organization_unit_id = test_data.create_organization_unit(name="BEM KM IPB")
    reservation_id = test_data.create_reservation(
        facility_id=facility_id,
        organization_unit_id=organization_unit_id,
        activity_title="Seminar Karier",
        starts_at="2026-06-01T02:00:00+00:00",
        ends_at="2026-06-01T04:00:00+00:00",
        status=ReservationStatus.approved,
    )
    student = test_data.user_account_for_reservation(reservation_id)
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        login = await client.post("/auth/login", json={"email": student.email, "password": "secret123"})
        token = login.json()["access_token"]
        created = await client.post(
            f"/student/reservations/{reservation_id}/review",
            headers={"Authorization": f"Bearer {token}"},
            json={"rating": 5, "comment": "Fasilitas bersih dan siap digunakan."},
        )
        duplicate = await client.post(
            f"/student/reservations/{reservation_id}/review",
            headers={"Authorization": f"Bearer {token}"},
            json={"rating": 4},
        )

    assert created.status_code == 201
    assert created.json() == {
        "id": created.json()["id"],
        "reservation_id": reservation_id,
        "facility_id": facility_id,
        "rating": 5,
        "comment": "Fasilitas bersih dan siap digunakan.",
        "author_name": "Student Reservasi",
        "is_deleted": False,
        "edit_warning": "Review tidak dapat diedit setelah dikirim.",
    }
    assert duplicate.status_code == 409
    assert duplicate.json()["detail"] == "Review untuk reservasi ini sudah dikirim."


@pytest.mark.anyio
async def test_student_soft_deletes_own_review_and_public_facility_excludes_it():
    app = create_app(
        database_url="sqlite+pysqlite:///:memory:",
        clock=lambda: datetime.fromisoformat("2026-06-02T00:00:00+00:00"),
    )
    test_data = DataBuilder(app)
    facility_id = test_data.create_facility(name="Auditorium Andi Hakim Nasoetion")
    organization_unit_id = test_data.create_organization_unit(name="BEM KM IPB")
    first_reservation_id = test_data.create_reservation(
        facility_id=facility_id,
        organization_unit_id=organization_unit_id,
        activity_title="Seminar Karier",
        starts_at="2026-06-01T02:00:00+00:00",
        ends_at="2026-06-01T04:00:00+00:00",
        status=ReservationStatus.approved,
    )
    second_reservation_id = test_data.create_reservation(
        facility_id=facility_id,
        organization_unit_id=organization_unit_id,
        activity_title="Workshop Kewirausahaan",
        starts_at="2026-06-01T05:00:00+00:00",
        ends_at="2026-06-01T07:00:00+00:00",
        status=ReservationStatus.completed,
    )
    first_student = test_data.user_account_for_reservation(first_reservation_id)
    second_student = test_data.user_account_for_reservation(second_reservation_id)
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        first_login = await client.post("/auth/login", json={"email": first_student.email, "password": "secret123"})
        second_login = await client.post("/auth/login", json={"email": second_student.email, "password": "secret123"})
        first_token = first_login.json()["access_token"]
        second_token = second_login.json()["access_token"]
        first_review = await client.post(
            f"/student/reservations/{first_reservation_id}/review",
            headers={"Authorization": f"Bearer {first_token}"},
            json={"rating": 2, "comment": "AC kurang dingin."},
        )
        await client.post(
            f"/student/reservations/{second_reservation_id}/review",
            headers={"Authorization": f"Bearer {second_token}"},
            json={"rating": 4, "comment": "Ruang siap digunakan."},
        )
        deleted = await client.delete(
            f"/student/reviews/{first_review.json()['id']}",
            headers={"Authorization": f"Bearer {first_token}"},
        )
        public_detail = await client.get(f"/facilities/{facility_id}")

    assert deleted.status_code == 200
    assert deleted.json()["is_deleted"] is True
    assert public_detail.status_code == 200
    assert public_detail.json()["review_summary"] == {"rating_average": 4.0, "review_count": 1}
    assert public_detail.json()["reviews"] == [
        {
            "id": public_detail.json()["reviews"][0]["id"],
            "rating": 4,
            "comment": "Ruang siap digunakan.",
            "author_name": "Student Reservasi",
            "created_at": public_detail.json()["reviews"][0]["created_at"],
        }
    ]


@pytest.mark.anyio
async def test_assigned_staff_views_facility_reviews_and_operational_statistics_read_only():
    app = create_app(
        database_url="sqlite+pysqlite:///:memory:",
        clock=lambda: datetime.fromisoformat("2026-06-02T00:00:00+00:00"),
    )
    test_data = DataBuilder(app)
    facility_id = test_data.create_facility(name="Auditorium Andi Hakim Nasoetion")
    organization_unit_id = test_data.create_organization_unit(name="BEM KM IPB")
    staff_id = test_data.create_user(email="staff@ipb.ac.id", role=UserRole.staff)
    test_data.create_user(email="admin@ipb.ac.id", role=UserRole.super_admin)
    reservation_id = test_data.create_reservation(
        facility_id=facility_id,
        organization_unit_id=organization_unit_id,
        activity_title="Seminar Karier",
        starts_at="2026-06-01T02:00:00+00:00",
        ends_at="2026-06-01T04:00:00+00:00",
        status=ReservationStatus.approved,
    )
    student = test_data.user_account_for_reservation(reservation_id)
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        admin_login = await client.post("/auth/login", json={"email": "admin@ipb.ac.id", "password": "secret123"})
        admin_token = admin_login.json()["access_token"]
        await client.put(
            f"/admin/facilities/{facility_id}/staff-assignments/{staff_id}",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        student_login = await client.post("/auth/login", json={"email": student.email, "password": "secret123"})
        student_token = student_login.json()["access_token"]
        await client.post(
            f"/student/reservations/{reservation_id}/review",
            headers={"Authorization": f"Bearer {student_token}"},
            json={"rating": 5, "comment": "Fasilitas sangat siap."},
        )
        staff_login = await client.post("/auth/login", json={"email": "staff@ipb.ac.id", "password": "secret123"})
        staff_token = staff_login.json()["access_token"]
        reviews = await client.get(
            f"/staff/facilities/{facility_id}/reviews",
            headers={"Authorization": f"Bearer {staff_token}"},
        )
        statistics = await client.get(
            f"/staff/facilities/{facility_id}/statistics",
            headers={"Authorization": f"Bearer {staff_token}"},
        )
        moderation_attempt = await client.delete(
            f"/staff/facilities/{facility_id}/reviews/review-1",
            headers={"Authorization": f"Bearer {staff_token}"},
        )

    assert reviews.status_code == 200
    assert reviews.json() == [
        {
            "id": reviews.json()[0]["id"],
            "reservation_id": reservation_id,
            "rating": 5,
            "comment": "Fasilitas sangat siap.",
            "author_name": "Student Reservasi",
            "created_at": reviews.json()[0]["created_at"],
        }
    ]
    assert statistics.status_code == 200
    assert statistics.json() == {
        "facility_id": facility_id,
        "review_count": 1,
        "rating_average": 5.0,
        "total_reservation_count": 1,
        "completed_reservation_count": 1,
    }
    assert moderation_attempt.status_code == 404


@pytest.mark.anyio
async def test_review_submission_requires_owner_completed_reservation_valid_rating_and_has_no_edit_route():
    app = create_app(
        database_url="sqlite+pysqlite:///:memory:",
        clock=lambda: datetime.fromisoformat("2026-06-02T00:00:00+00:00"),
    )
    test_data = DataBuilder(app)
    facility_id = test_data.create_facility(name="Auditorium Andi Hakim Nasoetion")
    organization_unit_id = test_data.create_organization_unit(name="BEM KM IPB")
    completed_reservation_id = test_data.create_reservation(
        facility_id=facility_id,
        organization_unit_id=organization_unit_id,
        activity_title="Seminar Karier",
        starts_at="2026-06-01T02:00:00+00:00",
        ends_at="2026-06-01T04:00:00+00:00",
        status=ReservationStatus.completed,
    )
    unfinished_reservation_id = test_data.create_reservation(
        facility_id=facility_id,
        organization_unit_id=organization_unit_id,
        activity_title="Workshop Kewirausahaan",
        starts_at="2026-06-03T02:00:00+00:00",
        ends_at="2026-06-03T04:00:00+00:00",
        status=ReservationStatus.approved,
    )
    owner = test_data.user_account_for_reservation(completed_reservation_id)
    other_student = test_data.user_account_for_reservation(unfinished_reservation_id)
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        owner_login = await client.post("/auth/login", json={"email": owner.email, "password": "secret123"})
        other_login = await client.post("/auth/login", json={"email": other_student.email, "password": "secret123"})
        owner_token = owner_login.json()["access_token"]
        other_token = other_login.json()["access_token"]
        other_students_reservation = await client.post(
            f"/student/reservations/{completed_reservation_id}/review",
            headers={"Authorization": f"Bearer {other_token}"},
            json={"rating": 5},
        )
        unfinished = await client.post(
            f"/student/reservations/{unfinished_reservation_id}/review",
            headers={"Authorization": f"Bearer {other_token}"},
            json={"rating": 5},
        )
        invalid_rating = await client.post(
            f"/student/reservations/{completed_reservation_id}/review",
            headers={"Authorization": f"Bearer {owner_token}"},
            json={"rating": 6},
        )
        created = await client.post(
            f"/student/reservations/{completed_reservation_id}/review",
            headers={"Authorization": f"Bearer {owner_token}"},
            json={"rating": 5},
        )
        edit_attempt = await client.patch(
            f"/student/reviews/{created.json()['id']}",
            headers={"Authorization": f"Bearer {owner_token}"},
            json={"rating": 4},
        )

    assert other_students_reservation.status_code == 404
    assert unfinished.status_code == 409
    assert unfinished.json()["detail"] == "Reservasi belum selesai."
    assert invalid_rating.status_code == 422
    assert edit_attempt.status_code == 405
