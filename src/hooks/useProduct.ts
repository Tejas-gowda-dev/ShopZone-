import { useQuery } from '@tanstack/react-query';
import { fetchProduct } from '../lib/api';
import { Product } from '../types';

export function useProduct(id: string | number) {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
}
