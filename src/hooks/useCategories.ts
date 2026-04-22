import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../lib/api';

export function useCategories() {
  return useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
}
