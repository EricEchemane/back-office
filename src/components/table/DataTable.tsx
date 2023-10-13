'use client';

import React, { useEffect } from 'react';
import { Table2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

import useUrlSearch from '@/hooks/useUrlSearch';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  VisibilityState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  count: number;
  perPage: number;
  currentPage: number;
  pathName: string;
  visibilitySettings?: boolean;
  extraRightTools?: React.ReactNode;
  extraLeftTools?: React.ReactNode;
  onSelectRows?: (selectedIndeces: Record<number, boolean>) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  count,
  perPage,
  currentPage,
  pathName,
  visibilitySettings = true,
  extraLeftTools,
  extraRightTools,
  onSelectRows,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  const { search, addQuery, searchParams, handleSelectChange } =
    useUrlSearch(pathName);

  useEffect(() => {
    onSelectRows?.(rowSelection);
  }, [onSelectRows, rowSelection]);

  function changePage(page: number) {
    addQuery('page', page.toString());
    search();
  }

  const pagesCount = Math.ceil(count / perPage);
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const currentPageRows = table.getFilteredRowModel().rows;

  const noSelectedRows = selectedRows.length <= 0;
  const rowSelectionDisplayText = noSelectedRows
    ? null
    : `${selectedRows.length} of ${currentPageRows.length} ${
        currentPageRows.length > 1 ? 'rows' : 'row'
      } selected`;

  return (
    <div>
      <div className='flex items-center py-2 justify-between'>
        <div aria-label='table left tools' className='flex items-center gap-2'>
          {extraLeftTools}

          {rowSelectionDisplayText && (
            <div className='text-sm text-muted-foreground mx-2'>
              {rowSelectionDisplayText}
            </div>
          )}
        </div>

        <div aria-label='table right tools' className='flex items-center gap-2'>
          {extraRightTools}

          {visibilitySettings && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='secondary' size={'icon'} className='ml-auto'>
                  <Table2 />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className='capitalize'
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div aria-label='data table' className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='mt-2 flex justify-end items-baseline gap-1'>
        {Array.from({ length: pagesCount }).map((_, index) => {
          const page = index + 1;
          const activePage = currentPage === page;
          return (
            <Button
              key={index}
              size={'icon'}
              disabled={activePage}
              variant={activePage ? 'secondary' : 'outline'}
              onClick={() => changePage(page)}
            >
              {page}
            </Button>
          );
        })}

        <div className='mx-1'>
          <Select
            name='per_page'
            value={searchParams.get('per_page') ?? '10'}
            onValueChange={(v) => handleSelectChange(v, 'per_page')}
          >
            <SelectTrigger className='w-[70px]' name='per_page'>
              <SelectValue placeholder='Per page' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='20'>20</SelectItem>
              <SelectItem value='40'>40</SelectItem>
              <SelectItem value='80'>80</SelectItem>
              <SelectItem value='100'>100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='text-xs'>Per page</div>
      </div>
    </div>
  );
}
