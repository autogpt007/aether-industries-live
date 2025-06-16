
// app/admin/products/edit/[id]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/firebaseServices';
import ProductForm from '../../ProductForm';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// This is the correct type definition for a Next.js page with a dynamic route.
// This fixes the previous build error.
interface EditProductPageProps {
  params: {
    id: string;
  };
}

/**
 * Generates metadata for the Edit Product page.
 * Fetches the product details based on the ID from params to set the page title.
 * Provides fallback titles for cases where the product is not found or an error occurs.
 */
export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> {
  try {
    const product = await getProductById(params.id);
    if (!product) {
      return { title: 'Product Not Found' };
    }
    return { title: `Edit Product - ${product.name}` };
  } catch (error) {
    console.error(`Error generating metadata for product ID ${params.id}:`, error);
    return { title: 'Error Loading Product Details' };
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  let product;

  // Added error handling to prevent the server from crashing.
  try {
    product = await getProductById(params.id);
  } catch (error) {
    console.error(`Failed to fetch product with ID ${params.id}:`, error);
    return (
        <div className="p-8 text-center text-destructive">
            <h1 className="text-xl font-bold">Error Loading Product</h1>
            <p>Could not retrieve product data. Please check server logs.</p>
        </div>
    );
  }

  // Handles cases where the product doesn't exist.
  if (!product) {
    notFound();
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
       <Card className="mb-8">
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
          <CardDescription>You are currently editing: <span className="font-semibold">{product.name}</span></CardDescription>
        </CardHeader>
      </Card>
      <ProductForm initialData={product} />
    </div>
  );
}
