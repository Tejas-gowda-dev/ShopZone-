import * as React from 'react';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from './ProductCard';
import { ProductSkeleton } from './ProductSkeleton';
import { useFilterStore } from '../../store/filterStore';
import { useDebounce } from '../../hooks/useDebounce';
import { Button } from '../ui/Button';
import { RotateCcw, PackageSearch } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ProductGrid() {
  const { data: products, isLoading, isError, refetch } = useProducts();
  const { searchQuery, category, priceRange, sortBy, resetFilters } = useFilterStore();
  const debouncedSearch = useDebounce(searchQuery, 300);

  const [visibleCount, setVisibleCount] = React.useState(8);

  // Filtering Logic
  const filteredProducts = React.useMemo(() => {
    if (!products) return [];

    let result = products.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCategory = category === 'all' || p.category === category;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sorting Logic
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'top-rated':
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      default:
        // 'featured' - original API order
        break;
    }

    return result;
  }, [products, debouncedSearch, category, priceRange, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed text-center px-4">
        <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <RotateCcw className="h-10 w-10 text-red-400" />
        </div>
        <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
        <p className="text-slate-500 mb-6 max-w-sm">
          We couldn't load the products. Please check your connection and try again.
        </p>
        <Button onClick={() => refetch()} variant="primary">
          Retry Loading
        </Button>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed text-center px-4">
        <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <PackageSearch className="h-10 w-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold mb-2">No results found</h3>
        <p className="text-slate-500 mb-6 max-w-sm">
          Try adjusting your search or filters to find what you're looking for.
        </p>
        <Button onClick={resetFilters} variant="outline">
          Clear All Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 font-medium">
          Showing <span className="text-slate-900 dark:text-white font-bold">{displayedProducts.length}</span> of <span className="font-bold">{filteredProducts.length}</span> products
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimatePresence>
      </div>

      {visibleCount < filteredProducts.length && (
        <div className="flex flex-col items-center gap-4 py-10">
          <Button
            size="lg"
            variant="outline"
            className="px-12"
            onClick={() => setVisibleCount((prev) => prev + 8)}
          >
            Load More Products
          </Button>
          <p className="text-xs text-slate-400">
            {filteredProducts.length - visibleCount} more items available
          </p>
        </div>
      )}
    </div>
  );
}
