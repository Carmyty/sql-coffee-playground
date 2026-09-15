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
  const [mounted, setMounted] = useState(false);
  const [preferPlain, setPreferPlain] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || preferPlain) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--coffee-dark)]" htmlFor="sql-plain-editor">
          Tu consulta SQL
        </label>
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
        {mounted ? (
          <button
            type="button"
            className="text-xs text-[color:var(--muted-text)] underline"
            onClick={() => setPreferPlain(false)}
          >
            Usar editor con resaltado
          </button>
        ) : null}
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
          onClick={() => setPreferPlain(true)}
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
