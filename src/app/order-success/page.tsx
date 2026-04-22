import * as React from 'react';
import { useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ShoppingBag, Package, Truck, ArrowRight, Printer, Share2 } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../../components/ui/Button';
import { formatPrice, generateOrderId, formatDate } from '../../lib/utils';

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);
  
  const customerName = location.state?.customerName || 'Customer';
  const orderTotal = location.state?.orderTotal || 0;
  const orderId = React.useMemo(() => generateOrderId(), []);
  
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);

  React.useEffect(() => {
    if (location.state) {
      // Fire confetti
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      clearCart();
      return () => clearInterval(interval);
    }
  }, [location.state, clearCart]);

  if (!location.state) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="container mx-auto px-4 py-20 max-w-4xl">
      <div className="flex flex-col items-center text-center">
        <motion.div
           initial={{ scale: 0, rotate: -45 }}
           animate={{ scale: 1, rotate: 0 }}
           transition={{ type: 'spring', damping: 10, stiffness: 100 }}
           className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center mb-8"
        >
          <CheckCircle2 className="h-12 w-12 text-emerald-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Thank you, <span className="text-blue-600">{customerName}!</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
            Your order <span className="font-bold text-slate-900 dark:text-white">{orderId}</span> has been placed successfully and is being processed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
           {[
             { icon: Package, label: 'Order Status', value: 'Processing', color: 'blue' },
             { icon: Truck, label: 'Est. Delivery', value: formatDate(deliveryDate), color: 'emerald' },
             { icon: ShoppingBag, label: 'Total Paid', value: formatPrice(orderTotal), color: 'slate' }
           ].map((item, i) => (
             <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border dark:border-slate-800 shadow-sm flex flex-col items-center"
             >
                <div className={`p-3 bg-${item.color}-50 dark:bg-${item.color}-900/20 rounded-2xl mb-4`}>
                   <item.icon className={`h-6 w-6 text-${item.color}-600`} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                <p className="font-bold text-slate-900 dark:text-white">{item.value}</p>
             </motion.div>
           ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="w-full bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden"
        >
           {/* Abstract Background Patterns */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl -ml-32 -mb-32" />

           <div className="relative z-10 space-y-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="text-center md:text-left">
                   <h3 className="text-2xl font-black mb-2">Order Information Sent</h3>
                   <p className="text-slate-400 text-sm max-w-sm">
                     We've sent a confirmation email with all the details to your inbox. You can track your order status in your account.
                   </p>
                 </div>
                 <div className="flex gap-3">
                    <Button variant="outline" className="border-slate-700 bg-transparent text-white hover:bg-slate-800 h-12">
                       <Printer className="mr-2 h-4 w-4" />
                       Print Receipt
                    </Button>
                    <Button variant="outline" className="border-slate-700 bg-transparent text-white hover:bg-slate-800 h-12">
                       <Share2 className="mr-2 h-4 w-4" />
                       Share
                    </Button>
                 </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8 border-t border-slate-800">
                 <Link to="/">
                    <Button variant="primary" size="lg" className="px-12 h-14 text-lg">
                       Continue Shopping
                       <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                 </Link>
                 <button className="text-sm font-bold uppercase tracking-widest hover:text-blue-400 transition-colors">
                   Track My Order
                 </button>
              </div>
           </div>
        </motion.div>
      </div>
    </main>
  );
}
