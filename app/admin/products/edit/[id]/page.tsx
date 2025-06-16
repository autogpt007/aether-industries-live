
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductById, type Product } from '@/lib/firebaseServices';
import ProductForm from '../../ProductForm';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react'; // Import for error icon

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
    return { title: `Edit: ${product.name}` };
  } catch (error) {
    console.error(`Error generating metadata for product ID ${params.id} in app/admin/products/edit/[id]/page.tsx:`, (error as Error).message, (error as Error).stack);
    return { title: 'Error Loading Product Details' };
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  let product: Product | null = null;

  try {
    product = await getProductById(params.id);
  } catch (error) {
    console.error(`Failed to fetch product with ID ${params.id} in app/admin/products/edit/[id]/page.tsx. Error: ${(error as Error).message}`, (error as Error).stack);
    return (
        <div className="p-8 text-center text-destructive bg-destructive/10 rounded-lg max-w-2xl mx-auto my-10 border border-destructive">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h1 className="text-2xl font-bold mb-2">Error Loading Product</h1>
            <p className="text-base mb-1">We encountered a problem retrieving the product data for ID: <span className="font-mono bg-destructive/20 px-1 rounded">{params.id}</span>.</p>
            <p className="text-sm">Please check the server logs for more details or try again later. If the issue persists, contact support.</p>
        </div>
    );
  }

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
