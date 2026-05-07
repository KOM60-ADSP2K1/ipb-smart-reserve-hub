export type UserRole = "student" | "staff" | "super_admin";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface FacilityCatalogItem {
  id: string;
  name: string;
  location: string;
  capacity: number;
  category: string;
  cover_image_url: string | null;
  rating_average: number | null;
  review_count: number;
  price_summary: string;
  open_hours_summary: string;
}
