import * as React from 'react';
import { Product } from '../../types';
import { Star, ShoppingCart, Heart, Share2, ArrowLeft, Plus, Minus, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatPrice, calculateOriginalPrice } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useCartStore } from '../../store/cartStore';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/Toast';

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = React.useState(1);
  const { addToCart, getItemQuantity } = useCartStore();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const quantityInCart = getItemQuantity(product.id);
  const isAlreadyInCart = quantityInCart > 0;

  const handleAddToCart = () => {
    addToCart(product);
    showToast(`${product.title.substring(0, 20)}... added to cart`, 'success');
  };

  const originalPrice = calculateOriginalPrice(product.price);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
      {/* Product Images Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-4"
      >
        <div className="aspect-square bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 p-12 relative group overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        </div>
      </motion.div>

      {/* Product Info Section */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col h-full"
      >
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-6 uppercase tracking-widest">
          <button onClick={() => navigate('/')} className="hover:text-blue-500 transition-colors">Home</button>
          <span>/</span>
          <span className="text-slate-600 dark:text-slate-300">{product.category}</span>
        </nav>

        <Badge variant="secondary" className="w-fit mb-4">{product.category}</Badge>
        
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-4">
          {product.title}
        </h1>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.round(product.rating.rate) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
                )}
              />
            ))}
            <span className="text-sm font-bold ml-1">{product.rating.rate}</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-200" />
          <span className="text-sm text-slate-500 font-medium">{product.rating.count} Reviews</span>
        </div>

        <div className="flex items-baseline gap-4 mb-8">
          <span className="text-4xl font-black text-blue-600">{formatPrice(product.price)}</span>
          <span className="text-xl text-slate-400 line-through font-medium">{formatPrice(originalPrice)}</span>
          <Badge variant="success" className="text-[10px]">Save 25%</Badge>
        </div>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-10 text-lg">
          {product.description}
        </p>

        <div className="mt-auto space-y-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center border-2 border-slate-100 dark:border-slate-800 rounded-xl p-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-10 w-10"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-bold text-lg">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setQuantity(quantity + 1)}
                className="h-10 w-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 flex gap-3 min-w-[200px]">
              <Button 
                className="flex-1 text-lg font-bold h-14" 
                onClick={handleAddToCart}
                variant={isAlreadyInCart ? 'outline' : 'primary'}
              >
                {isAlreadyInCart ? (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button variant="outline" size="icon" className="h-14 w-14 rounded-xl border-2">
                <Heart className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest pt-6 border-t dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              In Stock & Ready to Ship
            </div>
            <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
              <Share2 className="h-4 w-4" />
              Share Product
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
