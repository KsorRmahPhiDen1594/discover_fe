import type { WebNavigation } from '@/db/supabase/types';

import WebNavCard from './WebNavCard';

export default function WebNavCardList({ dataList }: { dataList?: WebNavigation[] | null }) {
  if (!Array.isArray(dataList) || dataList.length === 0) {
    return <p className="text-white text-sm">No data to display.</p>;
  }

  return (
    <div className='grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4'>
      {dataList.map((item) => (
        <WebNavCard key={item.id} {...item} />
      ))}
    </div>
  );
}

