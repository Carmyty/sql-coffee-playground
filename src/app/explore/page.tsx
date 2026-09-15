"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ResultsTable } from "@/components/exercise/results-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type TableMeta = {
  name: string;
  columns: Array<{
    name: string;
    dataType: string;
    isNullable: boolean;
    isPrimaryKey: boolean;
    isForeignKey: boolean;
    references?: { schema: string; table: string; column: string };
  }>;
  primaryKey: string[];
  foreignKeys: Array<{ column: string; table: string; referencedColumn: string }>;
};

type Graph = {
  schema: string;
  tables: TableMeta[];
  relations: Array<{ from: string; to: string; fromColumn: string; toColumn: string }>;
};

export default function ExplorePage() {
  const [graph, setGraph] = useState<Graph | null>(null);
  const [schemas, setSchemas] = useState<string[]>([]);
  const [schema, setSchema] = useState("coffee_chain");
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState<{ rows: Record<string, unknown>[]; questions: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setLoading(true);
      fetch(`/api/schema?schema=${encodeURIComponent(schema)}`)
        .then((res) => res.json())
        .then((data) => {
          if (cancelled) return;
          if (!data.ok) throw new Error(data.error || "No se pudo cargar el esquema");
          setSchemas(data.schemas || []);
          setGraph(data.graph);
          setSelected(data.graph.tables[0]?.name ?? null);
          setError(null);
        })
        .catch((err: Error) => {
          if (!cancelled) setError(err.message);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [schema]);

  useEffect(() => {
    if (!selected) return;
    fetch(`/api/schema/${encodeURIComponent(selected)}?schema=${encodeURIComponent(schema)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.ok) throw new Error(data.error || "No se pudo previsualizar");
        setPreview({ rows: data.rows || [], questions: data.questions || [] });
      })
      .catch((err: Error) => setError(err.message));
  }, [selected, schema]);

  const filtered = useMemo(() => {
    if (!graph) return [];
    const q = search.trim().toLowerCase();
    if (!q) return graph.tables;
    return graph.tables.filter(
      (table) =>
        table.name.includes(q) ||
        table.columns.some((column) => column.name.toLowerCase().includes(q))
    );
  }, [graph, search]);

  const current = graph?.tables.find((table) => table.name === selected) || null;

  return (
    <AppShell title="Explorar datos">
      <div className="animate-fade-up space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <label className="text-sm" htmlFor="schema-select">
            Esquema
          </label>
          <select
            id="schema-select"
            className="min-h-11 w-full rounded-lg border bg-white px-3 py-2 text-base sm:w-auto sm:min-h-0 sm:text-sm"
            value={schema}
            onChange={(event) => setSchema(event.target.value)}
          >
            {(schemas.length ? schemas : [schema]).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <Input
            className="min-h-11 w-full text-base sm:max-w-sm md:min-h-8 md:text-sm"
            placeholder="Buscar tablas o columnas"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? <p className="text-sm text-[color:var(--muted-text)]">Cargando esquema…</p> : null}
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>No se pudo explorar la base</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid min-w-0 gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Tablas</CardTitle>
              <CardDescription>{filtered.length} encontradas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <label className="sr-only" htmlFor="table-select">
                Seleccionar tabla
              </label>
              <select
                id="table-select"
                className="min-h-11 w-full rounded-lg border bg-white px-3 py-2 text-base lg:hidden"
                value={selected ?? ""}
                onChange={(event) => setSelected(event.target.value || null)}
              >
                {filtered.map((table) => (
                  <option key={table.name} value={table.name}>
                    {table.name}
                  </option>
                ))}
              </select>
              <div className="hidden max-h-[70vh] space-y-1 overflow-auto lg:block">
                {filtered.map((table) => (
                  <Button
                    key={table.name}
                    variant={selected === table.name ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelected(table.name)}
                  >
                    <span className="truncate">{table.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="min-w-0 space-y-4">
            {current ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="break-all font-[family-name:var(--font-display)] text-xl sm:text-2xl">
                      {current.name}
                    </CardTitle>
                    <CardDescription>
                      PK: {current.primaryKey.join(", ") || "—"} · FK: {current.foreignKeys.length}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {current.columns.map((column) => (
                      <div
                        key={column.name}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[color:var(--cream)] px-3 py-2"
                      >
                        <div>
                          <p className="font-medium">{column.name}</p>
                          <p className="text-xs text-[color:var(--muted-text)]">{column.dataType}</p>
                        </div>
                        <div className="flex gap-1">
                          {column.isPrimaryKey ? <Badge>PK</Badge> : null}
                          {column.isForeignKey ? <Badge variant="secondary">FK</Badge> : null}
                          {!column.isNullable ? <Badge variant="outline">NOT NULL</Badge> : null}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Relaciones</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {(graph?.relations.filter((rel) => rel.from === current.name || rel.to === current.name) || [])
                      .length === 0 ? (
                      <p className="text-[color:var(--muted-text)]">Sin relaciones detectadas.</p>
                    ) : (
                      graph?.relations
                        .filter((rel) => rel.from === current.name || rel.to === current.name)
                        .map((rel) => (
                          <p key={`${rel.from}-${rel.fromColumn}-${rel.to}`} className="break-all">
                            {rel.from}.{rel.fromColumn} → {rel.to}.{rel.toColumn}
                          </p>
                        ))
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Vista previa (máx. 50)</CardTitle>
                    <CardDescription>Preguntas que puedes responder con esta tabla</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="list-disc space-y-1 pl-5 text-sm text-[color:var(--muted-text)]">
                      {(preview?.questions || []).map((question) => (
                        <li key={question}>{question}</li>
                      ))}
                    </ul>
                    <ResultsTable
                      columns={
                        preview?.rows[0]
                          ? Object.keys(preview.rows[0]).map((name) => ({ name }))
                          : []
                      }
                      rows={preview?.rows || []}
                    />
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-10 text-sm text-[color:var(--muted-text)]">
                  Selecciona una tabla para ver columnas, relaciones y una vista previa.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
