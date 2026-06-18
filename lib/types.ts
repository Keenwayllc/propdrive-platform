/**
 * PropDrive — Core TypeScript domain types.
 *
 * These interfaces mirror the Supabase schema defined in
 * `scripts/supabase-migrations.sql`. Keep them in sync when the schema changes.
 */

/** A user account in the platform (the agent/admin). */
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: ProfileRole;
  created_at: string;
  updated_at: string;
}

export type ProfileRole = "agent" | "admin" | "staff";

/** A single homepage headline stat (e.g. "127 Homes closed"). */
export interface SiteStat {
  value: number;
  suffix: string;
  label: string;
}

/** Editable marketing copy that powers the public-facing website. */
export interface SiteSettings {
  id: string;
  company_name: string;
  hero_title: string;
  hero_subtitle: string;
  cta_text: string;
  service_area: string;
  primary_cta: string;
  secondary_cta: string;
  about_title: string;
  about_text: string;
  buyer_text: string;
  seller_text: string;
  footer_text: string;
  contact_phone: string;
  contact_email: string;
  office_address: string;
  social_links: SocialLinks;
  stats: SiteStat[];
  created_at: string;
  updated_at: string;
}

/** A rotating hero banner slide shown at the top of the homepage. */
export interface Banner {
  id: string;
  image_url: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  secondary_cta_text: string;
  secondary_cta_link: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

/** A client testimonial shown on the homepage. */
export interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_detail: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

/** A neighborhood / market area shown across the marketing site. */
export interface Neighborhood {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  blurb: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  zillow?: string;
}

/** Visual identity settings used to white-label the platform per buyer. */
export interface BrandSettings {
  id: string;
  logo_url: string | null;
  logo_light_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  hero_image_url: string | null;
  agent_photo_url: string | null;
  company_name: string;
  agent_name: string;
  license_number: string;
  brokerage_name: string;
  created_at: string;
  updated_at: string;
}

export type PropertyStatus =
  | "active"
  | "pending"
  | "sold"
  | "coming_soon"
  | "off_market";

export type PropertyType =
  | "single_family"
  | "condo"
  | "townhouse"
  | "multi_family"
  | "land"
  | "commercial";

/** A real-estate listing. */
export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  lot_size: number | null;
  property_type: PropertyType;
  status: PropertyStatus;
  description: string;
  features: string[];
  image_urls: string[];
  map_address: string;
  featured: boolean;
  active: boolean;
  lat: number | null;
  lng: number | null;
  created_at: string;
  updated_at: string;
}

/** A blog / market-insights article. */
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image_url: string;
  author: string;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

/** A buyer's saved search; powers new-listing email alerts. */
export interface SavedSearch {
  id: string;
  email: string;
  query: string;
  property_type: string;
  min_price: number | null;
  max_price: number | null;
  last_alerted_at: string | null;
  created_at: string;
}

export type LeadType = "buyer" | "seller" | "general" | "valuation";

export type LeadStatus = "new" | "contacted" | "qualified" | "closed" | "lost";

export type PreferredContact = "email" | "phone" | "text";

/** An inbound enquiry captured by any public form. */
export interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  lead_type: LeadType;
  message: string | null;
  property_interest: string | null;
  timeline: string | null;
  budget: string | null;
  address: string | null;
  preferred_contact: PreferredContact;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export type AppointmentType =
  | "showing"
  | "consultation"
  | "valuation"
  | "open_house"
  | "call";

export type AppointmentStatus =
  | "requested"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

/** A scheduled showing/consultation tied (optionally) to a lead. */
export interface Appointment {
  id: string;
  lead_id: string | null;
  lead_name: string;
  email: string;
  phone: string | null;
  property: string | null;
  appointment_date: string;
  appointment_time: string;
  appointment_type: AppointmentType;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/** Generic shape returned by data helpers so callers can handle errors. */
export interface Result<T> {
  data: T | null;
  error: string | null;
}
