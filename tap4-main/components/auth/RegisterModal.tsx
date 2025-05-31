'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/auth-helpers-nextjs';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (session: Session) => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSuccess, onSwitchToLogin }: RegisterModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setFullName('');
      setErrorMsg('');
    }
  }, [isOpen]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setErrorMsg(error.message || 'Đăng ký thất bại.');
    } else {
      if (data.session) {
        onSuccess(data.session);
        onClose();
        const redirectPath = searchParams.get('redirect') || '/';
        router.push(redirectPath);
      } else {
        // Supabase often doesn't return a session immediately after signup if email confirmation is required.
        // It redirects user to verify email, then session will be created.
        setErrorMsg('Đăng ký thành công. Vui lòng kiểm tra email của bạn để xác nhận tài khoản.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="relative w-full max-w-md rounded-lg bg-[#27292D] p-6 shadow-xl text-white"> {/* Matched background color */}
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header Section */}
        <div className="text-center mb-8"> {/* Increased margin bottom for header */}
          <h2 className="text-3xl font-bold text-white mb-2">Register</h2> {/* Adjusted font size and boldness */}
          <p className="text-gray-400 text-sm"> {/* Changed text color and size */}
            Already have an account?{' '}
            <span
              onClick={onSwitchToLogin}
              className="cursor-pointer text-blue-500 hover:underline" // Changed color to blue for "Login now!"
            >
              Login now!
            </span>
          </p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-4 rounded-md bg-red-800 bg-opacity-50 p-3 text-sm text-red-300">
            {errorMsg}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
              Full Name {/* Changed label text */}
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full rounded-md bg-[#393B41] border border-[#393B41] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-base" /* Matched input styles */
              placeholder="Enter your full name" /* Matched placeholder text */
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address {/* Changed label text */}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md bg-[#393B41] border border-[#393B41] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-base" /* Matched input styles */
              placeholder="Enter your email" /* Matched placeholder text */
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md bg-[#393B41] border border-[#393B41] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-base" /* Matched input styles */
              placeholder="Enter your password" /* Matched placeholder text */
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-[#997F29] py-3 text-white font-semibold hover:bg-[#806B22] transition-colors text-base" /* Matched button styles */
          >
            Register
          </button>
        </form>

        {/* Register with Google */}
        <div className="mt-4"> {/* Increased margin top for Google button */}
          <button
            className="w-full flex items-center justify-center gap-2 rounded-md bg-[#393B41] py-3 text-white font-semibold hover:bg-[#4C4F56] transition-colors text-base border border-[#525252]" /* Matched Google button styles */
            onClick={() => alert('Register with Google clicked!')} // Placeholder for Google register
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="h-5 w-5" /> {/* Google icon */}
            Register with Google
          </button>
        </div>
      </div>
    </div>
  );
}