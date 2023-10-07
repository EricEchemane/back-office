'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heading } from '@/components/ui/heading';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { ElementRef, FormEvent, useRef, useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
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

    if (res?.error) {
      setIsLoading(false);
      return;
    }

    const redirectTo = searchParams.get('redirect-to') ?? '/';
    window.location.href = window.location.origin + redirectTo;
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

        <Button>{isLoading ? 'Loading...' : 'Login'}</Button>
        <div className='text-center'>
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
