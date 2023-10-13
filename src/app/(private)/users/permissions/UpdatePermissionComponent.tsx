'use client';

import { updatePermission } from './actions';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UpdatePermission, updatePermissionSchema } from './zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import useOnKeypress from '@/hooks/useOnKeypress';

type Props = {
  name: string;
  id: number;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function UpdatePermissionComponent({
  id,
  name,
  onSuccess,
  onCancel,
}: Props) {
  useOnKeypress('Escape', onCancel);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    formState: { errors, isDirty },
    register,
    reset,
    handleSubmit,
  } = useForm<UpdatePermission>({
    resolver: zodResolver(updatePermissionSchema),
  });

  const onSubmit: SubmitHandler<UpdatePermission> = async (data) => {
    setLoading(true);
    const res = await updatePermission(id, data.name);
    setLoading(false);

    if (res?.error) {
      toast({
        title: res.error,
        variant: 'destructive',
      });
      return;
    }

    reset();
    onSuccess();
    router.refresh();
  };

  return (
    <form className='flex items-center gap-2' onSubmit={handleSubmit(onSubmit)}>
      <Input
        autoFocus
        type='text'
        className='h-8'
        defaultValue={name}
        {...register('name')}
        error={errors.name?.message}
        placeholder='e.g. resource.action'
      />
      <Button
        size={'sm'}
        type='button'
        onClick={onCancel}
        variant={'outline'}
        disabled={loading}
      >
        Cancel
      </Button>
      <Button size={'sm'} type='submit' loading={loading} disabled={!isDirty}>
        Save
      </Button>
    </form>
  );
}
