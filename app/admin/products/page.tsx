
// src/app/admin/products/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, ArrowLeft, Package } from 'lucide-react';
import { getProducts, type Product } from '@/lib/firebaseServices';
import DeleteProductButton from './DeleteProductButton'; // Client component for delete action
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const revalidate = 0; // Disable caching for this admin page

export default async function AdminProductsPage() {
  let products: Product[] = [];
  let fetchError: string | null = null;

  try {
    products = await getProducts();
  } catch (error: any) {
    console.error("Error fetching products for admin page:", error);
    fetchError = "Could not load products. Please try again later or check server logs.";
    // products will remain an empty array
  }

  return (
    <div className="py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl md:text-4xl font-bold flex items-center">
          <Package className="mr-3 h-8 w-8 text-primary" /> Manage Products
        </h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {fetchError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Fetching Products</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="font-headline text-xl">Product Inventory</CardTitle>
              <CardDescription>
                Add, edit, or remove products from your catalog.
              </CardDescription>
            </div>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/admin/products/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">
                    {product.price !== null ? `$${product.price.toFixed(2)}` : 'N/A'}
                  </TableCell>
                  <TableCell>{product.availability}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" asChild className="hover:text-primary">
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteProductButton productId={product.id} />
                  </TableCell>
                </TableRow>
              ))}
              {!fetchError && products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No products found. Add a new product to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Product data is managed in Firestore.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
