from dataclasses import dataclass
from datetime import UTC, datetime
import os
from pathlib import Path
import subprocess
import tempfile
from zoneinfo import ZoneInfo

from app.models import Reservation

BUSINESS_TIMEZONE = ZoneInfo("Asia/Jakarta")
TEMPLATE_PATH = Path(__file__).with_name("templates") / "approval-letter.tex"


@dataclass(frozen=True)
class ApprovalLetterInput:
    reservation: Reservation
    generated_at: datetime
    letter_number: str


class ApprovalLetterPdfGenerationFailed(Exception):
    pass


class ApprovalLetterPdfGenerator:
    def __init__(self, *, template_path: Path = TEMPLATE_PATH, engine: str = "tectonic") -> None:
        self._template_path = template_path
        self._engine = engine

    def generate(self, letter_input: ApprovalLetterInput) -> bytes:
        rendered = self._render_template(letter_input)
        with tempfile.TemporaryDirectory(prefix="ipb-approval-letter-") as temp_dir:
            temp_path = Path(temp_dir)
            source_path = temp_path / "approval-letter.tex"
            source_path.write_text(rendered, encoding="utf-8")
            env = os.environ.copy()
            env.setdefault("XDG_CACHE_HOME", "/tmp/tectonic-cache")
            try:
                completed = subprocess.run(
                    [self._engine, "--outdir", str(temp_path), str(source_path)],
                    check=False,
                    capture_output=True,
                    env=env,
                    timeout=30,
                )
            except (FileNotFoundError, subprocess.TimeoutExpired) as exc:
                raise ApprovalLetterPdfGenerationFailed(str(exc)) from exc

            if completed.returncode != 0:
                error = completed.stderr.decode("utf-8", errors="replace")
                raise ApprovalLetterPdfGenerationFailed(error)

            pdf_path = temp_path / "approval-letter.pdf"
            if not pdf_path.exists():
                raise ApprovalLetterPdfGenerationFailed("LaTeX engine did not produce approval-letter.pdf")
            return pdf_path.read_bytes()

    def _render_template(self, letter_input: ApprovalLetterInput) -> str:
        template = self._template_path.read_text(encoding="utf-8")
        reservation = letter_input.reservation
        generated_at = _as_utc(letter_input.generated_at).astimezone(BUSINESS_TIMEZONE)
        starts_at = _as_utc(reservation.starts_at).astimezone(BUSINESS_TIMEZONE)
        ends_at = _as_utc(reservation.ends_at).astimezone(BUSINESS_TIMEZONE)
        replacements = {
            "LETTER_NUMBER": letter_input.letter_number,
            "GENERATED_DATE": _format_indonesian_date(generated_at),
            "RESERVATION_CODE": reservation.reservation_code,
            "ACTIVITY_TITLE": reservation.activity_title,
            "ORGANIZATION_UNIT": reservation.organization_unit_name or reservation.organization_unit.name,
            "RESPONSIBLE_PERSON": reservation.student.full_name,
            "IDENTITY_NUMBER": reservation.student.nim or "-",
            "ACTIVE_CONTACT": f"{reservation.student.email} / {reservation.contact_phone or reservation.student.phone or '-'}",
            "FACILITY_NAME": reservation.facility.name,
            "FACILITY_LOCATION": reservation.facility.location,
            "RESERVATION_TIME": (
                f"{_format_indonesian_date(starts_at)}, "
                f"{starts_at:%H:%M}--{ends_at:%H:%M} WIB"
            ),
            "PARTICIPANT_COUNT": str(reservation.participant_count),
            "EXTRA_REQUIREMENTS": _extra_requirements_text(reservation),
        }
        for name, value in replacements.items():
            template = template.replace(f"<<{name}>>", _escape_latex(value))
        return template


def _extra_requirements_text(reservation: Reservation) -> str:
    labels: list[str] = []
    if reservation.extra_requirement_av_support:
        labels.append("Dukungan AV")
    if reservation.extra_requirement_logistics_coordination:
        labels.append("Koordinasi logistik")
    if reservation.extra_requirement_extra_cleaning:
        labels.append("Pembersihan tambahan")
    if reservation.extra_requirement_security_personnel:
        labels.append("Personel keamanan")
    if reservation.extra_requirement_notes:
        labels.append(reservation.extra_requirement_notes)
    if not labels:
        return "Tidak ada"
    return ", ".join(labels)


def _format_indonesian_date(value: datetime) -> str:
    months = (
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    )
    return f"{value.day} {months[value.month - 1]} {value.year}"


def _escape_latex(value: str) -> str:
    replacements = {
        "\\": r"\textbackslash{}",
        "&": r"\&",
        "%": r"\%",
        "$": r"\$",
        "#": r"\#",
        "_": r"\_",
        "{": r"\{",
        "}": r"\}",
        "~": r"\textasciitilde{}",
        "^": r"\textasciicircum{}",
    }
    return "".join(replacements.get(character, character) for character in value)


def _as_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=UTC)
    return value.astimezone(UTC)
