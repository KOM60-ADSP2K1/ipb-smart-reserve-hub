import { ImageOff } from "lucide-react";

type FacilityImageVariant = "card" | "gallery" | "hero" | "summary";

type FacilityImageProps = {
  alt: string;
  className?: string;
  facilityName: string;
  priority?: boolean;
  src?: string | null;
  variant?: FacilityImageVariant;
};

const variantClasses: Record<FacilityImageVariant, string> = {
  card: "aspect-[4/3]",
  gallery: "aspect-[4/3]",
  hero: "aspect-[16/9] md:aspect-[5/3]",
  summary: "aspect-square",
};

const fixtureClasses: Record<string, string> = {
  "fixture:auditorium": "from-primary-container via-secondary to-tertiary-container",
  "fixture:auditorium-side": "from-primary via-primary-container to-secondary-fixed",
  "fixture:classroom": "from-secondary-fixed via-surface-container-highest to-primary-fixed",
  "fixture:foyer": "from-tertiary-container via-surface-container-high to-secondary-container",
  "fixture:lab": "from-primary-fixed via-surface-container-low to-secondary-fixed",
  "fixture:outdoor": "from-secondary via-secondary-fixed to-surface-container-low",
  "fixture:seminar": "from-primary-container via-primary-fixed to-surface-container-high",
};

export function FacilityImage({ alt, className = "", facilityName, priority = false, src, variant = "card" }: FacilityImageProps) {
  const shouldRenderFixture = src?.startsWith("fixture:");

  return (
    <div
      className={[
        "relative overflow-hidden rounded bg-surface-container",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {src && !shouldRenderFixture ? (
        <img
          alt={alt}
          className="h-full w-full object-cover"
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          src={src}
        />
      ) : (
        <FallbackImage alt={alt} facilityName={facilityName} fixtureClass={src ? fixtureClasses[src] : undefined} />
      )}
    </div>
  );
}

function FallbackImage({ alt, facilityName, fixtureClass }: { alt: string; facilityName: string; fixtureClass?: string }) {
  const initials = facilityName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div
      aria-label={alt}
      className={[
        "flex h-full w-full items-end bg-gradient-to-br p-md text-primary-on",
        fixtureClass ?? "from-primary-container via-surface-tint to-secondary",
      ].join(" ")}
      role="img"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.36),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.18)_0_1px,transparent_1px_18px)]" />
      <div className="relative flex items-center gap-sm rounded bg-primary/35 px-md py-sm backdrop-blur-sm">
        {fixtureClass ? null : <ImageOff aria-hidden="true" className="h-4 w-4 shrink-0" />}
        <span className="text-label-bold">{initials || "IPB"}</span>
      </div>
    </div>
  );
}
