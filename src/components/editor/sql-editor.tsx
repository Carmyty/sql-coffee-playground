"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
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
    <div className="flex h-full min-h-[180px] items-center justify-center rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] text-sm text-[color:var(--muted-text)]">
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

export function SqlEditor({
  value,
  onChange,
  schema,
  height = "220px",
  ariaLabel,
  placeholder,
  label,
}: SqlEditorProps) {
  const { locale, t } = useLanguage();
  const mounted = useIsClient();
  const resolvedLabel = label || t("yourSql");
  const resolvedAria = ariaLabel || t("yourSql");
  const resolvedPlaceholder =
    placeholder || (locale === "en" ? "SELECT …" : "SELECT …");
  const showLabel = label !== "";

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      {showLabel ? (
        <label className="shrink-0 text-sm font-medium text-[color:var(--ink)]">{resolvedLabel}</label>
      ) : null}
      {mounted ? (
        <div className="min-h-0 flex-1">
          <CodeMirrorEditor
            value={value}
            onChange={onChange}
            schema={schema}
            height={height}
            ariaLabel={resolvedAria}
            placeholder={resolvedPlaceholder}
          />
        </div>
      ) : (
        <EditorLoading />
      )}
    </div>
  );
}
