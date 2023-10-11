'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import useUrlSearch from '@/hooks/useUrlSearch';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  count: number;
  perPage: number;
  currentPage: number;
  pathName: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  count,
  perPage,
  currentPage,
  pathName,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { search, addQuery, searchParams, handleSelectChange } =
    useUrlSearch(pathName);

  function changePage(page: number) {
    addQuery('page', page.toString());
    search();
  }

  const pagesCount = Math.ceil(count / perPage);

  return (
    <div>
      <div className='rounded-md border'>
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
