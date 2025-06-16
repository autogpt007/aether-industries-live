
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/firebaseServices';
import ProductForm from '../../ProductForm';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// This is the correct type definition for a Next.js page with a dynamic route.
// Added optional searchParams to satisfy PageProps constraint more fully.
interface EditProductPageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
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

export default async function EditProductPage({ params /*, searchParams */ }: EditProductPageProps) {
  let product;

  // Added error handling to prevent the server from crashing.
  try {
    product = await getProductById(params.id);
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error(`Failed to fetch product with ID ${params.id}. Error: ${errorMessage}`, errorStack);
    return (
        <div className="p-8 text-center text-red-500">
            <h1 className="text-xl font-bold">Error Loading Product Data</h1>
            <p>Could not retrieve product data for ID: {params.id}.</p>
            <p>Details: {errorMessage}</p>
            <p className="mt-4 text-xs text-muted-foreground">Check server logs for more details. Error occurred in EditProductPage.</p>
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
