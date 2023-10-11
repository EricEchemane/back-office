'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useUrlSearch from '@/hooks/useUrlSearch';
import { useSearchParams } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface InputElementConfig {
  type: 'text' | 'email';
  name: string;
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
)[];

interface Props {
  searchConfig: TableSearchElementsConfig;
  pathname: string;
}

export default function SearchComponent(props: Props) {
  const searchParams = useSearchParams();
  const {
    reset,
    handleSelectChange,
    addQuery,
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
      className='p-2 flex gap-4 items-end'
    >
      {props.searchConfig.map((element) => {
        if (element.type === 'select') {
          const { name, placeholder, options, label } = element;
          return (
            <Select
              key={name}
              name={name}
              value={searchParams.get(name) ?? ''}
              onValueChange={(v) => handleSelectChange(v, name)}
            >
              <SelectTrigger className='w-[240px]' label={label} name={name}>
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

        const { name, placeholder, type, label } = element;
        return (
          <Input
            key={name}
            type={type}
            name={name}
            label={label}
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
