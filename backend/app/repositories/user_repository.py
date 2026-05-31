from typing import Protocol

from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import AuditLog, FacilityReview, FacilityStaffAssignment, Notification, Reservation, User, UserRole


class UserRepositoryError(Exception):
    pass


class DuplicateUserEmail(UserRepositoryError):
    pass


class UserRepository(Protocol):
    def add(self, user: User) -> User:
        raise NotImplementedError

    def find_by_email(self, email: str) -> User | None:
        raise NotImplementedError

    def get_by_id(self, user_id: str) -> User | None:
        raise NotImplementedError

    def list_users(
        self,
        *,
        role: UserRole | None = None,
        is_active: bool | None = None,
        search: str | None = None,
        offset: int = 0,
        limit: int = 50,
    ) -> tuple[list[User], int]:
        raise NotImplementedError

    def set_active_status(self, user_id: str, *, is_active: bool) -> User | None:
        raise NotImplementedError

    def update_basic_profile(self, user_id: str, *, email: str, full_name: str) -> User | None:
        raise NotImplementedError

    def reset_password(self, user_id: str, *, password_hash: str) -> User | None:
        raise NotImplementedError

    def delete_user(self, user_id: str) -> User | None:
        raise NotImplementedError

    def user_has_references(self, user_id: str) -> bool:
        raise NotImplementedError


class SqlAlchemyUserRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def add(self, user: User) -> User:
        self._session.add(user)
        try:
            self._session.flush()
        except IntegrityError as exc:
            raise DuplicateUserEmail from exc
        return user

    def find_by_email(self, email: str) -> User | None:
        return self._session.scalar(select(User).where(User.email == email))

    def get_by_id(self, user_id: str) -> User | None:
        return self._session.get(User, user_id)

    def list_users(
        self,
        *,
        role: UserRole | None = None,
        is_active: bool | None = None,
        search: str | None = None,
        offset: int = 0,
        limit: int = 50,
    ) -> tuple[list[User], int]:
        filters = []
        if role is not None:
            filters.append(User.role == role)
        if is_active is not None:
            filters.append(User.is_active.is_(is_active))
        if search:
            normalized_search = f"%{search.lower().strip()}%"
            filters.append(
                (func.lower(User.email).like(normalized_search))
                | (func.lower(User.full_name).like(normalized_search))
                | (func.lower(User.nim).like(normalized_search))
            )

        total = self._session.scalar(select(func.count()).select_from(User).where(*filters)) or 0
        users = list(
            self._session.scalars(
                select(User)
                .where(*filters)
                .order_by(User.created_at.desc(), User.id.desc())
                .offset(offset)
                .limit(limit)
            )
        )
        return users, total

    def set_active_status(self, user_id: str, *, is_active: bool) -> User | None:
        user = self._session.get(User, user_id)
        if user is None:
            return None
        user.is_active = is_active
        self._session.flush()
        return user

    def update_basic_profile(self, user_id: str, *, email: str, full_name: str) -> User | None:
        user = self._session.get(User, user_id)
        if user is None:
            return None
        user.email = email
        user.full_name = full_name
        try:
            self._session.flush()
        except IntegrityError as exc:
            raise DuplicateUserEmail from exc
        return user

    def reset_password(self, user_id: str, *, password_hash: str) -> User | None:
        user = self._session.get(User, user_id)
        if user is None:
            return None
        user.password_hash = password_hash
        self._session.flush()
        return user

    def delete_user(self, user_id: str) -> User | None:
        user = self._session.get(User, user_id)
        if user is None:
            return None
        self._session.delete(user)
        self._session.flush()
        return user

    def user_has_references(self, user_id: str) -> bool:
        return any(
            self._session.scalar(statement)
            for statement in (
                select(Reservation.id).where(Reservation.student_id == user_id).limit(1),
                select(FacilityReview.id).where(FacilityReview.student_id == user_id).limit(1),
                select(FacilityStaffAssignment.id).where(FacilityStaffAssignment.staff_id == user_id).limit(1),
                select(Notification.id).where(Notification.recipient_id == user_id).limit(1),
                select(AuditLog.id).where(or_(AuditLog.actor_id == user_id, AuditLog.student_id == user_id)).limit(1),
            )
        )
