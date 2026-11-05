"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type SaveAction = "created" | "updated" | "deleted";

export function useContentApi(endpoint: string) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ slug: string; action: SaveAction } | null>(null);

  // Resolves true on success. On success the server-rendered lists are
  // refreshed so the "edit" pickers reflect the change right away.
  async function send(
    method: "POST" | "PUT" | "DELETE",
    payload: Record<string, unknown>,
    action: SaveAction,
  ): Promise<boolean> {
    setStatus("submitting");
    setError("");

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus("error");
        setError(data.error ?? "Something went wrong.");
        return false;
      }

      setStatus("idle");
      setResult({ slug: String(data.slug ?? payload.slug ?? ""), action });
      router.refresh();
      return true;
    } catch {
      setStatus("error");
      setError("Couldn't reach the server. Check your connection and try again.");
      return false;
    }
  }

  return { status, error, result, clearResult: () => setResult(null), send };
}
