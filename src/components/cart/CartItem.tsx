import * as React from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../ui/Button';

export interface CartItemProps {
  item: CartItemType;
  key?: React.Key;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCartStore();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-6 border-b">
      <div className="h-24 w-24 flex-shrink-0 bg-slate-50 rounded-lg p-2 border">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-contain mix-blend-multiply"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h3 className="font-semibold text-slate-900 leading-tight mb-1">{item.title}</h3>
        <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">{item.category}</p>
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-500 text-sm flex items-center gap-1 hover:text-red-600 transition-colors mx-auto sm:mx-0"
        >
          <Trash2 className="h-4 w-4" />
          Remove
        </button>
      </div>

      <div className="flex flex-col items-center sm:items-end gap-3 min-w-[120px]">
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-10 text-center font-medium">{item.quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <p className="font-bold text-lg">{formatPrice(item.price * item.quantity)}</p>
      </div>
    </div>
  );
}
