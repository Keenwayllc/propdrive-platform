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

/** Editable marketing copy that powers the public-facing website. */
export interface SiteSettings {
  id: string;
  company_name: string;
  hero_title: string;
  hero_subtitle: string;
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
  created_at: string;
  updated_at: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  zillow?: string;
}

/** Visual identity settings used to white-label the platform per buyer. */
export interface BrandSettings {
  id: string;
  logo_url: string | null;
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
  created_at: string;
  updated_at: string;
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
