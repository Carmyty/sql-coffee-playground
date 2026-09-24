"use client";

import CodeMirror from "@uiw/react-codemirror";
import { sql, MSSQL } from "@codemirror/lang-sql";
import { indentWithTab } from "@codemirror/commands";
import { keymap, EditorView, placeholder as placeholderExt } from "@codemirror/view";
import { HighlightStyle, indentUnit, syntaxHighlighting } from "@codemirror/language";
import { tags as highlightTags } from "@lezer/highlight";
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

  const extensions = useMemo(() => {
    const highlight = HighlightStyle.define([
      {
        tag: highlightTags.keyword,
        color: isDark ? "#7dd3a0" : "#1f6b45",
        fontWeight: "700",
      },
      { tag: highlightTags.string, color: isDark ? "#e8c07d" : "#9a6b16" },
      { tag: highlightTags.number, color: isDark ? "#d4a5ff" : "#7a3daf" },
      {
        tag: highlightTags.comment,
        color: isDark ? "#7d8b84" : "#6b7a72",
        fontStyle: "italic",
      },
      { tag: highlightTags.operator, color: isDark ? "#c9d4ce" : "#3d4a43" },
      { tag: highlightTags.typeName, color: isDark ? "#9ecbff" : "#255f9a" },
      { tag: highlightTags.name, color: isDark ? "#e8efe9" : "#15231c" },
    ]);

    return [
      sql({
        dialect: MSSQL,
        schema: schema || {},
        upperCaseKeywords: true,
      }),
      syntaxHighlighting(highlight),
      indentUnit.of("  "),
      keymap.of([indentWithTab]),
      EditorView.lineWrapping,
      placeholderExt(placeholder),
      EditorView.theme({
        "&": {
          fontSize: "14px",
          height: "100%",
          backgroundColor: isDark ? "#1a221e" : "#ffffff",
          color: isDark ? "#e8efe9" : "#15231c",
        },
        ".cm-scroller": { overflow: "auto" },
        ".cm-content": {
          minHeight: "100%",
          padding: "12px",
          caretColor: isDark ? "#6fbf8c" : "#2f6b4a",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        },
        ".cm-gutters": {
          backgroundColor: isDark ? "#222c27" : "#f3f7f4",
          color: isDark ? "#a7b5ad" : "#4d5c54",
          borderRight: isDark ? "1px solid #2f3b34" : "1px solid #d5ddd8",
        },
        ".cm-activeLine": { backgroundColor: isDark ? "#24332a88" : "#e4f2ea88" },
        ".cm-activeLineGutter": { backgroundColor: isDark ? "#24332a" : "#e4f2ea" },
        "&.cm-focused": { outline: "none" },
      }),
    ];
  }, [schema, placeholder, isDark]);

  return (
    <div className="h-full overflow-hidden rounded-xl border-2 border-[color:var(--accent)]/40 bg-[color:var(--surface)] shadow-sm">
      <CodeMirror
        value={value}
        height={height}
        theme="none"
        extensions={extensions}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: true,
          indentOnInput: true,
          tabSize: 2,
        }}
        aria-label={ariaLabel}
      />
    </div>
  );
}
