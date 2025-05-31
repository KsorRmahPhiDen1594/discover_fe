'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { useRouter } from '@/app/navigation';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const FormSchema = z.object({
  search: z.string(),
});

export default function SearchForm({
  defaultSearch,
  inputClassName,
}: {
  defaultSearch?: string;
  inputClassName?: string;
}) {
  const t = useTranslations('Home');
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: defaultSearch || '',
    },
  });

  const fetchSuggestions = debounce(async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`/api/search-suggestions?query_text=${encodeURIComponent(query)}`);
      const data = await response.json();
      const titles = data.map((item: any) => item.title);
      setSuggestions(titles);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  }, 200);

  useEffect(() => {
    const subscription = form.watch((value) => {
      fetchSuggestions(value.search || '');
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (!data.search.trim()) return;
    setSuggestions([]);
    router.push(`/query/${encodeURIComponent(data.search)}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    form.setValue('search', suggestion);
    setSuggestions([]);
    router.push(`/query/${encodeURIComponent(suggestion)}`);
  };

  return (
    <Form {...form}>
      {/*
        Quan trọng: Đặt phần tử wrap form ở giữa.
        Chúng ta sẽ căn giữa chính FormItem chứ không phải toàn bộ form,
        để phần absolute suggestions có thể theo sát FormItem.
        Thẻ <form> chỉ nên là relative container.
      */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            // Đây là FormItem, phần tử sẽ được căn giữa màn hình
            // và là tham chiếu cho vị trí của suggestion box
            <FormItem className="relative flex justify-center w-full"> {/* */}
              <FormControl>
                {/* Div này chứa Input, Separator và Search button.
                  W-full và lg:w-[550px] đảm bảo chiều rộng đúng.
                  text-white/40 cho placeholder.
                */}
                <div className="relative flex items-center text-white/40 w-full lg:w-[550px]"> {/* */}
                  <Input
                    placeholder={t('search')}
                    {...field}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    // Đảm bảo Input căn trái. Nếu Input component đã có text-left thì class này có thể bỏ qua.
                    className={`h-8 w-full rounded-full border border-white/40 !bg-transparent pr-10 placeholder:text-white/40 lg:h-[38px] lg:pr-12 ${inputClassName}`}
                  />
                  <Separator className="absolute right-8 h-6 w-px bg-white/40 lg:right-10" orientation="vertical" />
                  <button type="submit" className="absolute right-2 lg:right-3">
                    <Search className="size-[18px] lg:size-5" />
                    <span className="sr-only">search</span>
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isFocused && suggestions.length > 0 && (
          // Container cho các gợi ý.
          // absolute: định vị tương đối với FormItem (cha).
          // w-full và max-w-[550px]: đảm bảo chiều rộng khớp với input.
          // left-1/2 -translate-x-1/2: căn giữa theo chiều ngang của FormItem.
          // top-full: đặt ngay dưới input.
          <div className="absolute z-10 mt-2 w-full max-w-[550px] rounded-md bg-zinc-800 shadow-lg max-h-60 overflow-y-auto border border-zinc-700 left-1/2 -translate-x-1/2 top-full"> {/* */}
            {suggestions.map((title: string, index: number) => (
              <div
                key={index}
                className="px-4 py-2 text-zinc-200 hover:bg-zinc-700 cursor-pointer text-left" // Đảm bảo text-left cho từng gợi ý
                onClick={() => handleSuggestionClick(title)}
              >
                {title}
              </div>
            ))}
          </div>
        )}
      </form>
    </Form>
  );
}