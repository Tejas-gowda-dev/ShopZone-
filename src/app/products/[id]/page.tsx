import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../../../hooks/useProduct';
import { useProducts } from '../../../hooks/useProducts';
import { ProductDetailClient } from '../../../components/products/ProductDetailClient';
import { ProductCard } from '../../../components/products/ProductCard';
import { ProductSkeleton } from '../../../components/products/ProductSkeleton';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError, refetch } = useProduct(id || '');
  const { data: allProducts } = useProducts();

  // Related products logic
  const relatedProducts = React.useMemo(() => {
    if (!product || !allProducts) return [];
    return allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, allProducts]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-slate-100 rounded-3xl animate-pulse" />
          <div className="space-y-6">
            <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
            <div className="h-12 w-full bg-slate-100 rounded animate-pulse" />
            <div className="h-6 w-3/4 bg-slate-100 rounded animate-pulse" />
            <div className="h-24 w-full bg-slate-100 rounded animate-pulse" />
            <div className="h-14 w-full bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
          <RotateCcw className="h-10 w-10 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          The product you're looking for doesn't exist or there was an error loading it.
        </p>
        <Button onClick={() => navigate('/')} variant="primary">
          Back to Shop
        </Button>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-8 group pl-0 hover:bg-transparent"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Products
      </Button>

      <ProductDetailClient product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 pt-24 border-t dark:border-slate-800">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                Related <span className="text-blue-600">Products</span>
              </h2>
              <p className="text-slate-500 font-medium">You might also like these items from {product.category}.</p>
            </div>
            <Button variant="outline" onClick={() => navigate(`/?category=${product.category}`)}>
              View Category
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
