
// src/app/admin/products/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { addProduct, updateProduct, deleteProduct } from '@/lib/firebaseServices';
import type { ProductFormData } from '@/types/product'; 
import { productFormSchema } from '@/types/product';

// Helper to transform array of specs to object for Firestore - USED ONLY IN addProductAction for initial creation logic clarity
const transformSpecsToFirestoreForAdd = (specs?: Array<{ key: string; value: string }>): Record<string, string> => {
  if (!specs) return {};
  return specs.reduce((acc, spec) => {
    if (spec.key && spec.value) {
      acc[spec.key] = spec.value;
    }
    return acc;
  }, {} as Record<string, string>);
};

export async function addProductAction(data: ProductFormData) {
  // Auto-generate slug if not provided or empty
  let slugToUse = data.slug;
  if (!slugToUse && data.name) {
    slugToUse = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[™®©&]/g, '').replace(/[^\w-]+/g, '');
  }
  const dataWithSlug = { ...data, slug: slugToUse };

  const validatedFields = productFormSchema.safeParse(dataWithSlug);

  if (!validatedFields.success) {
    console.error("Add Product Action Validation Error:", validatedFields.error.flatten().fieldErrors);
    return { success: false, error: `Validation failed: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}` };
  }
  
  // Destructure validated data
  const { technicalSpecs, safetyInformation, primaryImageUrl, otherImageUrls, ...restOfData } = validatedFields.data;

  try {
    // For addProduct, we construct the full payload including transforming specs here or pass ProductFormData.
    // The current addProduct service seems to expect a more Product-like structure.
    // Let's align with passing ProductFormData to addProduct as well for consistency, and let service handle it.
    await addProduct(validatedFields.data); 
    revalidatePath('/admin/products');
    revalidatePath('/products');
    if (validatedFields.data.slug) {
      revalidatePath(`/products/${validatedFields.data.slug}`);
    }
    return { success: true, message: 'Product added successfully!' };
  } catch (error) {
    console.error("Add Product Action Error:", error);
    return { success: false, error: (error as Error).message || 'Failed to add product.' };
  }
}

export async function updateProductAction(id: string, data: ProductFormData) {
  if (!id) return { success: false, error: "Product ID is required for update." };

  let slugToUse = data.slug;
  if (!slugToUse && data.name) {
    slugToUse = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[™®©&]/g, '').replace(/[^\w-]+/g, '');
  }
  const dataWithSlug = { ...data, slug: slugToUse };

  const validatedFields = productFormSchema.safeParse(dataWithSlug);

  if (!validatedFields.success) {
    console.error("Update Product Action Validation Error:", validatedFields.error.flatten().fieldErrors);
    return { success: false, error: `Validation failed: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}` };
  }
  
  try {
    // Pass the validated ProductFormData directly to the updateProduct service.
    // The service layer will handle transforming it for Firestore.
    await updateProduct(id, validatedFields.data); 
    
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/edit/${id}`);
    revalidatePath('/products');
    if (validatedFields.data.slug) { 
        revalidatePath(`/products/${validatedFields.data.slug}`);
    }
    return { success: true, message: 'Product updated successfully!' };
  } catch (error) {
     console.error("Update Product Action Error:", error);
    return { success: false, error: (error as Error).message || 'Failed to update product.' };
  }
}

export async function deleteProductAction(id: string): Promise<{ success: boolean; message?: string; error?: string }> {
  if (!id) {
    return { success: false, error: 'Product ID is required for deletion.' };
  }
  try {
    await deleteProduct(id); 
    revalidatePath('/admin/products');
    revalidatePath('/products'); 
    return { success: true, message: 'Product deleted successfully!' };
  } catch (error) {
    console.error("Delete Product Action Error:", error);
    return { success: false, error: (error as Error).message || 'Failed to delete product.' };
  }
}

    
