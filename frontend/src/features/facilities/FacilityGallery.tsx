import { FacilityImage } from "./FacilityImage";
import { FacilityImageItem } from "./types";

type FacilityGalleryProps = {
  facilityName: string;
  images: FacilityImageItem[];
};

export function FacilityGallery({ facilityName, images }: FacilityGalleryProps) {
  const safeImages = images.length ? images : [{ altText: facilityName, isCover: true, url: null }];
  const cover = safeImages.find((image) => image.isCover) ?? safeImages[0];
  const secondaryImages = safeImages.filter((image) => image !== cover).slice(0, 2);

  return (
    <section aria-label={`Galeri ${facilityName}`} className="grid min-w-0 gap-sm md:grid-cols-[1.45fr_0.55fr]">
      <FacilityImage
        alt={cover.altText}
        className="min-h-64"
        facilityName={facilityName}
        priority
        src={cover.url}
        variant="hero"
      />
      <div className="grid grid-cols-2 gap-sm md:grid-cols-1">
        {(secondaryImages.length ? secondaryImages : safeImages.slice(0, 2)).map((image, index) => (
          <FacilityImage
            alt={image.altText}
            className="min-h-32"
            facilityName={facilityName}
            key={`${image.altText}-${index}`}
            src={image.url}
            variant="gallery"
          />
        ))}
      </div>
    </section>
  );
}
