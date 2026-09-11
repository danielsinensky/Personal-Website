export default function TechTag({ tech }: { tech: string }) {
  return (
    <span className="border border-border px-2 py-0.5 text-xs text-muted">
      {tech}
    </span>
  );
}
