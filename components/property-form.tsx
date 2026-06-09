"use client";

/**
 * Property create/edit form (dashboard). Builds a typed PropertyInput from the
 * form fields and calls the create/update Server Action, then returns to the
 * properties list. Features and image URLs are entered one-per-line.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createProperty, updateProperty } from "@/lib/admin-actions";
import type { PropertyInput } from "@/lib/form-schemas";
import type { Property, PropertyStatus, PropertyType } from "@/lib/types";

interface PropertyFormValues {
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  square_feet: string;
  lot_size: string;
  property_type: PropertyType;
  status: PropertyStatus;
  description: string;
  features: string;
  image_urls: string;
  map_address: string;
  featured: boolean;
  active: boolean;
}

const PROPERTY_TYPES: PropertyType[] = [
  "single_family",
  "condo",
  "townhouse",
  "multi_family",
  "land",
  "commercial",
];
const STATUSES: PropertyStatus[] = [
  "active",
  "pending",
  "sold",
  "coming_soon",
  "off_market",
];

function toDefaults(property?: Property): PropertyFormValues {
  return {
    title: property?.title ?? "",
    address: property?.address ?? "",
    city: property?.city ?? "",
    state: property?.state ?? "CA",
    zip: property?.zip ?? "",
    price: property ? String(property.price) : "",
    bedrooms: property ? String(property.bedrooms) : "",
    bathrooms: property ? String(property.bathrooms) : "",
    square_feet: property ? String(property.square_feet) : "",
    lot_size: property?.lot_size != null ? String(property.lot_size) : "",
    property_type: property?.property_type ?? "single_family",
    status: property?.status ?? "active",
    description: property?.description ?? "",
    features: (property?.features ?? []).join("\n"),
    image_urls: (property?.image_urls ?? []).join("\n"),
    map_address: property?.map_address ?? "",
    featured: property?.featured ?? false,
    active: property?.active ?? true,
  };
}

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export interface PropertyFormProps {
  property?: Property;
}

export default function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter();
  const isEdit = Boolean(property);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<PropertyFormValues>({ defaultValues: toDefaults(property) });

  async function onSubmit(values: PropertyFormValues) {
    setServerError(null);
    const input: PropertyInput = {
      title: values.title,
      address: values.address,
      city: values.city,
      state: values.state,
      zip: values.zip,
      price: Number(values.price) || 0,
      bedrooms: Number(values.bedrooms) || 0,
      bathrooms: Number(values.bathrooms) || 0,
      square_feet: Number(values.square_feet) || 0,
      lot_size: values.lot_size ? Number(values.lot_size) : null,
      property_type: values.property_type,
      status: values.status,
      description: values.description,
      features: splitLines(values.features),
      image_urls: splitLines(values.image_urls),
      map_address: values.map_address,
      featured: values.featured,
      active: values.active,
    };

    const result = isEdit
      ? await updateProperty(property!.id, input)
      : await createProperty(input);

    if (!result.ok) {
      setServerError(result.error ?? "Something went wrong.");
      return;
    }
    router.push("/dashboard/properties");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-[1.5rem] border border-line bg-white p-6 shadow-sm sm:p-8"
    >
      <Field label="Title">
        <input {...register("title", { required: true })} className="form-input" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Address">
          <input {...register("address")} className="form-input" />
        </Field>
        <Field label="City">
          <input {...register("city", { required: true })} className="form-input" />
        </Field>
        <Field label="State">
          <input {...register("state")} className="form-input" />
        </Field>
        <Field label="ZIP">
          <input {...register("zip")} className="form-input" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Price ($)">
          <input type="number" min={0} {...register("price")} className="form-input" />
        </Field>
        <Field label="Beds">
          <input type="number" min={0} {...register("bedrooms")} className="form-input" />
        </Field>
        <Field label="Baths">
          <input type="number" min={0} step={0.5} {...register("bathrooms")} className="form-input" />
        </Field>
        <Field label="Sq ft">
          <input type="number" min={0} {...register("square_feet")} className="form-input" />
        </Field>
        <Field label="Lot size (acres)">
          <input type="number" min={0} step={0.01} {...register("lot_size")} className="form-input" />
        </Field>
        <Field label="Type">
          <select {...register("property_type")} className="form-input">
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.replace("_", " ")}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select {...register("status")} className="form-input">
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Map address">
          <input {...register("map_address")} className="form-input" />
        </Field>
      </div>

      <Field label="Description">
        <textarea rows={4} {...register("description")} className="form-input" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Features (one per line)">
          <textarea rows={5} {...register("features")} className="form-input" placeholder={"Infinity pool\nChef's kitchen"} />
        </Field>
        <Field label="Image URLs (one per line)">
          <textarea rows={5} {...register("image_urls")} className="form-input" placeholder={"https://...\nhttps://..."} />
        </Field>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input type="checkbox" {...register("featured")} className="h-4 w-4 accent-[#b85c38]" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input type="checkbox" {...register("active")} className="h-4 w-4 accent-[#b85c38]" />
          Active (visible on the public site)
        </label>
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent active:translate-y-px disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Create listing"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/properties")}
          className="rounded-full border border-line px-6 py-2.5 text-sm font-semibold text-ink hover:bg-background"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
