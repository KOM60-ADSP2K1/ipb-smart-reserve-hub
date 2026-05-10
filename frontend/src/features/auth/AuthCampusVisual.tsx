import campusReference from '../../assets/auth-campus-reference.png';

export function AuthCampusVisual() {
  return (
    <aside aria-label="IPB campus building" className="relative hidden min-h-screen overflow-hidden bg-primary-container lg:block">
      <img
        alt=""
        aria-hidden="true"
        className="h-full w-full object-cover object-[100%_50%]"
        src={campusReference}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/25 to-transparent" />
    </aside>
  );
}
