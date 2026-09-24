"use client";

import CodeMirror from "@uiw/react-codemirror";
import { sql, MSSQL } from "@codemirror/lang-sql";
import { EditorView } from "@codemirror/view";
import { placeholder as placeholderExt } from "@codemirror/view";
import { useTheme } from "next-themes";
import { useMemo } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  schema?: Record<string, string[]>;
  height?: string;
  ariaLabel?: string;
  placeholder?: string;
};

export default function CodemirrorSql({
  value,
  onChange,
  schema,
  height = "320px",
  ariaLabel = "Editor SQL",
  placeholder = "Escribe tu consulta SQL aquí…",
}: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const extensions = useMemo(
    () => [
      sql({
        dialect: MSSQL,
        schema: schema || {},
        upperCaseKeywords: true,
      }),
      EditorView.lineWrapping,
      placeholderExt(placeholder),
      EditorView.theme({
        "&": {
          fontSize: "14px",
          backgroundColor: isDark ? "#1a221e" : "#ffffff",
          color: isDark ? "#e8efe9" : "#15231c",
        },
        ".cm-content": {
          minHeight: "260px",
          padding: "12px",
          caretColor: isDark ? "#6fbf8c" : "#2f6b4a",
        },
        ".cm-gutters": {
          backgroundColor: isDark ? "#222c27" : "#e7eee9",
          color: isDark ? "#a7b5ad" : "#4d5c54",
          borderRight: isDark ? "1px solid #2f3b34" : "1px solid #d5ddd8",
        },
        ".cm-activeLine": { backgroundColor: isDark ? "#24332a88" : "#e4f2ea88" },
        ".cm-activeLineGutter": { backgroundColor: isDark ? "#24332a" : "#e4f2ea" },
        "&.cm-focused": { outline: "none" },
      }),
    ],
    [schema, placeholder, isDark]
  );

  return (
    <div className="overflow-hidden rounded-xl border-2 border-[color:var(--accent)]/40 bg-[color:var(--surface)] shadow-sm">
      <CodeMirror
        value={value}
        height={height}
        theme={isDark ? "dark" : "light"}
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
