/**
 * PropDrive — Zod validation schemas for all public & dashboard forms.
 *
 * Each schema exports an inferred TypeScript type so forms get end-to-end
 * type-safety with react-hook-form's zodResolver.
 */
import { z } from "zod";

const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

/** Shared, generic lead capture (buyer / seller / contact). */
export const leadFormSchema = z.object({
  full_name: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z
    .string()
    .regex(phoneRegex, "Please enter a valid phone number.")
    .optional()
    .or(z.literal("")),
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
  phone: z.string().regex(phoneRegex, "Please enter a valid phone number."),
  property: z.string().min(1, "Please select a property."),
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
  phone: z.string().regex(phoneRegex, "Please enter a valid phone number."),
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
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});
export type PropertyInput = z.infer<typeof propertyInputSchema>;

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
