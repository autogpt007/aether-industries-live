
// src/app/products/page.tsx
import { getProducts, type Product } from '@/lib/firebaseServices'; // Ensure Product type is imported
import React from 'react';
import ProductPageClient from './productPageClient'; // We will create this in the next step
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Refrigerants & HVAC/R Products | Aether Industries',
  description: 'Browse the full catalog of genuine Freon™ refrigerants, professional HVAC/R tools, and essential accessories from Aether Industries. Find everything you need for your cooling system projects.',
};


// This is the main SERVER component. It runs on the server.
const ProductPage = async () => {
  // Add server-side logs to see what's happening in the terminal
  console.log('--- [SERVER LOG] ProductPage: Fetching products on the server...');
  
  const allProducts: Product[] = await getProducts();
  
  console.log(`--- [SERVER LOG] ProductPage: getProducts() returned ${allProducts.length} product(s).`);

  // Pass the fetched data as a prop to the client component
  return <ProductPageClient initialProducts={allProducts} />;
};

export default ProductPage;

