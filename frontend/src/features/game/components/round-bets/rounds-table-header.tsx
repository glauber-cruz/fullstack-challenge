import { TableHead, TableHeader, TableRow } from "@/src/shared/components/ui/table";

export function RoundsTableHeader() {
  return (
    <TableHeader>
      <TableRow className="border-white/10">
        <TableHead className="px-3 text-xs uppercase tracking-widest text-slate-400">
          Usuario
        </TableHead>
        <TableHead className="px-3 text-xs uppercase tracking-widest text-slate-400">
          Valor
        </TableHead>
        <TableHead className="px-3 text-xs uppercase tracking-widest text-slate-400">
          Status
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}
