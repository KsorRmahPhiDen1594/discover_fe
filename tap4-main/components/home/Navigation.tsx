'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Button from '@/components/home/Button';
import SearchForm from '@/components/home/SearchForm';
import { Link, usePathname } from '@/app/navigation';

import BaseImage from '../image/BaseImage';
import LocaleSwitcher from '../LocaleSwitcher';
import MenuBtn from './MenuBtn';
import NavigationDrawer from './NavigationDrawer';
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
import type { Session } from '@supabase/auth-helpers-nextjs';

export default function Navigation() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const NavLinks = NAV_LINKS.map((item) => ({
    ...item,
    label: t(`${item.code}`),
  }));

  const handleLoginSuccess = (session: Session) => {
    setIsLoginModalOpen(false);
    // Logic sau khi đăng nhập thành công (tùy chọn)
  };

  const handleRegisterSuccess = (session: Session) => {
    setIsRegisterModalOpen(false);
    // Logic sau khi đăng ký thành công (tùy chọn)
  };

  return (
    <>
      <header className="bg-frosted-glass sticky left-0 top-0 z-50 flex h-[64px] bg-[#15141A] px-5 blur-[60%] filter lg:px-0">
        <nav className="mx-auto flex max-w-pc flex-1 items-center">
          <div>
            <Link className="hover:opacity-80" href="/" title={t('title')}>
              <BaseImage
                src="/images/tap4-ai.svg"
                alt={t('title')}
                title={t('title')}
                width={64}
                height={64}
                priority
                className="size-[58px] lg:size-16"
              />
            </Link>
          </div>
          {/* pc */}
          <div className="ml-auto flex h-full items-center gap-x-[46px]">
            <ul className="hidden h-full flex-1 capitalize lg:flex lg:gap-x-6">
              {pathname !== '/' && (
                <li className="flex h-full items-center">
                  <SearchForm inputClassName="my-auto !w-[160px] lg:h-8" />
                </li>
              )}
              {NavLinks.map((item) => (
                <Link key={item.code} href={item.href} title={item.code}>
                  <li
                    className={cn(
                      'flex h-full items-center text-white/40 hover:text-white',
                      pathname === item.href && 'text-white',
                      pathname.includes(item.href) && item.href !== '/' && 'text-white',
                    )}
                  >
                    {item.label}
                  </li>
                </Link>
              ))}
            </ul>
            <div className="flex items-center gap-x-3">
              <LocaleSwitcher />
              <Button onClick={() => setIsLoginModalOpen(true)}>Submit AI</Button>
            </div>
          </div>
          {/* mobile */}
          <div className="mx-3 flex items-center gap-x-4 lg:hidden">
            <MenuBtn open={open} onClick={() => setOpen(!open)} />
          </div>
        </nav>
      </header>
      <NavigationDrawer open={open} setOpen={setOpen} />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={handleRegisterSuccess}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </>
  );
}