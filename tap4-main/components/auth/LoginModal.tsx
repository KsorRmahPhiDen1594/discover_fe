'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/auth-helpers-nextjs';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (session: Session) => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess, onSwitchToRegister }: LoginModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setErrorMsg('');
    }
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      if (data.session) {
        onSuccess(data.session);
        onClose();
        const redirectPath = searchParams.get('redirect') || '/';
        router.push(redirectPath);
      } else {
        setErrorMsg('Đăng nhập thành công nhưng không có session. Vui lòng thử lại.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="relative w-full max-w-md rounded-lg bg-[#27292D] p-6 shadow-xl text-white"> {/* Adjusted background color to match image */}
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
          <h2 className="text-3xl font-bold text-white mb-2">Login</h2> {/* Adjusted font size and boldness */}
          <p className="text-gray-400 text-sm"> {/* Changed text color and size */}
            Don't have an account yet?{' '}
            <span
              onClick={onSwitchToRegister}
              className="cursor-pointer text-blue-500 hover:underline" // Changed color to blue for "Create one now!"
            >
              Create one now!
            </span>
          </p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-4 rounded-md bg-red-800 bg-opacity-50 p-3 text-sm text-red-300">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
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
              className="w-full rounded-md bg-[#393B41] border border-[#393B41] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-base" /* Adjusted background, border, padding, text size */
              placeholder="Enter your email" /* Adjusted placeholder text */
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <span className="text-blue-500 text-sm cursor-pointer hover:underline">
                Forgot your password? {/* Added "Forgot your password?" link */}
              </span>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md bg-[#393B41] border border-[#393B41] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-base" /* Adjusted background, border, padding, text size */
              placeholder="Enter your password" /* Adjusted placeholder text */
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-[#997F29] py-3 text-white font-semibold hover:bg-[#806B22] transition-colors text-base" /* Adjusted background, padding, text size */
          >
            Login
          </button>
        </form>

        {/* Login with Google */}
        <div className="mt-4"> {/* Increased margin top for Google button */}
          <button
            className="w-full flex items-center justify-center gap-2 rounded-md bg-[#393B41] py-3 text-white font-semibold hover:bg-[#4C4F56] transition-colors text-base border border-[#525252]" /* Adjusted background, padding, text size, border */
            onClick={() => alert('Login with Google clicked!')} // Placeholder for Google login
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="h-5 w-5" /> {/* Google icon */}
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
}