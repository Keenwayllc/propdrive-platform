/**
 * Loading skeleton for the properties listing while data is fetched.
 */
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="mb-8 space-y-3">
        <div className="pd-skeleton h-3 w-20 rounded" />
        <div className="pd-skeleton h-10 w-80 max-w-full rounded" />
        <div className="pd-skeleton h-4 w-40 rounded" />
      </div>

      <div className="pd-skeleton h-[72px] rounded-[1.5rem]" />

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-[1.5rem] border border-line bg-surface"
          >
            <div className="pd-skeleton aspect-[4/3] w-full" />
            <div className="space-y-3 p-5">
              <div className="pd-skeleton h-5 w-24 rounded" />
              <div className="pd-skeleton h-4 w-40 rounded" />
              <div className="pd-skeleton h-4 w-32 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
