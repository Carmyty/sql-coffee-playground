"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";

type ResultsTableProps = {
  columns: Array<{ name: string }>;
  rows: Record<string, unknown>[];
  pageSize?: number;
};

export function ResultsTable({ columns, rows, pageSize = 10 }: ResultsTableProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = useMemo(
    () => rows.slice(page * pageSize, page * pageSize + pageSize),
    [rows, page, pageSize]
  );

  if (columns.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[color:var(--cream)] bg-white p-6 text-sm text-[color:var(--muted-text)]">
        Sin columnas que mostrar. Ejecuta una consulta SELECT para ver resultados.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-auto rounded-xl border border-[color:var(--cream)] bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.name} className="whitespace-nowrap">
                  {column.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-[color:var(--muted-text)]">
                  0 filas.
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.name} className="max-w-[240px] truncate font-mono text-xs">
                      {formatCell(row[column.name])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between gap-2 text-xs text-[color:var(--muted-text)]">
        <span>
          {rows.length} fila{rows.length === 1 ? "" : "s"} · página {page + 1} / {totalPages}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}

function formatCell(value: unknown) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
