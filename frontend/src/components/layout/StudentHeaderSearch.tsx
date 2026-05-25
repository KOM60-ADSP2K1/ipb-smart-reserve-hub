import { Search } from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useMemo } from "react";

function buildStudentFacilitiesSearchHref(
  pathname: string,
  currentSearchParams: URLSearchParams,
  query: string,
) {
  const normalized = query.trim();

  if (pathname.startsWith("/student/facilities")) {
    const params = new URLSearchParams(currentSearchParams);
    if (normalized) {
      params.set("q", normalized);
    } else {
      params.delete("q");
    }
    params.delete("page");
    const next = params.toString();
    return `/student/facilities${next ? `?${next}` : ""}`;
  }

  if (!normalized) {
    return "/student/facilities";
  }

  return `/student/facilities?q=${encodeURIComponent(normalized)}`;
}

export function StudentHeaderSearch() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const defaultValue = useMemo(() => searchParams.get("q") ?? "", [searchParams]);

  return (
    <form
      className="relative flex h-10 min-w-[232px] items-center text-slate-500 max-md:hidden"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const query = String(formData.get("q") ?? "");
        navigate(buildStudentFacilitiesSearchHref(pathname, searchParams, query));
      }}
    >
      <label className="relative flex h-full w-full items-center">
        <span className="sr-only">Cari fasilitas</span>
        <Search aria-hidden="true" className="absolute left-4 text-slate-400" size={18} />
        <input
          className="h-10 w-[250px] rounded-full border border-[#dbe2ea] bg-gradient-to-b from-white to-slate-50 py-2.5 pl-[42px] pr-4 text-[13px] font-medium leading-5 outline-none focus:border-[#10b981] focus:bg-white"
          defaultValue={defaultValue}
          name="q"
          placeholder="Cari fasilitas..."
          type="search"
        />
      </label>
    </form>
  );
}
