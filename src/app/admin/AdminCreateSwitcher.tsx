"use client";

import { useState } from "react";
import NewPostForm from "./NewPostForm";
import NewProjectForm from "./NewProjectForm";
import NewClientWorkForm from "./NewClientWorkForm";

type CreateType = "post" | "project" | "client-work";

const TABS: { type: CreateType; label: string }[] = [
  { type: "post", label: "New Post" },
  { type: "project", label: "New Project" },
  { type: "client-work", label: "New Client Work" },
];

export default function AdminCreateSwitcher() {
  const [active, setActive] = useState<CreateType>("post");

  return (
    <div>
      <div className="flex gap-4 border-b border-border pb-3">
        {TABS.map(({ type, label }) => (
          <button
            key={type}
            type="button"
            onClick={() => setActive(type)}
            className={`text-sm ${
              active === type
                ? "border-b border-foreground text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {active === "post" && <NewPostForm />}
      {active === "project" && <NewProjectForm />}
      {active === "client-work" && <NewClientWorkForm />}
    </div>
  );
}
