export type FacilityCategoryOption = {
  facilityCount: number;
  iconHint: string | null;
  id: string;
  name: string;
  slug: string;
};

export type FacilityCatalogItem = {
  capacity: number;
  category: string;
  categorySlug: string;
  coverImageUrl: string | null;
  id: string;
  location: string;
  name: string;
  openHoursSummary: string;
  priceSummary: string;
  ratingAverage: number | null;
  reviewCount: number;
};

export type FacilityImageItem = {
  altText: string;
  isCover?: boolean;
  url: string | null;
};

export type FacilityReview = {
  authorName: string;
  comment: string | null;
  createdAt: string;
  id: string;
  rating: number;
};

export type FacilityDetail = FacilityCatalogItem & {
  contact: {
    email: string | null;
    name: string;
    phone: string;
  };
  description: string;
  images: FacilityImageItem[];
  price: {
    amountRupiah: number;
    isFree: boolean;
    summary: string;
  };
  reviews: FacilityReview[];
};

export type FacilitySort = "name_asc" | "capacity_desc" | "rating_desc" | "price_asc";

export type FacilityFilterValues = {
  category: string;
  minCapacity: string;
  q: string;
  sort: FacilitySort;
};

export type FacilityCatalogApiItem = {
  capacity: number;
  category: string;
  cover_image_url: string | null;
  id: string;
  location: string;
  name: string;
  open_hours_summary: string;
  price_summary: string;
  rating_average: number | null;
  review_count: number;
};

export type FacilityCatalogApiPage = {
  items: FacilityCatalogApiItem[];
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
};

export type FacilityCategoryApiItem = {
  facility_count: number;
  icon_hint: string | null;
  id: string;
  name: string;
  slug: string;
};

export type FacilityDetailApiResponse = {
  capacity: number;
  category: string;
  contact: {
    email: string | null;
    name: string;
    phone: string;
  };
  description: string;
  id: string;
  images: {
    alt_text: string;
    is_cover: boolean;
    url: string | null;
  }[];
  location: string;
  name: string;
  open_hours_summary: string;
  price: {
    amount_rupiah: number;
    is_free: boolean;
    summary: string;
  };
  review_summary: {
    rating_average: number | null;
    review_count: number;
  };
  reviews: {
    author_name: string;
    comment: string | null;
    created_at: string;
    id: string;
    rating: number;
  }[];
};
