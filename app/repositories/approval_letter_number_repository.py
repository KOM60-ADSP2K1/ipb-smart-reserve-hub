from typing import Protocol

from sqlalchemy.orm import Session

from app.models import ApprovalLetterNumberSequence


class ApprovalLetterNumberRepository(Protocol):
    def next_serial_for_year(self, year: int) -> int:
        raise NotImplementedError


class SqlAlchemyApprovalLetterNumberRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def next_serial_for_year(self, year: int) -> int:
        sequence = self._session.get(ApprovalLetterNumberSequence, year)
        if sequence is None:
            sequence = ApprovalLetterNumberSequence(year=year, next_serial=1)
            self._session.add(sequence)
            self._session.flush()

        serial = sequence.next_serial
        sequence.next_serial += 1
        self._session.flush()
        return serial
