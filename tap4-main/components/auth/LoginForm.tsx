'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      const redirectPath = searchParams.get('redirect') || '/';
      router.push(redirectPath);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className='mx-auto mt-10 max-w-sm rounded-lg border p-6 shadow-md'
    >
      <h2 className='mb-4 text-xl font-semibold'>Đăng nhập</h2>

      {errorMsg && (
        <div className='mb-4 rounded bg-red-100 p-2 text-red-600'>
          {errorMsg}
        </div>
      )}

      <div className='mb-4'>
        <label htmlFor='email' className='block text-sm font-medium'>
          Email
        </label>
        <input
          type='email'
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='mt-1 w-full rounded border px-3 py-2 text-black'
        />
      </div>

      <div className='mb-6'>
        <label htmlFor='password' className='block text-sm font-medium'>
          Mật khẩu
        </label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='mt-1 w-full rounded border px-3 py-2 text-black'
        />
      </div>

      <button
        type='submit'
        className='w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700'
      >
        Đăng nhập
      </button>

      <p className='mt-4 text-center text-sm'>
        Chưa có tài khoản?{' '}
        <span
          onClick={() => router.push('/auth/register?redirect=/submit')}
          className='cursor-pointer text-blue-600 hover:underline'
        >
          Đăng ký ngay
        </span>
      </p>
    </form>
  );
}
