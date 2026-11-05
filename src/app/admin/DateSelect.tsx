"use client";

import { useMemo, useState } from "react";
import { MONTH_NAMES, daysInMonth } from "@/lib/dates";

interface Parts {
  y: string;
  m: string;
  d: string;
}

const EMPTY: Parts = { y: "", m: "", d: "" };

function parse(value: string): Parts {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? { y: match[1], m: match[2], d: match[3] } : EMPTY;
}

// A date only counts once month, day, and year are all chosen.
function compose({ y, m, d }: Parts) {
  return y && m && d ? `${y}-${m}-${d}` : "";
}

const SELECT_CLASS =
  "min-w-0 border-b border-border bg-transparent px-1 py-1.5 text-sm outline-none focus:border-foreground";
const OPTION_CLASS = "bg-background text-foreground";

export default function DateSelect({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  const [parts, setParts] = useState<Parts>(() => parse(value));
  const [seenValue, setSeenValue] = useState(value);

  // Follow outside changes to `value`, but keep a half-chosen date as typed.
  if (value !== seenValue) {
    setSeenValue(value);
    if (value !== compose(parts)) setParts(parse(value));
  }

  const years = useMemo(() => {
    const latest = new Date().getFullYear() + 2;
    const list = Array.from({ length: latest - 1999 }, (_, i) => String(latest - i));
    return parts.y && !list.includes(parts.y) ? [parts.y, ...list] : list;
  }, [parts.y]);

  const dayCount = daysInMonth(Number(parts.y) || 2024, Number(parts.m) || 1);
  const days = Array.from({ length: parts.m ? dayCount : 31 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );

  function update(patch: Partial<Parts>) {
    const next = { ...parts, ...patch };
    const max = daysInMonth(Number(next.y) || 2024, Number(next.m) || 1);
    if (next.d && Number(next.d) > max) next.d = String(max).padStart(2, "0");
    setParts(next);
    setSeenValue(compose(next));
    onChange(compose(next));
  }

  function clear() {
    setParts(EMPTY);
    setSeenValue("");
    onChange("");
  }

  const partial = !required && !compose(parts) && (parts.y || parts.m || parts.d);

  return (
    <div role="group" aria-label={label} className="flex min-w-0 flex-col gap-1.5 text-sm">
      <span>{label}</span>
      <div className="flex gap-2">
        <select
          aria-label={`${label} month`}
          required={required}
          value={parts.m}
          onChange={(event) => update({ m: event.target.value })}
          className={`${SELECT_CLASS} flex-[2]`}
        >
          <option value="" className={OPTION_CLASS}>
            Month
          </option>
          {MONTH_NAMES.map((name, index) => (
            <option key={name} value={String(index + 1).padStart(2, "0")} className={OPTION_CLASS}>
              {name}
            </option>
          ))}
        </select>
        <select
          aria-label={`${label} day`}
          required={required}
          value={parts.d}
          onChange={(event) => update({ d: event.target.value })}
          className={`${SELECT_CLASS} flex-1`}
        >
          <option value="" className={OPTION_CLASS}>
            Day
          </option>
          {days.map((day) => (
            <option key={day} value={day} className={OPTION_CLASS}>
              {Number(day)}
            </option>
          ))}
        </select>
        <select
          aria-label={`${label} year`}
          required={required}
          value={parts.y}
          onChange={(event) => update({ y: event.target.value })}
          className={`${SELECT_CLASS} flex-[1.4]`}
        >
          <option value="" className={OPTION_CLASS}>
            Year
          </option>
          {years.map((year) => (
            <option key={year} value={year} className={OPTION_CLASS}>
              {year}
            </option>
          ))}
        </select>
      </div>
      {!required && (parts.y || parts.m || parts.d) && (
        <p className="flex items-center gap-3 text-xs text-muted">
          {partial && <span>Choose a month, day, and year, or clear it.</span>}
          <button type="button" onClick={clear} className="hover:text-foreground">
            Clear
          </button>
        </p>
      )}
    </div>
  );
}
