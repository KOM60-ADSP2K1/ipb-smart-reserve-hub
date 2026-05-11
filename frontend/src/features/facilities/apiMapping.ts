import {
  FacilityCatalogApiItem,
  FacilityCatalogApiPage,
  FacilityCatalogItem,
  FacilityCategoryApiItem,
  FacilityCategoryOption,
  FacilityDetail,
  FacilityDetailApiResponse,
  FacilityFilterValues,
} from "./types";

export function catalogPath(values: FacilityFilterValues, page: number, pageSize: number) {
  const params = new URLSearchParams();
  const trimmedQuery = values.q.trim();
  const trimmedCapacity = values.minCapacity.trim();

  if (trimmedQuery) {
    params.set("q", trimmedQuery);
  }
  if (values.category) {
    params.set("category", values.category);
  }
  if (trimmedCapacity) {
    params.set("min_capacity", trimmedCapacity);
  }
  if (values.sort) {
    params.set("sort", values.sort);
  }
  params.set("page", String(page));
  params.set("page_size", String(pageSize));

  return `/facilities?${params.toString()}`;
}

export function mapCategory(apiCategory: FacilityCategoryApiItem): FacilityCategoryOption {
  return {
    facilityCount: apiCategory.facility_count,
    iconHint: apiCategory.icon_hint,
    id: apiCategory.id,
    name: apiCategory.name,
    slug: apiCategory.slug,
  };
}

export function mapCatalogItem(apiItem: FacilityCatalogApiItem, categories: FacilityCategoryOption[]): FacilityCatalogItem {
  return {
    capacity: apiItem.capacity,
    category: apiItem.category,
    categorySlug: categories.find((category) => category.name === apiItem.category)?.slug ?? slugify(apiItem.category),
    coverImageUrl: apiItem.cover_image_url,
    id: apiItem.id,
    location: apiItem.location,
    name: apiItem.name,
    openHoursSummary: apiItem.open_hours_summary,
    priceSummary: apiItem.price_summary,
    ratingAverage: apiItem.rating_average,
    reviewCount: apiItem.review_count,
  };
}

export function mapCatalogPage(apiPage: FacilityCatalogApiPage, categories: FacilityCategoryOption[]) {
  return {
    items: apiPage.items.map((item) => mapCatalogItem(item, categories)),
    page: apiPage.page,
    pageSize: apiPage.page_size,
    totalItems: apiPage.total_items,
    totalPages: apiPage.total_pages,
  };
}

export function mapFacilityDetail(apiDetail: FacilityDetailApiResponse, categories: FacilityCategoryOption[] = []): FacilityDetail {
  return {
    capacity: apiDetail.capacity,
    category: apiDetail.category,
    categorySlug: categories.find((category) => category.name === apiDetail.category)?.slug ?? slugify(apiDetail.category),
    contact: apiDetail.contact,
    coverImageUrl: apiDetail.images.find((image) => image.is_cover)?.url ?? apiDetail.images[0]?.url ?? null,
    description: apiDetail.description,
    id: apiDetail.id,
    images: apiDetail.images.map((image) => ({
      altText: image.alt_text,
      isCover: image.is_cover,
      url: image.url,
    })),
    location: apiDetail.location,
    name: apiDetail.name,
    openHoursSummary: apiDetail.open_hours_summary,
    price: {
      amountRupiah: apiDetail.price.amount_rupiah,
      isFree: apiDetail.price.is_free,
      summary: apiDetail.price.summary,
    },
    priceSummary: apiDetail.price.summary,
    ratingAverage: apiDetail.review_summary.rating_average,
    reviewCount: apiDetail.review_summary.review_count,
    reviews: apiDetail.reviews.map((review) => ({
      authorName: review.author_name,
      comment: review.comment,
      createdAt: review.created_at,
      id: review.id,
      rating: review.rating,
    })),
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
