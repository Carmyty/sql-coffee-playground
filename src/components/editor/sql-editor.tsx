"use client";

import CodeMirror from "@uiw/react-codemirror";
import { sql, PostgreSQL } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { useTheme } from "next-themes";
import { useMemo } from "react";

type SqlEditorProps = {
  value: string;
  onChange: (value: string) => void;
  schema?: Record<string, string[]>;
  height?: string;
  ariaLabel?: string;
};

export function SqlEditor({
  value,
  onChange,
  schema,
  height = "260px",
  ariaLabel = "Editor SQL",
}: SqlEditorProps) {
  const { resolvedTheme } = useTheme();
  const extensions = useMemo(
    () => [
      sql({
        dialect: PostgreSQL,
        schema: schema || {},
        upperCaseKeywords: true,
      }),
      EditorView.lineWrapping,
    ],
    [schema]
  );

  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--cream)] bg-[#1e1e1e] shadow-sm">
      <CodeMirror
        value={value}
        height={height}
        theme={resolvedTheme === "dark" ? oneDark : "light"}
        extensions={extensions}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: true,
        }}
        aria-label={ariaLabel}
      />
    </div>
  );
}
