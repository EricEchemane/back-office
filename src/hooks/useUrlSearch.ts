import { createUrl } from '@/utils/strings';
import { useRouter, useSearchParams } from 'next/navigation';

export default function useUrlSearch(pathname: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());

  const registerParam = (input: HTMLInputElement) => {
    input.value
      ? newParams.set(input.name, input.value)
      : newParams.delete(input.name);
  };

  const addQuery = (name: string, value: string) => {
    newParams.set(name, value);
  };

  const search = () => router.push(createUrl(pathname, newParams));
  const reset = () => router.push(pathname);

  const handleSelectChange = (value: string, name: string) => {
    if (value != '') newParams.set(name, value);
    else newParams.delete(name);
    router.push(createUrl(pathname, newParams));
  };

  return {
    handleSelectChange,
    registerParam,
    search,
    reset,
    addQuery,
    searchParams,
  };
}
