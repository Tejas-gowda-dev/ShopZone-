import { ProductGrid } from '../components/products/ProductGrid';
import { ProductFilters } from '../components/products/ProductFilters';
import { ProductSearch } from '../components/products/ProductSearch';
import { motion } from 'motion/react';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="sticky top-24">
            <h2 className="text-xl font-bold text-[#0F172A] dark:text-white mb-6 hidden lg:block tracking-tight text-center lg:text-left">
              Collections
            </h2>
            <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <ProductFilters />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <header className="mb-8 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                Backpacks & Accessories
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xl">
                Explore our selection of premium curated items. High-quality products chosen for reliability and style.
              </p>
            </motion.div>
          </header>

          <ProductSearch />
          <ProductGrid />
        </main>
      </div>
    </div>
  );
}
