export default function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
      <span className="inline-block rounded-full bg-background px-3 py-1 text-xs font-medium text-muted">
        Coming soon
      </span>
      <h2 className="mt-4 text-2xl font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">
        {description}
      </p>
    </div>
  );
}
