// src/types/product.ts
import { z } from 'zod';
import type { Timestamp } from 'firebase/firestore';

// Zod schema for the product form data with specific image slots
export const productFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
  slug: z.string().min(3, 'Slug must be at least 3 characters long.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can only contain lowercase letters, numbers, and hyphens.')
    .optional()
    .or(z.literal('')), // Allow empty string, will be auto-generated if empty
  
  category: z.string().min(1, "Category is required."),
  refrigerantType: z.string().optional(), // For refrigerant products
  application: z.string().optional(), // e.g., Residential AC, Automotive

  primaryImageUrl: z.string().url('A primary image URL is required.').min(1, 'Please upload and select a primary image.'),
  otherImageUrls: z.array(z.string().url("Each 'other image' must be a valid URL once uploaded."))
    .max(4, 'You can upload a maximum of 4 other images.')
    .optional()
    .default([]),

  shortDescription: z.string().min(10, "Short description must be at least 10 characters.").max(200, "Max 200 chars."),
  longDescription: z.string().min(20, "Long description must be at least 20 characters."),
  applicationNotes: z.string().optional(),
  
  technicalSpecs: z.array(z.object({
    key: z.string().min(1, "Spec key cannot be empty."),
    value: z.string().min(1, "Spec value cannot be empty.")
  })).optional().default([]),
  
  safetyInformation: z.object({
    sdsFileUrl: z.string().url("SDS URL must be valid if provided.").optional().or(z.literal('')),
    precautions: z.array(z.object({ text: z.string().min(1,"Precaution text cannot be empty.") })).optional().default([]),
    epaCertification: z.string().optional(), // Text field for EPA info
  }).optional(),

  technicalDocumentUrl: z.string().url("Technical Document URL must be valid if provided.").optional().or(z.literal('')),
  
  price: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number({ invalid_type_error: "Price must be a number." }).nullable().optional()
  ),
  isPurchasable: z.boolean().default(true),
  requiresCertification: z.boolean().default(false), // Unified field for certification needs
  availability: z.enum(['In Stock', 'Out of Stock', 'Pre-Order']).default('In Stock'),
  sku: z.string().min(1, "SKU is required."),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

// Structure for a single image as stored in Firestore (OLD, for migration reference)
export interface ProductImageFirestore_Old {
  url: string;
  altText?: string;
  dataAiHint?: string;
  isPrimary?: boolean;
}

// The full Product type as stored in Firestore and used across the app
export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  refrigerantType?: string;
  application?: string;
  
  primaryImageUrl: string;       // New: Dedicated field for the main image URL
  otherImageUrls: string[];      // New: Array of URLs for up to 4 additional images
  
  // Deprecated: The 'images' field below is for backward compatibility during data migration.
  // New products should use primaryImageUrl and otherImageUrls.
  images?: ProductImageFirestore_Old[]; // Old structure, kept for migration

  shortDescription: string;
  longDescription: string; 
  applicationNotes?: string; 
  technicalSpecs: { [key: string]: string | number | boolean }; // Can be string, number, or boolean
  
  safetyInformation: {
    sdsFileUrl?: string | null; 
    precautions?: string[]; 
    epaCertification?: string | null; // Textual information about EPA cert requirements
  };
  technicalDocumentUrl?: string | null; 

  price: number | null; // Price can be null for quote-only items
  isPurchasable: boolean;
  requiresCertification: boolean; // Unified field
  availability: 'In Stock' | 'Out of Stock' | 'Pre-Order';
  sku: string;
  
  averageRating?: number;
  reviewCount?: number;
  relatedProducts?: RelatedProductInfo[];
  reviews?: ProductReview[];
  
  createdAt?: string | Timestamp | Date; 
  updatedAt?: string | Timestamp | Date;
}

export interface RelatedProductInfo {
  name: string;
  slug: string;
  imageUrl: string;
  dataAiHint?: string; // Keep AI hint for related products display
  price?: number | null;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  date: string; // ISO Date string
  comment: string;
}

    