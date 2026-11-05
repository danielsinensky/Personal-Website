import type { SaveAction } from "./useContentApi";

export default function ResultPanel({
  action,
  file,
  publicPath,
  actions,
}: {
  action: SaveAction;
  file: string;
  publicPath: string;
  actions: { label: string; onClick: () => void }[];
}) {
  return (
    <div className="mt-8 max-w-xl text-sm text-muted">
      <p>
        {action === "created" && (
          <>
            Committed as <code>{file}</code>. Vercel is redeploying now, and it&apos;ll
            be live at <code>{publicPath}</code> in about a minute.
          </>
        )}
        {action === "updated" && (
          <>
            Saved changes to <code>{file}</code>. Vercel is redeploying now, and the
            update will be live at <code>{publicPath}</code> in about a minute.
          </>
        )}
        {action === "deleted" && (
          <>
            Deleted <code>{file}</code>. Vercel is redeploying now, and it&apos;ll be
            gone from the site in about a minute.
          </>
        )}
      </p>
      <div className="mt-4 flex gap-5">
        {actions.map(({ label, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="border-b border-foreground text-sm text-foreground hover:opacity-70"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
