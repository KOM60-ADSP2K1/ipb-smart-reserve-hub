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


@pytest.mark.anyio
async def test_super_admin_lists_all_reviews_globally_including_student_deleted_reviews():
    app = create_app(
        database_url="sqlite+pysqlite:///:memory:",
        clock=lambda: datetime.fromisoformat("2026-06-02T00:00:00+00:00"),
    )
    test_data = DataBuilder(app)
    first_facility_id = test_data.create_facility(name="Auditorium Andi Hakim Nasoetion")
    second_facility_id = test_data.create_facility(name="Ruang Kuliah Bersama")
    organization_unit_id = test_data.create_organization_unit(name="BEM KM IPB")
    first_reservation_id = test_data.create_reservation(
        facility_id=first_facility_id,
        organization_unit_id=organization_unit_id,
        activity_title="Seminar Karier",
        starts_at="2026-06-01T02:00:00+00:00",
        ends_at="2026-06-01T04:00:00+00:00",
        status=ReservationStatus.completed,
    )
    second_reservation_id = test_data.create_reservation(
        facility_id=second_facility_id,
        organization_unit_id=organization_unit_id,
        activity_title="Workshop Kewirausahaan",
        starts_at="2026-06-01T05:00:00+00:00",
        ends_at="2026-06-01T07:00:00+00:00",
        status=ReservationStatus.completed,
    )
    first_student = test_data.user_account_for_reservation(first_reservation_id)
    second_student = test_data.user_account_for_reservation(second_reservation_id)
    test_data.create_user(email="admin@ipb.ac.id", role=UserRole.super_admin)
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        first_login = await client.post("/auth/login", json={"email": first_student.email, "password": "secret123"})
        second_login = await client.post("/auth/login", json={"email": second_student.email, "password": "secret123"})
        first_review = await client.post(
            f"/student/reservations/{first_reservation_id}/review",
            headers={"Authorization": f"Bearer {first_login.json()['access_token']}"},
            json={"rating": 2, "comment": "AC kurang dingin."},
        )
        await client.post(
            f"/student/reservations/{second_reservation_id}/review",
            headers={"Authorization": f"Bearer {second_login.json()['access_token']}"},
            json={"rating": 5, "comment": "Ruang siap digunakan."},
        )
        await client.delete(
            f"/student/reviews/{first_review.json()['id']}",
            headers={"Authorization": f"Bearer {first_login.json()['access_token']}"},
        )
        admin_login = await client.post("/auth/login", json={"email": "admin@ipb.ac.id", "password": "secret123"})
        admin_reviews = await client.get(
            "/admin/reviews",
            headers={"Authorization": f"Bearer {admin_login.json()['access_token']}"},
        )
        deleted_reviews_for_first_facility = await client.get(
            "/admin/reviews",
            headers={"Authorization": f"Bearer {admin_login.json()['access_token']}"},
            params={"facility_id": first_facility_id, "deleted_by": "student"},
        )

    assert admin_reviews.status_code == 200
    assert admin_reviews.json() == [
        {
            "id": admin_reviews.json()[0]["id"],
            "reservation_id": second_reservation_id,
            "facility_id": second_facility_id,
            "facility_name": "Ruang Kuliah Bersama",
            "student_id": second_student.id,
            "student_name": "Student Reservasi",
            "rating": 5,
            "comment": "Ruang siap digunakan.",
            "is_deleted": False,
            "deleted_by": None,
            "deleted_at": None,
            "admin_removal_reason": None,
            "created_at": admin_reviews.json()[0]["created_at"],
        },
        {
            "id": first_review.json()["id"],
            "reservation_id": first_reservation_id,
            "facility_id": first_facility_id,
            "facility_name": "Auditorium Andi Hakim Nasoetion",
            "student_id": first_student.id,
            "student_name": "Student Reservasi",
            "rating": 2,
            "comment": "AC kurang dingin.",
            "is_deleted": True,
            "deleted_by": "student",
            "deleted_at": "2026-06-02T00:00:00Z",
            "admin_removal_reason": None,
            "created_at": admin_reviews.json()[1]["created_at"],
        },
    ]
    assert deleted_reviews_for_first_facility.status_code == 200
    assert [review["id"] for review in deleted_reviews_for_first_facility.json()] == [first_review.json()["id"]]


@pytest.mark.anyio
async def test_super_admin_soft_deletes_review_with_reason_and_restores_without_editing_content():
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
        status=ReservationStatus.completed,
    )
    student = test_data.user_account_for_reservation(reservation_id)
    test_data.create_user(email="admin@ipb.ac.id", role=UserRole.super_admin)
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        student_login = await client.post("/auth/login", json={"email": student.email, "password": "secret123"})
        student_token = student_login.json()["access_token"]
        review = await client.post(
            f"/student/reservations/{reservation_id}/review",
            headers={"Authorization": f"Bearer {student_token}"},
            json={"rating": 1, "comment": "Tidak sesuai deskripsi."},
        )
        admin_login = await client.post("/auth/login", json={"email": "admin@ipb.ac.id", "password": "secret123"})
        admin_token = admin_login.json()["access_token"]
        missing_reason = await client.post(
            f"/admin/reviews/{review.json()['id']}/delete",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"reason": "   "},
        )
        deleted = await client.post(
            f"/admin/reviews/{review.json()['id']}/delete",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"reason": "Komentar mengandung data pribadi."},
        )
        public_detail_after_delete = await client.get(f"/facilities/{facility_id}")
        student_reservation_after_delete = await client.get(
            f"/student/reservations/{reservation_id}",
            headers={"Authorization": f"Bearer {student_token}"},
        )
        student_reviews_after_delete = await client.get(
            "/admin/reviews",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        edit_attempt = await client.patch(
            f"/admin/reviews/{review.json()['id']}/delete",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"rating": 5, "comment": "Edited"},
        )
        restored = await client.post(
            f"/admin/reviews/{review.json()['id']}/restore",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        public_detail_after_restore = await client.get(f"/facilities/{facility_id}")

    assert missing_reason.status_code == 400
    assert missing_reason.json()["detail"] == "Alasan penghapusan review wajib diisi."
    assert deleted.status_code == 200
    assert deleted.json()["is_deleted"] is True
    assert deleted.json()["deleted_by"] == "admin"
    assert deleted.json()["deleted_at"] == "2026-06-02T00:00:00Z"
    assert deleted.json()["admin_removal_reason"] == "Komentar mengandung data pribadi."
    assert public_detail_after_delete.json()["review_summary"] == {"rating_average": None, "review_count": 0}
    assert public_detail_after_delete.json()["reviews"] == []
    assert student_reservation_after_delete.json()["review"] == {
        "id": review.json()["id"],
        "is_deleted": True,
        "deleted_by": "admin",
        "deleted_at": "2026-06-02T00:00:00Z",
        "admin_removal_reason": "Komentar mengandung data pribadi.",
    }
    assert student_reviews_after_delete.json()[0]["admin_removal_reason"] == "Komentar mengandung data pribadi."
    assert edit_attempt.status_code == 405
    assert restored.status_code == 200
    assert restored.json()["is_deleted"] is False
    assert restored.json()["deleted_by"] is None
    assert restored.json()["deleted_at"] is None
    assert restored.json()["admin_removal_reason"] is None
    assert restored.json()["rating"] == 1
    assert restored.json()["comment"] == "Tidak sesuai deskripsi."
    assert public_detail_after_restore.json()["review_summary"] == {"rating_average": 1.0, "review_count": 1}


@pytest.mark.anyio
async def test_super_admin_views_immutable_audit_logs_with_filters_for_review_and_staff_assignment_actions():
    app = create_app(
        database_url="sqlite+pysqlite:///:memory:",
        clock=lambda: datetime.fromisoformat("2026-06-02T00:00:00+00:00"),
    )
    test_data = DataBuilder(app)
    facility_id = test_data.create_facility(name="Auditorium Andi Hakim Nasoetion")
    organization_unit_id = test_data.create_organization_unit(name="BEM KM IPB")
    staff_id = test_data.create_user(email="staff@ipb.ac.id", role=UserRole.staff)
    reservation_id = test_data.create_reservation(
        facility_id=facility_id,
        organization_unit_id=organization_unit_id,
        activity_title="Seminar Karier",
        starts_at="2026-06-01T02:00:00+00:00",
        ends_at="2026-06-01T04:00:00+00:00",
        status=ReservationStatus.completed,
    )
    student = test_data.user_account_for_reservation(reservation_id)
    admin_id = test_data.create_user(email="admin@ipb.ac.id", role=UserRole.super_admin)
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
        review = await client.post(
            f"/student/reservations/{reservation_id}/review",
            headers={"Authorization": f"Bearer {student_token}"},
            json={"rating": 4, "comment": "Ruang siap digunakan."},
        )
        await client.post(
            f"/admin/reviews/{review.json()['id']}/delete",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"reason": "Komentar mengandung data pribadi."},
        )
        review_delete_logs = await client.get(
            "/admin/audit-logs",
            headers={"Authorization": f"Bearer {admin_token}"},
            params={
                "action_type": "review.admin_deleted",
                "target_type": "review",
                "facility_id": facility_id,
                "student_id": student.id,
                "reservation_id": reservation_id,
            },
        )
        admin_actor_logs = await client.get(
            "/admin/audit-logs",
            headers={"Authorization": f"Bearer {admin_token}"},
            params={"actor_id": admin_id, "created_from": "2026-06-01T00:00:00+00:00"},
        )
        limited_admin_logs = await client.get(
            "/admin/audit-logs",
            headers={"Authorization": f"Bearer {admin_token}"},
            params={"limit": 1},
        )
        student_forbidden = await client.get(
            "/admin/audit-logs",
            headers={"Authorization": f"Bearer {student_token}"},
        )
        edit_attempt = await client.patch(
            f"/admin/audit-logs/{review_delete_logs.json()[0]['id']}",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"action_type": "tampered"},
        )

    assert review_delete_logs.status_code == 200
    assert review_delete_logs.json() == [
        {
            "id": review_delete_logs.json()[0]["id"],
            "actor_id": admin_id,
            "actor_email": "admin@ipb.ac.id",
            "action_type": "review.admin_deleted",
            "target_type": "review",
            "target_id": review.json()["id"],
            "facility_id": facility_id,
            "student_id": student.id,
            "reservation_id": reservation_id,
            "created_at": "2026-06-02T00:00:00Z",
        }
    ]
    assert {entry["action_type"] for entry in admin_actor_logs.json()} == {
        "review.admin_deleted",
        "staff_assignment.created",
    }
    assert len(limited_admin_logs.json()) == 1
    assert isinstance(limited_admin_logs.json()[0]["action_type"], str)
    assert student_forbidden.status_code == 403
    assert edit_attempt.status_code == 404
