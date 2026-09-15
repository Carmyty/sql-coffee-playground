"use client";

import dynamic from "next/dynamic";
import { useState, useSyncExternalStore } from "react";

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
    <div className="flex h-[min(40svh,20rem)] min-h-[200px] items-center justify-center rounded-xl border border-[color:var(--cream)] bg-white text-sm text-[color:var(--muted-text)] md:h-[320px]">
      Cargando editor SQL…
    </div>
  ),
});

function useIsClient() {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
}

function useResponsiveEditorHeight(desktopHeight: string) {
  return useSyncExternalStore(
    (onStoreChange) => {
      const media = window.matchMedia("(min-width: 768px)");
      media.addEventListener("change", onStoreChange);
      return () => media.removeEventListener("change", onStoreChange);
    },
    () => (window.matchMedia("(min-width: 768px)").matches ? desktopHeight : "220px"),
    () => desktopHeight
  );
}

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
  const mounted = useIsClient();
  const editorHeight = useResponsiveEditorHeight(height);

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
              className="min-h-11 text-xs text-[color:var(--muted-text)] underline md:min-h-0"
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
          className="min-h-[200px] w-full resize-y rounded-xl border-2 border-[color:var(--coffee-mid)] bg-white p-3 font-mono text-base leading-6 text-[color:var(--coffee-dark)] shadow-sm outline-none ring-[color:var(--terracotta)] placeholder:text-[color:var(--muted-text)] focus:ring-2 md:min-h-[280px] md:p-4 md:text-sm"
          style={{ height: editorHeight }}
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
          className="min-h-11 text-xs text-[color:var(--muted-text)] underline md:min-h-0"
          onClick={() => setUseHighlight(false)}
        >
          Editor simple
        </button>
      </div>
      <CodeMirrorEditor
        value={value}
        onChange={onChange}
        schema={schema}
        height={editorHeight}
        ariaLabel={ariaLabel}
        placeholder={placeholder}
      />
    </div>
  );
}
