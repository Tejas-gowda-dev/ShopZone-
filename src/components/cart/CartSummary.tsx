import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '../../lib/utils';
import { Button } from '../ui/Button';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CartSummary() {
  const { getCartTotal } = useCartStore();
  const navigate = useNavigate();
  
  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 border dark:border-slate-800">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <ShoppingBag className="h-5 w-5 text-blue-600" />
        Order Summary
      </h2>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span className="font-medium text-slate-900 dark:text-white">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Shipping</span>
          <span className="font-medium text-slate-900 dark:text-white">
            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Estimated Tax</span>
          <span className="font-medium text-slate-900 dark:text-white">{formatPrice(tax)}</span>
        </div>
        
        <div className="pt-4 border-t border-dashed dark:border-slate-700">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-blue-600">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Button 
          className="w-full group" 
          onClick={() => navigate('/checkout')}
          disabled={subtotal === 0}
        >
          Proceed to Checkout
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
        <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest font-medium">
          Secure Encrypted Payment
        </p>
      </div>

      {subtotal < 50 && subtotal > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
            Add <span className="font-bold">{formatPrice(50 - subtotal)}</span> more for <strong>FREE shipping</strong>!
          </p>
        </div>
      )}
    </div>
  );
}
