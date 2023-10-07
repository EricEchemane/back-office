'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { ElementRef, FormEvent, useRef, useState } from 'react';

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
    <form onSubmit={login} className='max-w-sm m-auto p-7 grid gap-8'>
      <h1> Please login </h1>

      <input
        className='text-black'
        ref={username}
        type='text'
        placeholder='Username'
        required
        autoFocus
      />
      <input
        ref={password}
        type='password'
        placeholder='Password'
        required
        className='text-black'
      />

      <button>{isLoading ? 'Loading...' : 'Login'}</button>
    </form>
  );
}
