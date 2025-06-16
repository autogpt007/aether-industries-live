import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductById, type Product } from '@/lib/firebaseServices';
import ProductForm from '../../ProductForm';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react'; // Import for error icon

// This is the correct type definition for a Next.js page with a dynamic route.
// This fixes the previous build error.
interface EditProductPageProps {
  params: {
    id: string;
  };
  // searchParams?: { [key: string]: string | string[] | undefined }; // Removed as per user's final code
}

/**
 * Generates metadata for the Edit Product page.
 * Fetches the product details based on the ID from params to set the page title.
 */
export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> {
  try {
    const product = await getProductById(params.id);
    if (!product) {
      return { title: 'Product Not Found' };
    }
    return { title: `Edit: ${product.name}` };
  } catch (error) {
    console.error(`Error generating metadata for product ID ${params.id}:`, error);
    return { title: 'Error Loading Product' };
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  let product: Product | null = null; // Ensure product is typed correctly from the start

  // Added error handling to prevent the server from crashing.
  try {
    product = await getProductById(params.id);
  } catch (error: any) { // Catch specific error type
    console.error(`Failed to fetch product with ID ${params.id}:`, error.message, error.stack);
    // Display a more user-friendly error message with an icon
    return (
      <div className="p-8 text-center text-destructive flex flex-col items-center justify-center space-y-4">
        <AlertTriangle className="h-12 w-12" />
        <h1 className="text-xl font-bold">Error Loading Product Data</h1>
        <p>Could not retrieve product data for ID: <span className="font-mono bg-destructive/10 p-1 rounded">{params.id}</span>.</p>
        <p>Details: {error.message}</p>
        <p className="mt-4 text-xs text-muted-foreground">Please check server logs for more details. If the issue persists, contact support.</p>
      </div>
    );
  }

  // Handles cases where the product doesn't exist after a successful fetch attempt
  if (!product) {
    notFound(); // This will render the nearest not-found.tsx or a default Next.js 404 page
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
       <Card className="mb-8">
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
          {/* product is guaranteed to be non-null here due to the notFound() call above */}
          <CardDescription>You are currently editing: <span className="font-semibold">{product.name}</span></CardDescription>
        </CardHeader>
      </Card>
      <ProductForm initialData={product} />
    </div>
  );
}
