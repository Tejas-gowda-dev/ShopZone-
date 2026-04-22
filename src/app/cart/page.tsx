import { ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { CartItem } from '../../components/cart/CartItem';
import { CartSummary } from '../../components/cart/CartSummary';
import { Button } from '../../components/ui/Button';
import { motion } from 'motion/react';

export default function CartPage() {
  const { items } = useCartStore();

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="h-32 w-32 rounded-full bg-slate-50 flex items-center justify-center mb-8"
        >
          <ShoppingBag className="h-16 w-16 text-slate-200" />
        </motion.div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Your cart is empty</h1>
        <p className="text-slate-500 max-w-md mb-10 text-lg">
          Looks like you haven't added any products to your cart yet. Take a look at our featured items!
        </p>
        <Link to="/">
          <Button size="lg" className="px-12 h-14 text-lg">
            Start Shopping
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/" className="text-blue-600 hover:underline flex items-center gap-1 text-sm font-bold uppercase tracking-widest">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Shopping <span className="text-blue-600">Cart</span>
        </h1>
        <p className="text-slate-500 font-medium mt-1">Review your items before proceeding to checkout.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-2">
          <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <div className="col-span-6">Product Details</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-3 text-right">Total Price</div>
          </div>
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
          
          <div className="pt-8 flex justify-between items-center">
             <Link to="/">
              <Button variant="ghost" className="text-slate-500">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Add More Items
              </Button>
             </Link>
             <p className="text-sm font-medium text-slate-500 italic">
               * Taxes and shipping calculated at checkout
             </p>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="sticky top-24">
          <CartSummary />
          
          <div className="mt-8 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Shipping Policy</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Free shipping on orders over <strong>$50.00</strong>. Standard delivery takes 3-5 business days. 30-day money-back guarantee.
              </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
