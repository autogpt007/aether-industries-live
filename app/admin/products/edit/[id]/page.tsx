
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductById, type Product } from '@/lib/firebaseServices'; // Ensure Product type is imported
import ProductForm from '../../ProductForm';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// This is the correct type definition that should fix build errors.
interface EditProductPageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined }; // Added for broader PageProps compatibility
}

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
  let product: Product | null = null;

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

  if (!product) {
    notFound(); // This will throw and stop rendering, product is Product below
  }

  // At this point, 'product' is guaranteed to be of type Product
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
       <Card className="mb-8">
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
          {/* product.name is safe to access here due to notFound() check */}
          <CardDescription>You are currently editing: <span className="font-semibold">{product.name}</span></CardDescription>
        </CardHeader>
      </Card>
      {/* ProductForm initialData prop expects Product | undefined. 
          Since 'product' is narrowed to 'Product' here, it's assignable. */}
      <ProductForm initialData={product} />
    </div>
  );
}
