'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useUrlSearch from '@/hooks/useUrlSearch';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import DatePicker from './DatePicker';
import DateRangePicker from './DateRangePicker';

export interface InputElementConfig {
  type: 'text' | 'number' | 'email' | 'date';
  name: string;
  label?: string;
  placeholder: string;
}

export interface DateRangeElementConfig {
  type: 'date-range';
  names: [string, string]; // eg: date_from and date_to
  label?: string;
  placeholder: string;
}

interface SelectElementConfig {
  type: 'select';
  name: string;
  label?: string;
  placeholder: string;
  options: {
    value: string | number;
    label: string;
  }[];
}

export type TableSearchElementsConfig = (
  | InputElementConfig
  | SelectElementConfig
  | DateRangeElementConfig
)[];

interface Props {
  searchConfig: TableSearchElementsConfig;
  pathname: string;
}

export default function SearchComponent(props: Props) {
  const {
    reset,
    addQuery,
    searchParams,
    handleSelectChange,
    search: triggerSearch,
  } = useUrlSearch(props.pathname);

  function search(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    triggerSearch();
  }

  return (
    <form
      onSubmit={search}
      onReset={reset}
      className='p-2 flex gap-4 items-end flex-wrap'
    >
      {props.searchConfig.map((element) => {
        // ====================================================== Date Range
        if (element.type === 'date-range') {
          return (
            <DateRangePicker
              {...element}
              key={element.names.join()}
              pathname={props.pathname}
            />
          );
        }

        // ====================================================== Date
        if (element.type === 'date') {
          return (
            <DatePicker
              {...element}
              key={element.name}
              pathname={props.pathname}
            />
          );
        }

        // ====================================================== Select
        if (element.type === 'select') {
          const { name, placeholder, options, label } = element;
          return (
            <Select
              key={name}
              name={name}
              value={searchParams.get(name) ?? ''}
              onValueChange={(v) => handleSelectChange(v, name)}
            >
              <SelectTrigger className='w-[250px]' label={label} name={name}>
                <SelectValue
                  placeholder={
                    <span className='text-sm text-slate-500'>
                      {placeholder}
                    </span>
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem value={String(option.value)} key={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        // ====================================================== Text, Number, Email
        const { name, placeholder, type, label } = element;
        return (
          <Input
            key={name}
            type={type}
            name={name}
            label={label}
            className='w-[250px]'
            placeholder={placeholder}
            onChange={(e) => addQuery(name, e.target.value)}
            defaultValue={searchParams.get(name) ?? undefined}
          />
        );
      })}

      <div className='ml-auto space-x-4'>
        <Button>Search</Button>
        <Button type='reset' variant={'outline'}>
          Reset
        </Button>
      </div>
    </form>
  );
}
