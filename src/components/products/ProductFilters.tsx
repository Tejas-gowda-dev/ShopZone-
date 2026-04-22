import * as React from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useFilterStore } from '../../store/filterStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn, formatPrice } from '../../lib/utils';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SortOption } from '../../types';

export function ProductFilters() {
  const { data: categories } = useCategories();
  const { 
    category: activeCategory, 
    setCategory, 
    priceRange, 
    setPriceRange, 
    sortBy, 
    setSortBy, 
    resetFilters,
    isFilterActive 
  } = useFilterStore();

  const [isOpen, setIsOpen] = React.useState(false);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'top-rated', label: 'Top Rated' },
  ];

  return (
    <div className="space-y-8">
      {/* Mobile Toggle */}
      <div className="lg:hidden flex items-center justify-between gap-4">
        <Button 
          variant="outline" 
          className="flex-1 justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters & Sort
          </span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </Button>
        {isFilterActive() && (
          <Button variant="ghost" size="icon" onClick={resetFilters} className="text-red-500">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {(isOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-8 overflow-hidden lg:block"
          >
            {/* Category Filter */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategory('all')}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    activeCategory === 'all' 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  )}
                >
                  All
                </button>
                {categories?.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all uppercase",
                      activeCategory === cat 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none" 
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Price Range</h3>
                <span className="text-sm font-bold text-blue-600">
                  {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>$0</span>
                <span>$1000</span>
              </div>
            </div>

            {/* Sort Filter */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Sort By</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={cn(
                      "flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
                      sortBy === option.value
                        ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800"
                        : "bg-white border-slate-100 text-slate-600 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800"
                    )}
                  >
                    {option.label}
                    {sortBy === option.value && <div className="h-2 w-2 rounded-full bg-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear All */}
            {isFilterActive() && (
              <Button
                variant="ghost"
                className="w-full text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={resetFilters}
              >
                <X className="mr-2 h-4 w-4" />
                Clear All Filters
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
