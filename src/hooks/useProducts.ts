import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../lib/api';
import { Product } from '../types';

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
}
