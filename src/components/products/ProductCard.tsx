import * as React from 'react';
import { ShoppingCart, Star, Heart, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../../types';
import { cn, formatPrice, calculateOriginalPrice } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { useToast } from '../ui/Toast';

export interface ProductCardProps {
  product: Product;
  key?: React.Key;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const { addToCart, getItemQuantity } = useCartStore();
  const { showToast } = useToast();
  
  const quantityInCart = getItemQuantity(product.id);
  const isAlreadyInCart = quantityInCart > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    showToast(`${product.title.substring(0, 20)}... added to cart`, 'success');
  };

  const originalPrice = calculateOriginalPrice(product.price);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col h-full card-minimal overflow-hidden"
    >
      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsWishlisted(!isWishlisted);
        }}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform"
      >
        <Heart
          className={cn(
            'h-4 w-4 transition-colors',
            isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400 group-hover:text-slate-600'
          )}
        />
      </button>

      {/* Category Badge */}
      <div className="absolute top-4 left-4 z-10">
        <Badge variant="secondary" className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80">
          {product.category}
        </Badge>
      </div>

      <Link to={`/products/${product.id}`} className="flex-1 flex flex-col p-4">
        {/* Product Image */}
        <div className="relative aspect-square mb-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-3 w-3',
                  i < Math.round(product.rating.rate)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-300'
                )}
              />
            ))}
            <span className="text-[10px] text-slate-400 font-medium ml-1">
              ({product.rating.count})
            </span>
          </div>

          <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          variant={isAlreadyInCart ? 'outline' : 'primary'}
          className={cn(
            'w-full sm:w-auto md:w-full transition-all duration-300',
            isAlreadyInCart && 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-emerald-50/30'
          )}
        >
          {isAlreadyInCart ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              In Cart ({quantityInCart})
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
