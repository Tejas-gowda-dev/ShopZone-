/// <reference types="vite/client" />
const API_URL = import.meta.env.VITE_API_URL || 'https://fakestoreapi.com';

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProduct(id: string | number) {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_URL}/products/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function fetchProductsByCategory(category: string) {
  const res = await fetch(`${API_URL}/products/category/${category}`);
  if (!res.ok) throw new Error('Failed to fetch products by category');
  return res.json();
}
