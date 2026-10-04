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
import { useEffect, useState } from 'react';
import { Columns } from './columns.tsx';
import { useUnit } from 'effector-react';
import { $session } from '@/entities/session';
import { $artifacts, fetchArtifacts } from '@/entities/artifacts';
import { $processes, fetchProcesses } from '@/entities/processes';
import type { TArtifact } from '@flowviewer/shared';

interface TableArtifactsProps {
  setArtifactSelected: (artifact: TArtifact | null) => void;
  setIsOpenArtifactView: (open: boolean) => void;
}

export const TableArtifacts = ({
  setArtifactSelected,
  setIsOpenArtifactView,
}: TableArtifactsProps) => {
  const [session, artifacts, processes] = useUnit([$session, $artifacts, $processes]);

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
    onArtifactSelected: artifact => {
      setArtifactSelected(artifact);
      setIsOpenArtifactView(true);
    },
  });

  const table = useReactTable({
    data: artifacts ?? [],
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

  useEffect(() => {
    if (!session) {
      return;
    }

    fetchProcesses(session.id);
    fetchArtifacts(session.id);
  }, [session]);

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
