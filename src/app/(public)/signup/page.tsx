'use client';

import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { NewUser, newUserSchema } from './zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { createUser } from './actions';
import Link from 'next/link';

export default function SignupPage() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<NewUser>({
    resolver: zodResolver(newUserSchema),
  });

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<NewUser> = async (data) => {
    setLoading(true);
    const res = await createUser(data);
    setLoading(false);

    if (res.error) {
      toast({
        description: res.error,
        variant: 'destructive',
      });
    } else {
      reset();
      toast({
        title: 'Account created successfully',
        description: 'You can now log in to your account',
      });
    }
  };

  return (
    <div className='grid place-items-center min-h-screen'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='m-auto p-7 grid gap-8 w-[450px] border'
      >
        <Heading order={4} className='text-center'>
          Sign up for a Back Office Account
        </Heading>
        <Input
          {...register('email')}
          placeholder='Email'
          error={errors.email?.message}
          type='email'
        />
        <Input
          {...register('username')}
          placeholder='Username'
          error={errors.username?.message}
        />
        <Input
          {...register('password')}
          placeholder='Password'
          type='Password'
          error={errors.password?.message}
        />
        <Input
          {...register('confirmPassword')}
          placeholder='Confirm password'
          type='Password'
          error={errors.confirmPassword?.message}
        />
        <Button loading={loading}> Create account </Button>

        <div className='text-center text-sm'>
          Already have an account?{' '}
          <Link href={'/login'} className='underline'>
            Login
          </Link>{' '}
          instead
        </div>
      </form>
    </div>
  );
}
