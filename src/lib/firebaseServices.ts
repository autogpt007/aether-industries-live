
// src/lib/firebaseServices.ts
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  orderBy,
  limit as firestoreLimit,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc, 
  type DocumentData,
  type QueryDocumentSnapshot,
  type FirestoreDataConverter,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product, ProductFormData, RelatedProductInfo, ProductReview, ProductImageFirestore_Old } from '@/types/product';
import { productFormSchema } from '@/types/product'; 

// Re-export types for easier access from actions.ts
export type { Product, ProductFormData, RelatedProductInfo, ProductReview, ProductImageFirestore_Old };


const productConverter: FirestoreDataConverter<Product> = {
  toFirestore(productData: Omit<Product, 'id'>): DocumentData { 
    const dataToStore: any = { ...productData };

    if (dataToStore.createdAt && !(dataToStore.createdAt instanceof Timestamp)) {
      dataToStore.createdAt = Timestamp.fromDate(new Date(dataToStore.createdAt as string | Date));
    } else if (!dataToStore.createdAt) {
      dataToStore.createdAt = Timestamp.now();
    }
    dataToStore.updatedAt = Timestamp.now(); 
    
    delete dataToStore.id;
    delete dataToStore.images; // Ensure old 'images' field is not written

    if (!Array.isArray(dataToStore.otherImageUrls)) {
        dataToStore.otherImageUrls = [];
    }
    
    if (typeof dataToStore.price !== 'number' && dataToStore.price !== null) {
        dataToStore.price = null;
    }
    
    // Ensure technicalSpecs is an object
    if (Array.isArray(dataToStore.technicalSpecs)) { 
        dataToStore.technicalSpecs = (dataToStore.technicalSpecs as Array<{key: string, value: string}>)
          .reduce((acc: Record<string, string>, spec) => { 
            if (spec && typeof spec.key === 'string' && spec.key.trim() !== '' && typeof spec.value === 'string' && spec.value.trim() !== '') {
              acc[spec.key.trim()] = spec.value.trim();
            }
            return acc; 
          }, {} as Record<string, string>);
    } else if (typeof dataToStore.technicalSpecs !== 'object' || dataToStore.technicalSpecs === null) {
        dataToStore.technicalSpecs = {};
    }

    // Ensure safetyInformation and its precautions are correctly formatted
    if (dataToStore.safetyInformation) {
        if (Array.isArray(dataToStore.safetyInformation.precautions) && dataToStore.safetyInformation.precautions.every((p:any) => typeof p === 'object' && p !== null && 'text' in p)) {
            dataToStore.safetyInformation.precautions = (dataToStore.safetyInformation.precautions as Array<{text:string}>).map((p:any) => p.text).filter(Boolean);
        } else if (!Array.isArray(dataToStore.safetyInformation.precautions)) {
             dataToStore.safetyInformation.precautions = [];
        }
    } else {
        dataToStore.safetyInformation = { precautions: [] }; // Default if not present
    }


    return dataToStore;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Product {
    const data = snapshot.data({ serverTimestamps: 'estimate' }) || {};
    const fallbackDate = new Date(0).toISOString(); // Use a very old, clearly identifiable fallback date

    const convertTimestamp = (timestampField: any): string => {
      if (!timestampField) return fallbackDate;
      if (timestampField instanceof Timestamp) return timestampField.toDate().toISOString();
      if (typeof timestampField === 'string') {
        try { 
          const parsedDate = new Date(timestampField); 
          return isNaN(parsedDate.getTime()) ? fallbackDate : parsedDate.toISOString(); 
        } catch (e) { return fallbackDate; }
      }
      if (typeof timestampField === 'number') { // Handle cases where timestamp might be a number (e.g., epoch ms)
         const dateFromNumber = new Date(timestampField);
         return isNaN(dateFromNumber.getTime()) ? fallbackDate : dateFromNumber.toISOString();
      }
       // Handle Firestore server timestamp placeholder if data is not yet fully committed
      if (typeof timestampField === 'object' && timestampField !== null && timestampField.seconds !== undefined && timestampField.nanoseconds !== undefined) {
        try {
            return new Timestamp(timestampField.seconds, timestampField.nanoseconds).toDate().toISOString();
        } catch(e) { return fallbackDate;}
      }
      return fallbackDate; // Default fallback
    };
    
    // Robust image handling: primaryImageUrl, then otherImageUrls, then old images field, then placeholder
    let finalPrimaryImageUrl = typeof data.primaryImageUrl === 'string' ? data.primaryImageUrl : '';
    let finalOtherImageUrls: string[] = Array.isArray(data.otherImageUrls) 
        ? data.otherImageUrls.filter((url: any) => typeof url === 'string') 
        : [];

    // Migration logic from old 'images' array or single 'imageUrl'
    if (!finalPrimaryImageUrl && Array.isArray(data.images) && data.images.length > 0) {
      const oldImagesTyped = data.images as ProductImageFirestore_Old[];
      const oldPrimary = oldImagesTyped.find(img => img.isPrimary === true && typeof img.url === 'string');
      
      if (oldPrimary) {
        finalPrimaryImageUrl = oldPrimary.url;
      } else if (typeof oldImagesTyped[0]?.url === 'string') {
        finalPrimaryImageUrl = oldImagesTyped[0].url;
      }

      // Populate otherImageUrls from old 'images' if new field is empty and old one exists
      if (finalOtherImageUrls.length === 0) {
        oldImagesTyped.forEach(img => {
          if (typeof img.url === 'string' && img.url !== finalPrimaryImageUrl && finalOtherImageUrls.length < 4) {
            finalOtherImageUrls.push(img.url);
          }
        });
      }
    } else if (!finalPrimaryImageUrl && typeof data.imageUrl === 'string') { // Fallback for very old single imageUrl
      finalPrimaryImageUrl = data.imageUrl;
    }
    // Ensure there's always a primary image URL, even if it's a placeholder
    if (!finalPrimaryImageUrl && finalOtherImageUrls.length > 0) {
      finalPrimaryImageUrl = finalOtherImageUrls.shift()!; // Use first 'other' image if primary is missing
    } else if (!finalPrimaryImageUrl) {
        finalPrimaryImageUrl = 'https://placehold.co/600x400.png'; // Absolute fallback placeholder
    }

    const safetyInfoData = data.safetyInformation || {}; // Ensure safetyInfoData is an object
    const safetyInfo = {
      sdsFileUrl: typeof safetyInfoData.sdsFileUrl === 'string' ? safetyInfoData.sdsFileUrl : null,
      precautions: Array.isArray(safetyInfoData.precautions) ? safetyInfoData.precautions.filter((p: any) => typeof p === 'string') : [],
      epaCertification: typeof safetyInfoData.epaCertification === 'string' ? safetyInfoData.epaCertification : null,
    };
    
    const availabilityOptions: Product['availability'][] = ['In Stock', 'Out of Stock', 'Pre-Order'];
    const currentAvailability = typeof data.availability === 'string' && availabilityOptions.includes(data.availability as Product['availability'])
      ? data.availability as Product['availability']
      : 'Out of Stock'; // Default to Out of Stock if invalid

    return {
      id: snapshot.id,
      name: typeof data.name === 'string' && data.name.trim() !== '' ? data.name : 'Unnamed Product',
      slug: typeof data.slug === 'string' && data.slug.trim() !== '' ? data.slug : snapshot.id,
      category: typeof data.category === 'string' && data.category.trim() !== '' ? data.category : 'Uncategorized',
      refrigerantType: typeof data.refrigerantType === 'string' ? data.refrigerantType : undefined,
      application: typeof data.application === 'string' ? data.application : undefined,
      
      primaryImageUrl: finalPrimaryImageUrl,
      otherImageUrls: finalOtherImageUrls,

      // 'images' field is primarily for reading old data; new data uses dedicated fields
      images: Array.isArray(data.images) ? data.images.map((img: any) => ({
        url: typeof img.url === 'string' ? img.url : 'https://placehold.co/100x100.png',
        altText: typeof img.altText === 'string' ? img.altText : 'Product image',
        dataAiHint: typeof img.dataAiHint === 'string' ? img.dataAiHint : 'product',
        isPrimary: typeof img.isPrimary === 'boolean' ? img.isPrimary : false,
      })) : undefined, // Keep undefined if not present

      shortDescription: typeof data.shortDescription === 'string' ? data.shortDescription : 'No description available.',
      longDescription: typeof data.longDescription === 'string' ? data.longDescription : '<p>No detailed description available.</p>',
      applicationNotes: typeof data.applicationNotes === 'string' ? data.applicationNotes : "",
      technicalSpecs: typeof data.technicalSpecs === 'object' && data.technicalSpecs !== null ? data.technicalSpecs : {},
      
      safetyInformation: safetyInfo,
      technicalDocumentUrl: typeof data.technicalDocumentUrl === 'string' ? data.technicalDocumentUrl : null,

      price: typeof data.price === 'number' ? data.price : null,
      isPurchasable: data.isPurchasable === true, // Explicit boolean check
      requiresCertification: data.requiresCertification === true, 
      availability: currentAvailability,
      sku: typeof data.sku === 'string' && data.sku.trim() !== '' ? data.sku : `SKU-${snapshot.id}`,
      
      averageRating: typeof data.averageRating === 'number' ? data.averageRating : 0,
      reviewCount: typeof data.reviewCount === 'number' ? data.reviewCount : 0,
      relatedProducts: Array.isArray(data.relatedProducts) ? data.relatedProducts : [],
      reviews: Array.isArray(data.reviews) 
        ? data.reviews
            .filter((r: any) => r && typeof r.date !== 'undefined') // Ensure review and date exist
            .map((r: any) => ({
                id: typeof r.id === 'string' ? r.id : String(Math.random()), // fallback ID
                userName: typeof r.userName === 'string' ? r.userName : 'Anonymous',
                rating: typeof r.rating === 'number' ? r.rating : 0,
                date: convertTimestamp(r.date), 
                comment: typeof r.comment === 'string' ? r.comment : '',
            })) 
        : [],
      
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt),
    } as Product;
  }
};

export async function getProducts(options?: { limit?: number, category?: string }): Promise<Product[]> {
  const productsCollectionRef = collection(db, 'products');
  let q = query(productsCollectionRef.withConverter(productConverter), orderBy('name')); 

  if (options?.category) {
    q = query(q, where('category', '==', options.category));
  }
  if (options?.limit) {
    q = query(q, firestoreLimit(options.limit));
  }
  
  try {
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(docSnap => {
      try {
        return docSnap.data(); 
      } catch (conversionError: any) {
        console.error(`Error converting product document ${docSnap.id} in getProducts:`, conversionError.message, conversionError.stack);
        // Optionally log more details, e.g., the raw data that failed conversion:
        // console.error("Problematic data for doc " + docSnap.id + ":", JSON.stringify(docSnap.data({ serverTimestamps: 'none' }), null, 2));
        return null; // Return null for products that fail conversion
      }
    });
    // Filter out any products that were skipped (returned as null)
    return products.filter(product => product !== null) as Product[];
  } catch (error) {
    console.error("Error fetching products collection:", error);
    return []; // Return empty array on error
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!id || typeof id !== 'string' || id.trim() === '') {
    console.warn('getProductById called with invalid ID.');
    return null;
  }
  const docRef = doc(db, 'products', id).withConverter(productConverter);
  try {
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.warn(`Product with ID ${id} not found.`);
      return null;
    }
    try {
      return docSnap.data();
    } catch (conversionError: any) {
      console.error(`Error converting product document ${id} in getProductById:`, conversionError.message, conversionError.stack);
      // console.error("Problematic data for doc " + id + ":", JSON.stringify(docSnap.data({ serverTimestamps: 'none' }), null, 2));
      return null; 
    }
  } catch (error) {
    console.error(`Error fetching product by ID (${id}):`, error);
    return null; 
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    console.warn('getProductBySlug called with invalid slug.');
    return null;
  }
  const productsCollection = collection(db, 'products').withConverter(productConverter);
  const q = query(productsCollection, where('slug', '==', slug), firestoreLimit(1));
  try {
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.warn(`No product found with slug: ${slug}`);
      return null;
    }
    try {
      return snapshot.docs[0].data(); 
    } catch (conversionError: any) {
      console.error(`Error converting product document with slug ${slug} (ID: ${snapshot.docs[0].id}) in getProductBySlug:`, conversionError.message, conversionError.stack);
      // console.error("Problematic data for doc " + snapshot.docs[0].id + ":", JSON.stringify(snapshot.docs[0].data({ serverTimestamps: 'none' }), null, 2));
      return null; 
    }
  } catch (error) {
    console.error(`Error fetching product by slug (${slug}):`, error);
    return null; 
  }
}

export async function addProduct(formDataPayload: ProductFormData): Promise<string> {
  try {
    // Validate with Zod schema first
    const validationResult = productFormSchema.safeParse(formDataPayload);
    if (!validationResult.success) {
      console.error('[Firebase Service] addProduct: Validation Error:', validationResult.error.flatten().fieldErrors);
      throw new Error(`Validation failed: ${JSON.stringify(validationResult.error.flatten().fieldErrors)}`);
    }
    const validatedData = validationResult.data;

    const newProductRef = doc(collection(db, 'products'));
    
    const productForDb: Omit<Product, 'id'> = {
      name: validatedData.name,
      slug: validatedData.slug || validatedData.name.toLowerCase().replace(/\s+/g, '-').replace(/[™®©&]/g, '').replace(/[^\w-]+/g, ''), 
      category: validatedData.category,
      refrigerantType: validatedData.refrigerantType,
      application: validatedData.application,
      primaryImageUrl: validatedData.primaryImageUrl,
      otherImageUrls: validatedData.otherImageUrls || [],
      shortDescription: validatedData.shortDescription,
      longDescription: validatedData.longDescription,
      applicationNotes: validatedData.applicationNotes,
      technicalSpecs: (Array.isArray(validatedData.technicalSpecs) ? validatedData.technicalSpecs : [])
        .reduce((acc, spec) => {
          if (spec && typeof spec.key === 'string' && spec.key.trim() !== '' && typeof spec.value === 'string' && spec.value.trim() !== '') {
            acc[spec.key.trim()] = spec.value.trim();
          }
          return acc;
        }, {} as Record<string, string>),
      safetyInformation: {
        sdsFileUrl: validatedData.safetyInformation?.sdsFileUrl || null,
        precautions: validatedData.safetyInformation?.precautions?.map(p => p.text).filter(Boolean) || [],
        epaCertification: validatedData.safetyInformation?.epaCertification || null,
      },
      technicalDocumentUrl: validatedData.technicalDocumentUrl || null,
      price: validatedData.price,
      isPurchasable: validatedData.isPurchasable,
      requiresCertification: validatedData.requiresCertification,
      availability: validatedData.availability,
      sku: validatedData.sku,
      averageRating: 0,
      reviewCount: 0,
      reviews: [],
      relatedProducts: [],
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString(),
    };
    
    await setDoc(newProductRef.withConverter(productConverter), productForDb);
    return newProductRef.id;
  } catch (error: any) {
    console.error('[Firebase Service] addProduct: Error:', error.message, error.stack, "Payload received:", formDataPayload);
    throw new Error(`Failed to add product: ${error.message}`);
  }
}

export async function updateProduct(id: string, formDataPayload: ProductFormData): Promise<void> {
  try {
    // Validate with Zod schema first
    const validationResult = productFormSchema.safeParse(formDataPayload);
    if (!validationResult.success) {
      console.error(`[Firebase Service] updateProduct (${id}): Validation Error:`, validationResult.error.flatten().fieldErrors);
      throw new Error(`Validation failed: ${JSON.stringify(validationResult.error.flatten().fieldErrors)}`);
    }
    const validatedData = validationResult.data;
    
    const productRef = doc(db, 'products', id); 
    
    const finalUpdatePayload: DocumentData = {
      name: validatedData.name,
      slug: validatedData.slug || validatedData.name.toLowerCase().replace(/\s+/g, '-').replace(/[™®©&]/g, '').replace(/[^\w-]+/g, ''),
      category: validatedData.category,
      refrigerantType: validatedData.refrigerantType,
      application: validatedData.application,
      primaryImageUrl: validatedData.primaryImageUrl,
      otherImageUrls: validatedData.otherImageUrls || [],
      shortDescription: validatedData.shortDescription,
      longDescription: validatedData.longDescription,
      applicationNotes: validatedData.applicationNotes,
      technicalSpecs: (Array.isArray(validatedData.technicalSpecs) ? validatedData.technicalSpecs : [])
        .reduce((acc, spec) => {
          if (spec && typeof spec.key === 'string' && spec.key.trim() !== '' && typeof spec.value === 'string' && spec.value.trim() !== '') {
            acc[spec.key.trim()] = spec.value.trim();
          }
          return acc;
        }, {} as Record<string, string>),
      safetyInformation: {
        sdsFileUrl: validatedData.safetyInformation?.sdsFileUrl || null,
        precautions: validatedData.safetyInformation?.precautions?.map(p => p.text).filter(Boolean) || [],
        epaCertification: validatedData.safetyInformation?.epaCertification || null,
      },
      technicalDocumentUrl: validatedData.technicalDocumentUrl || null,
      price: validatedData.price,
      isPurchasable: validatedData.isPurchasable,
      requiresCertification: validatedData.requiresCertification,
      availability: validatedData.availability,
      sku: validatedData.sku,
      // averageRating, reviewCount, reviews, relatedProducts are typically updated via separate processes
      updatedAt: Timestamp.now(), 
    };
    
    delete (finalUpdatePayload as any).images; // Ensure old 'images' field is not part of update payload

    await updateDoc(productRef, finalUpdatePayload);

  } catch (error: any) {
    console.error(`[Firebase Service] updateProduct (${id}): Error - ${error.message}`, error.stack, "Payload received by updateProduct:", formDataPayload);
    throw new Error(`Failed to update product: ${error.message}`);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  if (!id || typeof id !== 'string' || id.trim() === '') {
    console.warn('deleteProduct called with invalid ID.');
    throw new Error('Invalid product ID provided for deletion.');
  }
  const productRef = doc(db, 'products', id);
  try {
    await deleteDoc(productRef);
  } catch (error: any) {
    console.error(`[Firebase Service] deleteProduct (${id}): Error - ${error.message}`, error.stack);
    throw new Error(`Failed to delete product: ${error.message}`);
  }
}

export async function seedDatabase(): Promise<{success: boolean, count: number, error?: string}> {
  console.warn("seedDatabase function called, but no sample data is defined. No products were added.");
  return { success: true, count: 0, error: "No sample data provided for seeding." };
}
    

    