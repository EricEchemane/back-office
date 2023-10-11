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
import { InputElementConfig } from './TableSearch';
import { Button } from '../ui/button';
import useUrlSearch from '@/hooks/useUrlSearch';

export default function DatePicker(
  element: InputElementConfig & { pathname: string }
) {
  const { addQuery, searchParams, search } = useUrlSearch(element.pathname);
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    const query = searchParams.get(element.name);
    if (query) setDate(new Date(query));
    else setDate(undefined);
  }, [element.name, searchParams]);

  function onCalendarChange(d: Date | undefined) {
    if (!d) return;
    addQuery(element.name, d.toISOString());
    search();
    setDate(d);
  }

  return (
    <Popover key={element.name}>
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
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date ? (
              formatDate(date.toLocaleDateString())
            ) : (
              <span>{element.placeholder}</span>
            )}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar mode='single' selected={date} onSelect={onCalendarChange} />
      </PopoverContent>
    </Popover>
  );
}
