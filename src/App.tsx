/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, ScrollRestoration } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import HomePage from './app/page';
import ProductDetailPage from './app/products/[id]/page';
import CartPage from './app/cart/page';
import CheckoutPage from './app/checkout/page';
import OrderSuccessPage from './app/order-success/page';
import { useLocation } from 'react-router-dom';
import * as React from 'react';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
      <ScrollToTop />
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="*" element={
            <div className="container mx-auto px-4 py-20 text-center">
              <h1 className="text-4xl font-black mb-4">404 - Not Found</h1>
              <p className="text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
              <HomePage />
            </div>
          } />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
