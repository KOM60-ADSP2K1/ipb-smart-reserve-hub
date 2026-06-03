from dataclasses import dataclass


@dataclass(frozen=True)
class AcademicProfile:
    program_studi: str | None
    faculty: str | None
    entry_year: int | None
    degree: str | None


@dataclass(frozen=True)
class AcademicProgram:
    program_studi: str
    faculty: str
    degree: str


class AcademicProfileDeriver:
    _LEGACY_PROGRAMS = {
        "G64": AcademicProgram(
            program_studi="Ilmu Komputer",
            faculty="Fakultas Matematika dan Ilmu Pengetahuan Alam",
            degree="Sarjana",
        ),
    }

    def derive(self, nim: str | None) -> AcademicProfile:
        if nim is None:
            return _unknown_academic_profile()

        normalized_nim = nim.strip().upper()
        current_profile = _derive_current_ipb_nim(normalized_nim)
        if current_profile is not None:
            return current_profile

        program = self._LEGACY_PROGRAMS.get(normalized_nim[:3])
        if program is not None:
            return AcademicProfile(
                program_studi=program.program_studi,
                faculty=program.faculty,
                entry_year=_derive_legacy_entry_year(normalized_nim),
                degree=program.degree,
            )

        return _unknown_academic_profile()


_FACULTIES = {
    "A": "Fakultas Pertanian",
    "B": "Sekolah Kedokteran Hewan dan Biomedis",
    "C": "Fakultas Perikanan dan Ilmu Kelautan",
    "D": "Fakultas Peternakan",
    "E": "Fakultas Kehutanan dan Lingkungan",
    "F": "Fakultas Teknologi Pertanian",
    "G": "Fakultas Matematika dan Ilmu Pengetahuan Alam",
    "H": "Fakultas Ekonomi dan Manajemen",
    "I": "Fakultas Ekologi Manusia",
    "J": "Sekolah Vokasi",
    "K": "Sekolah Bisnis",
    "L": "Fakultas Kedokteran",
    "M": "Sekolah Sains Data, Matematika dan Informatika",
    "P": "Sekolah Pascasarjana",
}

_DEGREES = {
    "4": "Sarjana",
    "5": "Magister",
    "6": "Doktor",
    "9": "Profesi",
}


def _derive_current_ipb_nim(nim: str) -> AcademicProfile | None:
    if len(nim) != 11 or not nim[0].isalpha() or not nim[1:].isdigit():
        return None

    faculty_code = nim[0]
    department_or_campus_code = nim[1]
    degree_code = nim[2]
    program_code = nim[3:5]
    entry_year = _derive_current_entry_year(nim)
    program = _CURRENT_PROGRAMS.get((faculty_code, department_or_campus_code, degree_code, program_code))
    if program is None:
        program = _CURRENT_PROGRAMS.get((faculty_code, None, degree_code, program_code))

    degree = _derive_degree(faculty_code, degree_code)
    faculty = program.faculty if program is not None else _FACULTIES.get(faculty_code)
    return AcademicProfile(
        program_studi=program.program_studi if program is not None else None,
        faculty=faculty,
        entry_year=entry_year,
        degree=program.degree if program is not None else degree,
    )


def _derive_degree(faculty_code: str, degree_code: str) -> str | None:
    if faculty_code == "J" and degree_code == "4":
        return "Sarjana Terapan"
    return _DEGREES.get(degree_code)


def _derive_current_entry_year(nim: str) -> int | None:
    if not nim[5:7].isdigit():
        return None
    return 2000 + int(nim[5:7])


def _derive_legacy_entry_year(nim: str) -> int | None:
    if len(nim) < 5 or not nim[3:5].isdigit():
        return None
    if len(nim) >= 7 and nim[3:5] == "01" and nim[6].isdigit():
        return 2020 + int(nim[6])
    return 2000 + int(nim[3:5])


def _unknown_academic_profile() -> AcademicProfile:
    return AcademicProfile(
        program_studi=None,
        faculty=None,
        entry_year=None,
        degree=None,
    )


def _current_programs() -> dict[tuple[str, str | None, str, str], AcademicProgram]:
    programs = [
        ("JA41", "Komunikasi Digital dan Media", "4"),
        ("JB41", "Ekowisata", "4"),
        ("JC41", "Teknologi Rekayasa Perangkat Lunak", "4"),
        ("JD41", "Teknologi Rekayasa Komputer", "4"),
        ("JE41", "Supervisor Jaminan Mutu Pangan", "4"),
        ("JF41", "Manajemen Industri Jasa Makanan dan Gizi", "4"),
        ("JH41", "Teknologi dan Manajemen Pembenihan Ikan", "4"),
        ("JI41", "Teknologi dan Manajemen Ternak", "4"),
        ("JJ41", "Manajemen Agribisnis", "4"),
        ("JK41", "Manajemen Industri", "4"),
        ("JL41", "Analisis Kimia", "4"),
        ("JM41", "Teknik dan Manajemen Lingkungan", "4"),
        ("JN41", "Akuntansi", "4"),
        ("JP41", "Paramedik Veteriner", "4"),
        ("JT41", "Teknologi dan Manajemen Produksi Perkebunan", "4"),
        ("JW41", "Teknologi Produksi dan Pengembangan Masyarakat Pertanian", "4"),
        ("A14", "Manajemen Sumberdaya Lahan", "4"),
        ("A24", "Agronomi dan Hortikultura", "4"),
        ("A34", "Proteksi Tanaman", "4"),
        ("A44", "Arsitektur Lanskap", "4"),
        ("A51", "Smart Agriculture", "4"),
        ("B04", "Kedokteran Hewan", "4"),
        ("B14", "Sains Biomedis", "4"),
        ("C14", "Teknologi dan Manajemen Perikanan Budidaya", "4"),
        ("C24", "Manajemen Sumberdaya Perairan", "4"),
        ("C34", "Teknologi Hasil Perairan", "4"),
        ("C44", "Teknologi dan Manajemen Perikanan Tangkap", "4"),
        ("C54", "Ilmu dan Teknologi Kelautan", "4"),
        ("D14", "Teknologi Produksi Ternak", "4"),
        ("D24", "Nutrisi dan Teknologi Pakan", "4"),
        ("D34", "Teknologi Hasil Ternak", "4"),
        ("E14", "Manajemen Hutan", "4"),
        ("E24", "Teknologi Hasil Hutan", "4"),
        ("E34", "Konservasi Sumberdaya Hutan dan Ekowisata", "4"),
        ("E44", "Silvikultur", "4"),
        ("F14", "Teknik Pertanian dan Biosistem", "4"),
        ("F24", "Teknologi Pangan", "4"),
        ("F34", "Teknologi Industri Pertanian", "4"),
        ("F44", "Teknik Sipil dan Lingkungan", "4"),
        ("G01", "BioInformatika", "4"),
        ("G24", "Meteorologi Terapan", "4"),
        ("G34", "Biologi", "4"),
        ("G44", "Kimia", "4"),
        ("G74", "Fisika", "4"),
        ("G84", "Biokimia", "4"),
        ("H14", "Ekonomi Pembangunan", "4"),
        ("H24", "Manajemen", "4"),
        ("H34", "Agribisnis", "4"),
        ("H44", "Ekonomi Sumberdaya dan Lingkungan", "4"),
        ("H54", "Ilmu Ekonomi Syariah", "4"),
        ("I14", "Ilmu Gizi", "4"),
        ("I24", "Ilmu Keluarga dan Konsumen", "4"),
        ("I34", "Komunikasi dan Pengembangan Masyarakat", "4"),
        ("K14", "Bisnis", "4"),
        ("L14", "Kedokteran", "4"),
        ("M01", "Statistika dan Sains Data", "4"),
        ("M02", "Matematika", "4"),
        ("M03", "Ilmu Komputer", "4"),
        ("M04", "Aktuaria", "4"),
        ("M05", "Kecerdasan Buatan", "4"),
        ("A151", "Ilmu Tanah", "5"),
        ("A156", "Ilmu Perencanaan Wilayah", "5"),
        ("A251", "Ilmu dan Teknologi Benih", "5"),
        ("A252", "Agronomi dan Hortikultura", "5"),
        ("A253", "Pemuliaan dan Bioteknologi Tanaman", "5"),
        ("A353", "Pengendalian Hama Terpadu", "5"),
        ("A451", "Arsitektur Lanskap", "5"),
        ("B351", "Ilmu Biomedis Hewan", "5"),
        ("C151", "Ilmu Akuakultur", "5"),
        ("C251", "Pengelolaan Sumberdaya Perairan", "5"),
        ("C252", "Pengelolaan Sumberdaya Pesisir dan Lautan", "5"),
        ("C351", "Teknologi Hasil Perairan", "5"),
        ("C453", "Teknologi Perikanan Laut", "5"),
        ("C551", "Ilmu Kelautan", "5"),
        ("C552", "Teknologi Kelautan", "5"),
        ("D151", "Ilmu Produksi dan Teknologi Peternakan", "5"),
        ("D251", "Ilmu Nutrisi dan Pakan", "5"),
        ("E151", "Ilmu Pengelolaan Hutan", "5"),
        ("E251", "Ilmu dan Teknologi Hasil Hutan", "5"),
        ("E351", "Konservasi Biodiversitas Tropika", "5"),
        ("E451", "Silvikultur Tropika", "5"),
        ("F151", "Teknik Pertanian dan Biosistem", "5"),
        ("F152", "Teknologi Pascapanen", "5"),
        ("F251", "Ilmu Pangan", "5"),
        ("F252", "Teknologi Pangan", "5"),
        ("F253", "Keamanan Pangan", "5"),
        ("F351", "Teknik Industri Pertanian", "5"),
        ("F451", "Teknik Sipil dan Lingkungan", "5"),
        ("G251", "Klimatologi Terapan", "5"),
        ("G351", "Mikrobiologi", "5"),
        ("G352", "Biosains Hewan", "5"),
        ("G353", "Biologi Tumbuhan", "5"),
        ("G451", "Kimia", "5"),
        ("G751", "Biofisika", "5"),
        ("G851", "Biokimia", "5"),
        ("H051", "Ilmu Perencanaan Pembangunan Wilayah dan Pedesaan", "5"),
        ("H052", "Manajemen Pembangunan Daerah", "5"),
        ("H151", "Ilmu Ekonomi", "5"),
        ("H251", "Ilmu Manajemen", "5"),
        ("H351", "Sains Agribisnis", "5"),
        ("H451", "Ekonomi Sumberdaya dan Lingkungan", "5"),
        ("H453", "Ilmu Ekonomi Pertanian", "5"),
        ("H454", "Ekonomi Kelautan Tropika", "5"),
        ("H551", "Ilmu Ekonomi Syariah", "5"),
        ("I154", "Ilmu Gizi", "5"),
        ("I251", "Ilmu Keluarga dan Perkembangan Anak", "5"),
        ("I352", "Komunikasi Pembangunan Pertanian dan Pedesaan", "5"),
        ("I353", "Sosiologi Pedesaan", "5"),
        ("K151", "Manajemen dan Bisnis", "5"),
        ("P051", "Bioteknologi", "5"),
        ("P052", "Ilmu Pengelolaan Sumberdaya Alam dan Lingkungan", "5"),
        ("P053", "Primatologi", "5"),
        ("P054", "Pengembangan Industri Kecil Menengah", "5"),
        ("P055", "Logistik Agro-Maritim", "5"),
        ("M051", "Statistika dan Sains Data", "5"),
        ("M052", "Matematika Terapan", "5"),
        ("M053", "Ilmu Komputer", "5"),
        ("A161", "Ilmu Tanah", "6"),
        ("A262", "Agronomi dan Hortikultura", "6"),
        ("A263", "Pemuliaan dan Bioteknologi Tanaman", "6"),
        ("A361", "Entomologi", "6"),
        ("A362", "Fitopatologi", "6"),
        ("B361", "Ilmu Biomedis Hewan", "6"),
        ("C161", "Ilmu Akuakultur", "6"),
        ("C261", "Pengelolaan Sumberdaya Perairan", "6"),
        ("C262", "Pengelolaan Sumberdaya Pesisir dan Lautan", "6"),
        ("C361", "Teknologi Hasil Perairan", "6"),
        ("C463", "Teknologi Perikanan Laut", "6"),
        ("C561", "Ilmu Kelautan", "6"),
        ("C562", "Teknologi Kelautan", "6"),
        ("D161", "Ilmu Produksi dan Teknologi Peternakan", "6"),
        ("D261", "Ilmu Nutrisi dan Pakan", "6"),
        ("E161", "Ilmu Pengelolaan Hutan", "6"),
        ("E261", "Ilmu dan Teknologi Hasil Hutan", "6"),
        ("E361", "Konservasi Biodiversitas Tropika", "6"),
        ("E461", "Silvikultur Tropika", "6"),
        ("F163", "Ilmu Keteknikan Pertanian", "6"),
        ("F261", "Ilmu Pangan", "6"),
        ("F361", "Teknik Industri Pertanian", "6"),
        ("G261", "Klimatologi Terapan", "6"),
        ("G361", "Mikrobiologi", "6"),
        ("G362", "Biosains Hewan", "6"),
        ("G363", "Biologi Tumbuhan", "6"),
        ("G461", "Ilmu Kimia", "6"),
        ("G761", "Fisika", "6"),
        ("G861", "Biokimia", "6"),
        ("H061", "Ilmu Perencanaan Pembangunan Wilayah dan Pedesaan", "6"),
        ("H161", "Ilmu Ekonomi", "6"),
        ("H361", "Sains Agribisnis", "6"),
        ("H463", "Ilmu Ekonomi Pertanian", "6"),
        ("H464", "Ekonomi Kelautan Tropika", "6"),
        ("I164", "Ilmu Gizi", "6"),
        ("I261", "Ilmu Keluarga", "6"),
        ("I362", "Komunikasi Pembangunan Pertanian dan Pedesaan", "6"),
        ("I363", "Sosiologi Pedesaan", "6"),
        ("K161", "Manajemen dan Bisnis", "6"),
        ("P062", "Ilmu Pengelolaan Sumberdaya Alam dan Lingkungan", "6"),
        ("P063", "Primatologi", "6"),
        ("M061", "Statistika dan Sains Data", "6"),
        ("M063", "Ilmu Komputer", "6"),
        ("B094", "Pendidikan Profesi Dokter Hewan (PPDH)", "9"),
        ("I191", "Pendidikan Profesi Dietisien (RDN)", "9"),
        ("P091", "Pendidikan Profesi Insinyur (PPI)", "9"),
    ]
    return {
        _program_key(table_code, degree_code): _program(table_code, program_name, degree_code)
        for table_code, program_name, degree_code in programs
    }


def _program(table_code: str, program_name: str, degree_code: str) -> AcademicProgram:
    faculty_code = table_code[0]
    return AcademicProgram(
        program_studi=program_name,
        faculty=_FACULTIES[faculty_code],
        degree=_derive_degree(faculty_code, degree_code) or _DEGREES[degree_code],
    )


def _program_key(table_code: str, degree_code: str) -> tuple[str, str | None, str, str]:
    faculty_code = table_code[0]
    if faculty_code == "J" and len(table_code) >= 2 and table_code[1].isalpha():
        department_or_campus_code = None
        program_code = f"{ord(table_code[1]) - ord('A') + 1:02d}"
    elif faculty_code in {"M"} and len(table_code) == 3:
        department_or_campus_code = None
        program_code = table_code[-2:]
    else:
        department_or_campus_code = table_code[1]
        program_code = table_code[-2:]
    return (faculty_code, department_or_campus_code, degree_code, program_code)


_CURRENT_PROGRAMS = _current_programs()
