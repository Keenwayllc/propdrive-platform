/**
 * PropDrive — Zod validation schemas for all public & dashboard forms.
 *
 * Each schema exports an inferred TypeScript type so forms get end-to-end
 * type-safety with react-hook-form's zodResolver.
 */
import { z } from "zod";

// Validate by digit count (7–15, per E.164) rather than a rigid shape, so
// "+1 (310) 555-0148", "310-555-0148 x12", and "3105550148" all pass while
// junk is still rejected.
function isValidPhone(v: string): boolean {
  const digits = v.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}
const requiredPhone = z
  .string()
  .refine(isValidPhone, "Please enter a valid phone number.");

/** Shared, generic lead capture (buyer / seller / contact). */
export const leadFormSchema = z.object({
  full_name: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid email address."),
  phone: requiredPhone.optional().or(z.literal("")),
  lead_type: z.enum(["buyer", "seller", "general", "valuation"]),
  message: z.string().max(2000).optional().or(z.literal("")),
  property_interest: z.string().max(255).optional().or(z.literal("")),
  timeline: z.string().max(120).optional().or(z.literal("")),
  budget: z.string().max(120).optional().or(z.literal("")),
  preferred_contact: z.enum(["email", "phone", "text"]),
});
export type LeadFormValues = z.infer<typeof leadFormSchema>;

/** Schedule-a-showing form. */
export const scheduleShowingSchema = z.object({
  lead_name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  phone: requiredPhone,
  property: z.string().min(1, "Please enter the property address."),
  appointment_date: z.string().min(1, "Please choose a date."),
  appointment_time: z.string().min(1, "Please choose a time."),
  appointment_type: z.enum([
    "showing",
    "consultation",
    "valuation",
    "open_house",
    "call",
  ]),
  notes: z.string().max(1000).optional().or(z.literal("")),
});
export type ScheduleShowingValues = z.infer<typeof scheduleShowingSchema>;

/** Home valuation request form. */
export const homeValuationSchema = z.object({
  full_name: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid email address."),
  phone: requiredPhone,
  address: z.string().min(5, "Please enter the property address."),
  timeline: z.string().max(120).optional().or(z.literal("")),
  message: z.string().max(1000).optional().or(z.literal("")),
});
export type HomeValuationValues = z.infer<typeof homeValuationSchema>;

/** Sign-in form. */
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});
export type LoginValues = z.infer<typeof loginSchema>;

/** Forgot-password form. */
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

/** Property create/edit (dashboard). Numbers are coerced from form strings. */
export const propertyInputSchema = z.object({
  title: z.string().min(2, "Title is required."),
  address: z.string().optional().default(""),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1).default("CA"),
  zip: z.string().optional().default(""),
  price: z.coerce.number().min(0, "Price must be 0 or more."),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().min(0),
  square_feet: z.coerce.number().int().min(0),
  lot_size: z.coerce.number().min(0).nullable().optional(),
  property_type: z.enum([
    "single_family",
    "condo",
    "townhouse",
    "multi_family",
    "land",
    "commercial",
  ]),
  status: z.enum(["active", "pending", "sold", "coming_soon", "off_market"]),
  description: z.string().optional().default(""),
  features: z.array(z.string()).default([]),
  image_urls: z.array(z.string()).default([]),
  map_address: z.string().optional().default(""),
  lat: z.coerce.number().nullable().optional(),
  lng: z.coerce.number().nullable().optional(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});
export type PropertyInput = z.infer<typeof propertyInputSchema>;

/** One homepage stat. Value is coerced from the form's string input. */
export const siteStatSchema = z.object({
  value: z.coerce.number(),
  suffix: z.string().max(8).default(""),
  label: z.string().min(1, "Label is required."),
});

export const DEFAULT_STATS = [
  { value: 127, suffix: "", label: "Homes closed" },
  { value: 11, suffix: "", label: "Avg. days on market" },
  { value: 98.2, suffix: "%", label: "Of list price" },
];

/** Editable marketing copy (site_settings). */
export const siteSettingsSchema = z.object({
  company_name: z.string().min(1, "Company name is required."),
  hero_title: z.string().default(""),
  hero_subtitle: z.string().default(""),
  about_title: z.string().default(""),
  about_text: z.string().default(""),
  footer_text: z.string().default(""),
  contact_phone: z.string().default(""),
  contact_email: z.string().default(""),
  office_address: z.string().default(""),
  social_links: z
    .object({
      facebook: z.string().optional().default(""),
      instagram: z.string().optional().default(""),
      linkedin: z.string().optional().default(""),
    })
    .default({ facebook: "", instagram: "", linkedin: "" }),
  stats: z.array(siteStatSchema).length(3).default(DEFAULT_STATS),
});
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

/** A homepage testimonial (dashboard-managed). */
export const testimonialSchema = z.object({
  quote: z.string().min(1, "Quote is required."),
  author_name: z.string().min(1, "Name is required."),
  author_detail: z.string().optional().default(""),
  sort_order: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
});
export type TestimonialInput = z.infer<typeof testimonialSchema>;

/** A blog / market-insights post (dashboard-managed). */
export const postSchema = z.object({
  title: z.string().min(1, "Title is required."),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only."),
  excerpt: z.string().optional().default(""),
  body: z.string().optional().default(""),
  cover_image_url: z.string().optional().default(""),
  author: z.string().optional().default(""),
  published: z.boolean().default(true),
});
export type PostInput = z.infer<typeof postSchema>;

/** A buyer's saved search submitted from the public site. */
export const savedSearchSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  query: z.string().optional().default(""),
  property_type: z.string().optional().default("any"),
  min_price: z.coerce.number().min(0).nullable().optional(),
  max_price: z.coerce.number().min(0).nullable().optional(),
});
export type SavedSearchInput = z.infer<typeof savedSearchSchema>;

/** A neighborhood / market area (dashboard-managed). */
export const neighborhoodSchema = z.object({
  name: z.string().min(1, "Name is required."),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only."),
  image_url: z.string().optional().default(""),
  blurb: z.string().optional().default(""),
  sort_order: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
});
export type NeighborhoodInput = z.infer<typeof neighborhoodSchema>;

/** Editable visual identity (brand_settings). */
export const brandSettingsSchema = z.object({
  primary_color: z.string().default("#b85c38"),
  secondary_color: z.string().default("#1a1714"),
  accent_color: z.string().default("#b85c38"),
  company_name: z.string().default(""),
  agent_name: z.string().default(""),
  license_number: z.string().default(""),
  brokerage_name: z.string().default(""),
  logo_url: z.string().nullable().default(null),
  logo_light_url: z.string().nullable().default(null),
  agent_photo_url: z.string().nullable().default(null),
  hero_image_url: z.string().nullable().default(null),
});
export type BrandSettingsInput = z.infer<typeof brandSettingsSchema>;

/** Agent profile update. */
export const profileUpdateSchema = z.object({
  full_name: z.string().min(1, "Name is required."),
});
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

/** Change the signed-in agent's login email. */
export const emailUpdateSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});
export type EmailUpdateInput = z.infer<typeof emailUpdateSchema>;

/** Change the signed-in agent's password (re-verifies the current one). */
export const passwordUpdateSchema = z
  .object({
    current_password: z.string().min(1, "Enter your current password."),
    new_password: z.string().min(8, "Use at least 8 characters."),
    confirm_password: z.string().min(1, "Re-enter the new password."),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "The new passwords don't match.",
    path: ["confirm_password"],
  });
export type PasswordUpdateInput = z.infer<typeof passwordUpdateSchema>;

export const leadStatusSchema = z.enum([
  "new",
  "contacted",
  "qualified",
  "closed",
  "lost",
]);

export const appointmentStatusSchema = z.enum([
  "requested",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
]);

/** Mortgage calculator inputs (client-side only, no persistence). */
export const mortgageCalculatorSchema = z.object({
  home_price: z.number().positive(),
  down_payment: z.number().min(0),
  interest_rate: z.number().min(0).max(25),
  loan_term_years: z.number().int().positive(),
  property_tax_rate: z.number().min(0).max(10).default(1.1),
  home_insurance: z.number().min(0).default(1200),
});
export type MortgageCalculatorValues = z.infer<typeof mortgageCalculatorSchema>;
