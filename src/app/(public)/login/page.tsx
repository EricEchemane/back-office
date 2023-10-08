'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heading } from '@/components/ui/heading';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { ElementRef, FormEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [loading, setIsLoading] = useState(false);
  const username = useRef<ElementRef<'input'>>(null);
  const password = useRef<ElementRef<'input'>>(null);

  async function login(e: FormEvent) {
    e.preventDefault();

    setIsLoading(true);

    const res = await signIn('credentials', {
      username: username.current?.value,
      password: password.current?.value,
      redirect: false,
    });

    setIsLoading(false);

    if (res?.ok) {
      const redirectTo = searchParams.get('redirect-to') ?? '/';
      window.location.href = window.location.origin + redirectTo;
      return;
    }

    if (res?.status === 401) {
      toast({
        description:
          'Login failed, make sure your username and password are correct',
        variant: 'destructive',
      });
      return;
    }

    toast({
      description: res?.error ?? 'Something went wrong, please try again later',
      variant: 'destructive',
    });
  }

  return (
    <div className='min-h-screen grid place-items-center'>
      <form onSubmit={login} className='m-auto p-7 grid gap-8 w-[400px] border'>
        <Heading order={4} className='text-center'>
          Login to Back Office
        </Heading>

        <Input
          className='text-black'
          ref={username}
          type='text'
          placeholder='Username'
          required
          autoFocus
        />

        <Input
          ref={password}
          type='password'
          placeholder='Password'
          required
          className='text-black'
        />

        <div className='grid gap-2'>
          <Button loading={loading}>Login</Button>
          <div className='text-center text-sm'>or</div>
          <Button
            type='button'
            variant={'outline'}
            onClick={() => signIn('google')}
          >
            Continue with Google
          </Button>
        </div>

        <div className='text-center text-xs'>
          {"Don't have an account?"}{' '}
          <Link className='underline' href={'/signup'}>
            Create
          </Link>{' '}
          one
        </div>
      </form>
    </div>
  );
}
