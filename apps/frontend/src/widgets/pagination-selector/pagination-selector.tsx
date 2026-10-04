import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination.tsx';
import type { TPaginationResponseDTO } from '@/entities/api/types.ts';
import { useEffect, useState } from 'react';

interface PaginationSelectorProps {
  pagination: TPaginationResponseDTO;
  onPageSelected: (page: number) => void;
  onlyIcons?: boolean;
}

const PAGES_AROUND = 3;
const PAGES_COUNT = 3;

export const PaginationSelector = ({
  pagination,
  onPageSelected,
  onlyIcons,
}: PaginationSelectorProps) => {
  const [pagesView, setPagesView] = useState<(number | 'ellipsis')[]>([]);

  const handlePageChange = (page: number) => {
    if (!pagination || page <= 0 || !pagination.totalPages || page > pagination.totalPages) {
      return;
    }

    onPageSelected(page);
  };

  const getVisiblePages = (): (number | 'ellipsis')[] => {
    if (!pagination.totalPages) {
      return [];
    }
    if (pagination.totalPages <= PAGES_COUNT * 2 + PAGES_AROUND) {
      return Array.from({ length: pagination.totalPages }, (_, i) => i + 1);
    }

    const pages = new Set<number>();

    for (let i = 1; i <= PAGES_COUNT; i++) {
      pages.add(i);
    }

    for (let i = pagination.totalPages - PAGES_COUNT + 1; i <= pagination.totalPages; i++) {
      pages.add(i);
    }

    const start = pagination.page ? Math.max(1, pagination.page - Math.floor(PAGES_AROUND / 2)) : 0;
    const end =
      pagination.page && pagination.totalPages
        ? Math.min(pagination.totalPages, pagination.page + Math.floor(PAGES_AROUND / 2))
        : 0;
    for (let i = start; i <= end; i++) {
      pages.add(i);
    }

    const sorted = [...pages].sort((a, b) => a - b);
    const result: (number | 'ellipsis')[] = [];

    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
        result.push('ellipsis');
      }
      result.push(sorted[i]);
    }

    return result;
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPagesView(getVisiblePages());
  }, [pagination]);

  return (
    <div className={'flex flex-col gap-1 items-center'}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => pagination.page && handlePageChange(pagination.page - 1)}
              text={onlyIcons ? '' : 'Previous'}
            />
          </PaginationItem>

          {pagesView.map((item, idx) =>
            item === 'ellipsis' ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink
                  onClick={() => handlePageChange(item)}
                  isActive={item === pagination.page}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => pagination.page && handlePageChange(pagination.page + 1)}
              text={onlyIcons ? '' : 'Previous'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
