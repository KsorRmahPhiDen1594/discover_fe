'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/auth-helpers-nextjs';

interface AuthWrapperProps {
  children: React.ReactNode;
  redirectTo?: string; // Mặc định là /auth/login
  requireAuth?: boolean; // true = bắt buộc login, false = redirect nếu đã login
}

export default function AuthWrapper({
  children,
  redirectTo = '/auth/login',
  requireAuth = true,
}: AuthWrapperProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (requireAuth && !session) {
        router.replace(redirectTo); // Chưa login thì redirect
      } else if (!requireAuth && session) {
        router.replace('/'); // Nếu đã login mà vào trang login/register thì redirect về home
      }

      setLoading(false);
    };

    getSession();
  }, [requireAuth, redirectTo, router, supabase.auth]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>; // Bạn có thể dùng <Loading /> riêng
  }

  return <>{children}</>;
}
