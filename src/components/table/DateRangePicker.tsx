'use client';

import { Calendar as CalendarIcon } from 'lucide-react';

import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/dates';
import { DateRangeElementConfig } from './TableSearch';
import { Button } from '../ui/button';
import useUrlSearch from '@/hooks/useUrlSearch';
import { DateRange } from 'react-day-picker';

export default function DateRangePicker(
  element: DateRangeElementConfig & { pathname: string }
) {
  const [dateFromName, dateToName] = element.names;

  const { addQuery, searchParams, search } = useUrlSearch(element.pathname);
  const [dateRange, setDateRange] = useState<DateRange>();

  useEffect(() => {
    const dateFromQuery = searchParams.get(dateFromName);
    const dateToQuery = searchParams.get(dateToName);
    if (dateFromQuery && dateToQuery) {
      setDateRange({
        from: new Date(dateFromQuery),
        to: new Date(dateToQuery),
      });
    } else setDateRange(undefined);
  }, [dateFromName, dateToName, searchParams]);

  function onCalendarChange(d: DateRange | undefined) {
    setDateRange(d);
    if (!d?.from || !d.to) return;
    const { from, to } = d;
    addQuery(dateFromName, from.toISOString());
    addQuery(dateToName, to.toISOString());
    search();
  }

  return (
    <Popover key={element.names.join()}>
      <PopoverTrigger asChild>
        <div>
          {element.label && (
            <label className='text-xs text-neutral-600'>
              <div className='mb-2'>{element.label}</div>
            </label>
          )}
          <Button
            type='button'
            variant={'outline'}
            className={cn(
              'w-[250px] justify-start text-left font-normal',
              !dateRange && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {dateRange?.from && dateRange?.to ? (
              `${formatDate(
                dateRange.from.toLocaleDateString()
              )} - ${formatDate(dateRange.to.toLocaleDateString())}`
            ) : (
              <span>{element.placeholder}</span>
            )}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='range'
          selected={dateRange}
          onSelect={onCalendarChange}
        />
      </PopoverContent>
    </Popover>
  );
}
