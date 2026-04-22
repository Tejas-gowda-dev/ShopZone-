import * as React from 'react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../ui/Button';
import { formatPrice } from '../../lib/utils';
import { Link, useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, getCartTotal } = useCartStore();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-sm bg-white dark:bg-slate-950 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#0F172A] dark:text-white">Shopping Cart</h2>
                <span className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                  {items.reduce((acc, item) => acc + item.quantity, 0)} items
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center">
                    <ShoppingBag className="h-10 w-10 text-slate-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Your cart is empty</h3>
                    <p className="text-slate-500 text-sm">Looks like you haven't added anything yet.</p>
                  </div>
                  <Button onClick={onClose} variant="primary">
                    Start Shopping
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-20 w-20 flex-shrink-0 rounded-lg border bg-slate-50 p-2">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain mix-blend-multiply"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold truncate">{item.title}</h4>
                      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">
                        {item.category}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-slate-400 hover:text-slate-900"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-slate-400 hover:text-slate-900"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-bold text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t bg-slate-50 space-y-4">
                <div className="flex items-center justify-between font-bold text-lg">
                  <span>Subtotal</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
                <p className="text-xs text-slate-500 text-center">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      onClose();
                      navigate('/cart');
                    }}
                  >
                    View Cart
                  </Button>
                  <Button
                    onClick={() => {
                      onClose();
                      navigate('/checkout');
                    }}
                    className="group"
                  >
                    Checkout
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
