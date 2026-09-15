"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

type SqlEditorProps = {
  value: string;
  onChange: (value: string) => void;
  schema?: Record<string, string[]>;
  height?: string;
  ariaLabel?: string;
  placeholder?: string;
};

const CodeMirrorEditor = dynamic(() => import("./codemirror-sql"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[320px] items-center justify-center rounded-xl border border-[color:var(--cream)] bg-white text-sm text-[color:var(--muted-text)]">
      Cargando editor SQL…
    </div>
  ),
});

export function SqlEditor({
  value,
  onChange,
  schema,
  height = "320px",
  ariaLabel = "Editor SQL",
  placeholder = "Escribe tu consulta SQL aquí…\nEjemplo: SELECT * FROM customers;",
}: SqlEditorProps) {
  // Plain textarea by default so practice always works (CodeMirror can steal focus in some clients).
  const [useHighlight, setUseHighlight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!useHighlight) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label className="text-sm font-medium text-[color:var(--coffee-dark)]" htmlFor="sql-plain-editor">
            Tu consulta SQL
          </label>
          {mounted ? (
            <button
              type="button"
              className="text-xs text-[color:var(--muted-text)] underline"
              onClick={() => setUseHighlight(true)}
            >
              Usar resaltado
            </button>
          ) : null}
        </div>
        <textarea
          id="sql-plain-editor"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          spellCheck={false}
          className="min-h-[280px] w-full resize-y rounded-xl border-2 border-[color:var(--coffee-mid)] bg-white p-4 font-mono text-sm leading-6 text-[color:var(--coffee-dark)] shadow-sm outline-none ring-[color:var(--terracotta)] placeholder:text-[color:var(--muted-text)] focus:ring-2"
          style={{ height }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium text-[color:var(--coffee-dark)]">Tu consulta SQL</label>
        <button
          type="button"
          className="text-xs text-[color:var(--muted-text)] underline"
          onClick={() => setUseHighlight(false)}
        >
          Editor simple
        </button>
      </div>
      <CodeMirrorEditor
        value={value}
        onChange={onChange}
        schema={schema}
        height={height}
        ariaLabel={ariaLabel}
        placeholder={placeholder}
      />
    </div>
  );
}
