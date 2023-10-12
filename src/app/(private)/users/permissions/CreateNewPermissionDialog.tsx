'use client';

import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { NewPermission, newPermissionSchema } from './zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { createNewPermission } from './actions';

export default function CreateNewPermissionDialog() {
  const [loading, setLoading] = useState<true | undefined>();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPermission>({ resolver: zodResolver(newPermissionSchema) });

  const onSubmit: SubmitHandler<NewPermission> = async (data) => {
    setLoading(true);
    const res = await createNewPermission(data.name);
    setLoading(undefined);

    if (res?.error) {
      toast({
        title: res.error,
        variant: 'destructive',
      });
      return;
    }

    setOpen(false);
    router.refresh();
    reset();
    toast({
      title: 'Permission created successfully',
    });
  };

  return (
    <Dialog open={loading || open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2' size={16} />
          New
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]' preventClose={loading}>
        <form onSubmit={handleSubmit(onSubmit)} onReset={() => reset()}>
          <DialogHeader>
            <DialogTitle>Create new permission</DialogTitle>
          </DialogHeader>

          <div className='my-4'>
            <Input
              disabled={loading}
              {...register('name')}
              label='Permission name'
              error={errors.name?.message}
              placeholder='e.g. permissions.read'
            />
          </div>

          <DialogFooter>
            <Button type='reset' variant={'outline'}>
              Reset
            </Button>
            <Button loading={loading}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
