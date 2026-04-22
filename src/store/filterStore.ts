import { create } from 'zustand';
import { SortOption } from '../types';

interface FilterState {
  searchQuery: string;
  category: string;
  priceRange: [number, number];
  sortBy: SortOption;
  setSearchQuery: (query: string) => void;
  setCategory: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: SortOption) => void;
  resetFilters: () => void;
  isFilterActive: () => boolean;
}

export const useFilterStore = create<FilterState>()((set, get) => ({
  searchQuery: '',
  category: 'all',
  priceRange: [0, 1000],
  sortBy: 'featured',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCategory: (category) => set({ category }),
  setPriceRange: (priceRange) => set({ priceRange }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () => set({
    searchQuery: '',
    category: 'all',
    priceRange: [0, 1000],
    sortBy: 'featured',
  }),
  isFilterActive: () => {
    const { searchQuery, category, priceRange, sortBy } = get();
    return (
      searchQuery !== '' ||
      category !== 'all' ||
      priceRange[0] !== 0 ||
      priceRange[1] !== 1000 ||
      sortBy !== 'featured'
    );
  },
}));
