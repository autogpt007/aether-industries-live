
// app/admin/products/new/page.tsx
import ProductForm from '../ProductForm';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PackagePlus } from 'lucide-react';

export default function NewProductPage() {
  return (
    <div className="py-8 space-y-6 max-w-5xl mx-auto px-4">
       <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-3xl md:text-4xl font-bold flex items-center">
          <PackagePlus className="mr-3 h-8 w-8 text-primary" /> Add New Product
        </h1>
      </div>
      <ProductForm />
    </div>
  );
}

    