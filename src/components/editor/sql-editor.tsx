"use client";

import dynamic from "next/dynamic";
import { useState, useSyncExternalStore } from "react";
import { useLanguage } from "@/hooks/use-language";

type SqlEditorProps = {
  value: string;
  onChange: (value: string) => void;
  schema?: Record<string, string[]>;
  height?: string;
  ariaLabel?: string;
  placeholder?: string;
  label?: string;
};

function EditorLoading() {
  const { t } = useLanguage();
  return (
    <div className="flex h-[min(40svh,20rem)] min-h-[200px] items-center justify-center rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] text-sm text-[color:var(--muted-text)] md:h-[320px]">
      {t("loadingEditor")}
    </div>
  );
}

const CodeMirrorEditor = dynamic(() => import("./codemirror-sql"), {
  ssr: false,
  loading: () => <EditorLoading />,
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
  ariaLabel,
  placeholder,
  label,
}: SqlEditorProps) {
  const { locale, t } = useLanguage();
  const [useHighlight, setUseHighlight] = useState(false);
  const mounted = useIsClient();
  const editorHeight = useResponsiveEditorHeight(height);
  const resolvedLabel = label || t("yourSql");
  const resolvedAria = ariaLabel || t("yourSql");
  const resolvedPlaceholder =
    placeholder ||
    (locale === "en"
      ? "Write your SQL query here…\nExample: SELECT * FROM customers;"
      : "Escribe tu consulta SQL aquí…\nEjemplo: SELECT * FROM customers;");

  if (!useHighlight) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label className="text-sm font-medium text-[color:var(--ink)]" htmlFor="sql-plain-editor">
            {resolvedLabel}
          </label>
          {mounted ? (
            <button
              type="button"
              className="min-h-11 text-xs text-[color:var(--muted-text)] underline md:min-h-0"
              onClick={() => setUseHighlight(true)}
            >
              {t("useHighlight")}
            </button>
          ) : null}
        </div>
        <textarea
          id="sql-plain-editor"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={resolvedPlaceholder}
          aria-label={resolvedAria}
          spellCheck={false}
          className="min-h-[200px] w-full resize-y rounded-xl border-2 border-[color:var(--accent)]/40 bg-[color:var(--surface)] p-3 font-mono text-base leading-6 text-[color:var(--ink)] shadow-sm outline-none ring-[color:var(--accent)] placeholder:text-[color:var(--muted-text)] focus:ring-2 md:min-h-[280px] md:p-4 md:text-sm"
          style={{ height: editorHeight }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium text-[color:var(--ink)]">{resolvedLabel}</label>
        <button
          type="button"
          className="min-h-11 text-xs text-[color:var(--muted-text)] underline md:min-h-0"
          onClick={() => setUseHighlight(false)}
        >
          {t("simpleEditor")}
        </button>
      </div>
      <CodeMirrorEditor
        value={value}
        onChange={onChange}
        schema={schema}
        height={editorHeight}
        ariaLabel={resolvedAria}
        placeholder={resolvedPlaceholder}
      />
    </div>
  );
}
