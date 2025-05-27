'use client';

import { useState } from 'react';
import { NavigationCategory } from '@/db/supabase/types';

import { Link } from '@/app/navigation';

interface SideBarProps {
  data: NavigationCategory[];
  currentId: number;
}

function SideBar({ data, currentId }: SideBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div>
        <button
          type='button'
          className='fixed bottom-10 right-3 flex items-center justify-center rounded-full border border-white bg-black p-3 lg:hidden'
          aria-haspopup='dialog'
          aria-expanded={isOpen ? 'true' : 'false'}
          aria-controls='radix-:rt:'
          data-state={isOpen ? 'open' : 'closed'}
          onClick={toggleSidebar}
        >
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none'>
            <path
              fill='#fff'
              fillOpacity='0.9'
              d='m12.357 12.715-.297 1.82h1.343l.3-1.82h1.01l.226-1.342H13.92l.216-1.313h1.011l.227-1.342h-1.019l.3-1.82h-1.342l-.3 1.82h-1.341l.298-1.82h-1.342l-.3 1.82h-1.01l-.226 1.342h1.017l-.216 1.313H8.882l-.227 1.342h1.019l-.3 1.82h1.342l.3-1.82h1.341Zm.22-1.342h-1.342l.216-1.313h1.343l-.216 1.313Z'
            />
            <path
              fill='#fff'
              fillOpacity='0.9'
              d='m17.08 21.954-4.96-3.852-5.22 3.925a1.5 1.5 0 0 1-2.4-1.198V3.852a1.5 1.5 0 0 1 1.5-1.5h12a1.5 1.5 0 0 1 1.5 1.5v16.917a1.5 1.5 0 0 1-2.42 1.185Zm-4.945-5.74L18 20.77V3.852H6v16.977l6.135-4.614Z'
            />
          </svg>
          <span className='sr-only'>tag</span>
        </button>
      </div>

      {/* Lớp phủ (overlay) */}
      {isOpen && (
        <button
          type='button'
          onClick={toggleSidebar}
          onKeyDown={(e) => e.key === 'Enter' && toggleSidebar()}
          className='fixed inset-0 z-50 bg-black/80'
          style={{ pointerEvents: 'auto' }}
          aria-label='Close sidebar overlay'
        />
      )}

      {/* Thanh điều hướng (sidebar) */}
      <div
        role='dialog'
        aria-describedby='sidebar-description'
        aria-labelledby='sidebar-title'
        className={`fixed right-0 top-0 z-50 mt-16 flex h-[calc(100vh-64px)] max-h-[100%] w-[254px] flex-col overflow-y-auto border bg-[#2C2D36] px-5 py-10 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <div id='sidebar-title' className='mx-auto mt-4 hidden h-2 w-[100px] rounded-full bg-muted' />
        <nav>
          <ol className='flex flex-col text-base text-[#A5A3AC]'>
            {data.map((item) => (
              <li
                key={item.id}
                className={`line-clamp-1 flex h-10 w-full items-center justify-start rounded-xl border ${item.id === currentId ? 'border-white/70' : 'border-transparent'} px-5`}
              >
                <Link href={`#${item.name}`} className='w-full text-nowrap' onClick={toggleSidebar}>
                  {item.title}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <nav className='sticky top-[88px] hidden h-fit w-[238px] shrink-0 rounded-2xl bg-[#2C2D36] p-3 text-sm text-[#A5A3AC] lg:block'>
        <ol className='flex flex-col text-base'>
          {data.map((item) => (
            <li
              key={item.id}
              className={`line-clamp-1 flex h-10 w-full items-center justify-start rounded-xl border ${item.id === currentId ? 'border-white/70' : 'border-transparent'} px-5`}
            >
              <Link href={`#${item.name}`} className='w-full text-nowrap'>
                {item.title}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
export default SideBar;
