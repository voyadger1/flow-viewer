import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table.tsx';
import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import { cn } from '@/shared/lib/utils.ts';
import { Columns } from '@/views/session-page/analytics/ui/telemetry-section/columns.tsx';
import { useUnit } from 'effector-react';
import { $session } from '@/entities/session';
import { $sessionTelemetry, fetchSessionTelemetry } from '@/entities/telemetry';
import { $processes, fetchProcesses } from '@/entities/processes';
import { useEffect, useState } from 'react';

export const TelemetrySection = () => {
  const [session, processes, sessionTelemetry] = useUnit([$session, $processes, $sessionTelemetry]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  });

  const columns = Columns({
    processes: processes,
  });

  useEffect(() => {
    if (!session) {
      return;
    }

    fetchProcesses(session.id);
    fetchSessionTelemetry(session.id);
  }, [session]);

  const table = useReactTable({
    data: sessionTelemetry ?? [],
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: pagination,
    },
  });

  return (
    <div className={'border rounded-lg overflow-hidden'}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={
                  cn(
                    // (row.original.status as TProcessStatus) === 'SUCCEEDED' && 'bg-green-600/5',
                    // (row.original.status as TProcessStatus) === 'FAILED' && 'bg-red-600/5'
                  )
                }
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={Columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
