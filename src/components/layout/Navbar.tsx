import * as React from 'react';
import { ShoppingCart, Search, Menu, X, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../ui/Button';
import { useFilterStore } from '../../store/filterStore';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { CartDrawer } from '../cart/CartDrawer';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isSearchVisible, setIsSearchVisible] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);
  
  const cartCount = useCartStore((state) => state.getCartCount());
  const { searchQuery, setSearchQuery } = useFilterStore();
  const location = useLocation();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full nav-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight italic">
            SHOP<span className="text-[#3B82F6]">ZONE</span>
          </div>
        </Link>

        {/* Global Search (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-slate-100 dark:bg-slate-900 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            className="md:hidden"
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-950"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {isSearchVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t md:hidden bg-white dark:bg-slate-950 px-4 py-3"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                autoFocus
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-slate-100 dark:bg-slate-900 border-none rounded-full text-sm outline-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 top-16 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-16 bottom-0 z-50 w-64 bg-white dark:bg-slate-950 border-l p-6 md:hidden shadow-xl"
            >
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/"
                  className={cn(
                    'text-lg font-medium py-2',
                    location.pathname === '/' ? 'text-blue-600' : 'text-slate-600 dark:text-slate-400'
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/cart"
                  className={cn(
                    'text-lg font-medium py-2',
                    location.pathname === '/cart' ? 'text-blue-600' : 'text-slate-600 dark:text-slate-400'
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cart ({cartCount})
                </Link>
                <Link
                  to="/checkout"
                  className={cn(
                    'text-lg font-medium py-2',
                    location.pathname === '/checkout' ? 'text-blue-600' : 'text-slate-600 dark:text-slate-400'
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Checkout
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
