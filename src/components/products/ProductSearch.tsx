import { Search, X } from 'lucide-react';
import { useFilterStore } from '../../store/filterStore';
import { motion, AnimatePresence } from 'motion/react';

export function ProductSearch() {
  const { searchQuery, setSearchQuery } = useFilterStore();

  return (
    <div className="relative group lg:hidden mb-6">
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
      </div>
      <input
        type="text"
        placeholder="Search for items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full h-12 pl-12 pr-12 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none shadow-sm"
      />
      <AnimatePresence>
        {searchQuery && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900"
          >
            <X className="h-3 w-3" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
