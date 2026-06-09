"use client";

/**
 * Row actions for the dashboard properties table: edit, toggle visibility,
 * delete. Calls the auth-guarded admin Server Actions and refreshes the route.
 */
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { deleteProperty, setPropertyActive } from "@/lib/admin-actions";

export interface PropertyRowActionsProps {
  id: string;
  active: boolean;
}

export default function PropertyRowActions({ id, active }: PropertyRowActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function toggleVisibility() {
    startTransition(async () => {
      await setPropertyActive(id, !active);
      router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      const result = await deleteProperty(id);
      if (result.ok) router.refresh();
      setConfirming(false);
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/dashboard/properties/${id}/edit`}
        aria-label="Edit listing"
        className="rounded-lg p-2 text-muted hover:bg-background hover:text-ink"
      >
        <Pencil className="h-4 w-4" />
      </Link>

      <button
        type="button"
        onClick={toggleVisibility}
        disabled={pending}
        aria-label={active ? "Hide from site" : "Show on site"}
        className="rounded-lg p-2 text-muted hover:bg-background hover:text-ink disabled:opacity-50"
      >
        {active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </button>

      {confirming ? (
        <span className="flex items-center gap-1">
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            className="rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white disabled:opacity-50"
          >
            {pending ? "..." : "Confirm"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-md px-2 py-1 text-xs font-medium text-muted hover:bg-background"
          >
            Cancel
          </button>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          aria-label="Delete listing"
          className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
