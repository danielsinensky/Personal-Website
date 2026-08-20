export default function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-t border-border py-16 text-center">
      <span className="text-xs text-muted">Coming soon</span>
      <h2 className="mt-4 text-2xl font-medium">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">
        {description}
      </p>
    </div>
  );
}
