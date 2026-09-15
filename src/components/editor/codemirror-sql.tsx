"use client";

import CodeMirror from "@uiw/react-codemirror";
import { sql, PostgreSQL } from "@codemirror/lang-sql";
import { EditorView } from "@codemirror/view";
import { placeholder as placeholderExt } from "@codemirror/view";
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
  const extensions = useMemo(
    () => [
      sql({
        dialect: PostgreSQL,
        schema: schema || {},
        upperCaseKeywords: true,
      }),
      EditorView.lineWrapping,
      placeholderExt(placeholder),
      EditorView.theme({
        "&": {
          fontSize: "14px",
          backgroundColor: "#ffffff",
          color: "#3e2723",
        },
        ".cm-content": {
          minHeight: "260px",
          padding: "12px",
          caretColor: "#6d4c41",
        },
        ".cm-gutters": {
          backgroundColor: "#f7f3ee",
          color: "#6b635c",
          borderRight: "1px solid #efe6da",
        },
        ".cm-activeLine": { backgroundColor: "#efe6da55" },
        ".cm-activeLineGutter": { backgroundColor: "#efe6da" },
        "&.cm-focused": { outline: "none" },
      }),
    ],
    [schema, placeholder]
  );

  return (
    <div className="overflow-hidden rounded-xl border-2 border-[color:var(--coffee-mid)] bg-white shadow-sm">
      <CodeMirror
        value={value}
        height={height}
        theme="light"
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
