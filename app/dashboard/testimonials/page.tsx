/**
 * Testimonials manager — add, edit, and remove the client quotes shown on the
 * homepage.
 */
import TestimonialsManager from "@/components/testimonials-manager";
import { getAllTestimonials, getOpenAiKeyStatus } from "@/lib/queries";

export default async function TestimonialsPage() {
  const [testimonials, ai] = await Promise.all([
    getAllTestimonials(),
    getOpenAiKeyStatus(),
  ]);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Testimonials</h1>
        <p className="mt-1 text-sm text-muted">
          The client stories shown on your homepage. Changes go live immediately.
        </p>
      </div>
      <TestimonialsManager initial={testimonials} aiConnected={ai.source !== null} />
    </div>
  );
}
