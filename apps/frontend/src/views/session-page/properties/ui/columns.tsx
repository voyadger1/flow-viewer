import type { ColumnDef } from '@tanstack/react-table';
import { MinusIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type TProperty = {
  property: string;
  description: string;
  value?: string | number | boolean | ReactNode | null;
};

export const Columns = (): ColumnDef<TProperty>[] => {
  return [
    {
      accessorKey: 'property',
      header: 'Property',
      maxSize: 50,
      cell: ({ row }) => row.original.property,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      maxSize: 50,
      cell: ({ row }) => row.original.description,
    },
    {
      accessorKey: 'value',
      header: 'Value',
      maxSize: 50,
      cell: ({ row }) => row.original.value || <MinusIcon />,
    },
  ];
};
