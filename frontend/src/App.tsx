import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DesignFoundationPreview } from "./features/design-foundation/DesignFoundationPreview";
import { AuthProvider, RequirePublic, RequireStudent, useAuth } from "./features/auth/authSession";
import { StudentAppShell } from "./features/student-shell/StudentAppShell";
import { FacilityCatalogPage } from "./features/facilities/FacilityCatalogPage";
import { FacilityDetailsPage } from "./features/facilities/FacilityDetailsPage";
import { ReservationWorkflowPreview } from "./features/reservations/ReservationWorkflowPreview";
import { LoginPage } from "./features/auth/LoginPage";
import { RegisterPage } from "./features/auth/RegisterPage";
import { StudentHomePage } from "./features/student-home/StudentHomePage";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<DesignFoundationPreview />} path="/" />
          <Route element={<DesignFoundationPreview />} path="/design-foundation" />
          <Route element={<ReservationWorkflowPreview />} path="/reservation-workflow-components" />
          <Route element={<RequirePublic />}>
            <Route element={<LoginPage />} path="/login" />
            <Route element={<RegisterPage />} path="/register" />
          </Route>
          <Route element={<RequireStudent />}>
            <Route element={<StudentShellRoute />}>
              <Route element={<StudentHomePage />} path="/student" />
              <Route element={<FacilityCatalogPage />} path="/student/facilities" />
              <Route element={<FacilityDetailsPage />} path="/student/facilities/:facilityId" />
              <Route element={<ReservationWorkflowPlaceholder title="Pilih Waktu Reservasi" />} path="/student/facilities/:facilityId/reserve/time" />
              <Route element={<ReservationWorkflowPlaceholder title="Detail Kegiatan" />} path="/student/facilities/:facilityId/reserve/details" />
              <Route element={<StudentReservationsPlaceholder />} path="/student/reservations" />
              <Route element={<ReservationWorkflowPlaceholder title="Detail Reservasi" />} path="/student/reservations/:reservationId" />
              <Route element={<ReservationWorkflowPlaceholder title="Unduh Surat Persetujuan" />} path="/student/reservations/:reservationId/letter" />
              <Route element={<ReservationWorkflowPlaceholder title="Menunggu Verifikasi Dokumen" />} path="/student/reservations/:reservationId/verification" />
              <Route element={<ReservationWorkflowPlaceholder title="Pembayaran Reservasi" />} path="/student/reservations/:reservationId/payment" />
              <Route element={<ReservationWorkflowPlaceholder title="Menunggu Verifikasi Pembayaran" />} path="/student/reservations/:reservationId/payment/waiting" />
              <Route element={<ReservationWorkflowPlaceholder title="Pembayaran Ditolak" />} path="/student/reservations/:reservationId/payment/declined" />
              <Route element={<ReservationWorkflowPlaceholder title="Reservasi Disetujui" />} path="/student/reservations/:reservationId/accepted" />
              <Route element={<ReservationWorkflowPlaceholder title="Ulas Fasilitas" />} path="/student/reservations/:reservationId/review" />
              <Route element={<StudentProfilePlaceholder />} path="/student/profile" />
            </Route>
          </Route>
          <Route element={<RolePlaceholder title="Staff Shell" />} path="/staff" />
          <Route element={<RolePlaceholder title="Admin Shell" />} path="/admin" />
          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function StudentShellRoute() {
  const { currentUser, logout } = useAuth();
  if (!currentUser) {
    return null;
  }
  return <StudentAppShell currentUser={currentUser} logout={logout} notificationCount={2} />;
}

function StudentReservationsPlaceholder() {
  return <ContentPlaceholder eyebrow="Reservasi" title="Daftar Reservasi" body="Reservasi berjalan dan riwayat mahasiswa akan memakai navigasi aktif Reservasi." />;
}

function StudentProfilePlaceholder() {
  const { currentUser, logout } = useAuth();
  return (
    <section className="grid gap-lg">
      <ContentPlaceholder eyebrow="Profil" title="Profil Mahasiswa" body="Data akun dan profil akademik berasal dari sesi mahasiswa saat ini." />
      <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-control">
        <p className="text-label-bold text-primary-container">{currentUser?.full_name}</p>
        <p className="mt-xs text-body-md text-on-surface-variant">{currentUser?.email}</p>
        <button className="mt-md rounded bg-secondary px-lg py-sm text-label-bold text-secondary-on" onClick={logout} type="button">
          Keluar
        </button>
      </div>
    </section>
  );
}

function ReservationWorkflowPlaceholder({ title }: { title: string }) {
  return (
    <section className="grid gap-lg">
      <ContentPlaceholder eyebrow="Alur Reservasi" title={title} body="Halaman alur reservasi tetap berada di dalam shell mahasiswa dan menyembunyikan pencarian global." />
      <div className="grid gap-sm rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-control">
        <p className="text-label-bold text-secondary">Langkah aktif</p>
        <p className="text-body-md text-on-surface-variant">Navigasi utama tetap tersedia, sementara konteks langkah dikelola oleh halaman workflow.</p>
      </div>
    </section>
  );
}

function ContentPlaceholder({ body, eyebrow, title }: { body: string; eyebrow: string; title: string }) {
  return (
    <section className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-control md:p-xl">
      <p className="text-label-bold uppercase text-secondary">{eyebrow}</p>
      <h1 className="mt-sm text-h2 text-primary-container">{title}</h1>
      <p className="mt-md max-w-2xl text-body-lg text-on-surface-variant">{body}</p>
    </section>
  );
}

function RolePlaceholder({ title }: { title: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-surface px-md">
      <h1 className="text-h2 text-primary-container">{title}</h1>
    </main>
  );
}
