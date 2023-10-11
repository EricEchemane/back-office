import { Skeleton } from '../ui/skeleton';

export default function TableLoading() {
  return (
    <div className='px-2 py-3 space-y-4'>
      <Skeleton className='h-[2.5rem] w-full' />
      <Skeleton className='h-[2.5rem] w-full' />
      <Skeleton className='h-[2.5rem] w-full' />
      <Skeleton className='h-[2.5rem] w-full' />
      <Skeleton className='h-[2.5rem] w-full' />
    </div>
  );
}
