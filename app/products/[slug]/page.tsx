
// src/app/products/[slug]/page.tsx
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, ShieldAlert, ShoppingCart, FileText, Info, FileBadge, MessageCircle, ThermometerIcon, AlertTriangle, ListChecks, PackageSearch, Check, Loader2, Star, Heart, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect, use } from 'react';
import { useCart, type CartProduct } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { getProductBySlug, type Product, type RelatedProductInfo, type ProductReview } from '@/lib/firebaseServices';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductDetailPageProps {
  params: { slug: string }; // Updated based on how Next.js passes params
}

const defaultProduct: Product = {
  id: '0',
  name: 'Product Not Found',
  slug: 'not-found',
  category: 'Unknown',
  images: [{ url: 'https://placehold.co/800x800.png', alt: 'Placeholder Image for Not Found Product', dataAiHint: 'question mark page blank' }],
  shortDescription: "The refrigerant or accessory you are looking for could not be found. Please check the URL or browse our categories.",
  longDescription: "<p>We're sorry, but the product you're trying to view doesn't exist or has been moved. Please check the URL or use our search and filters to find the refrigerant or HVAC/R accessory you need. You can also <a href='/contact' class='text-accent hover:underline'>contact our support team</a> for assistance.</p>",
  technicalSpecs: {},
  safetyInformation: { precautions: [], epaCertification: null, sdsUrl: null },
  applicationNotes: "",
  price: null,
  isPurchasable: false,
  requiresCertification: false,
  availability: "Out of Stock",
  sku: "N/A",
  averageRating: 0,
  reviewCount: 0,
  relatedProducts: [],
  reviews: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};


export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const slug = params.slug;
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [selectedImage, setSelectedImage] = useState<Product['images'][0] | null>(null);
  const { addToCart, isItemInCart } = useCart();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (slug) {
      const fetchProduct = async () => {
        setIsLoadingProduct(true);
        const productFromDb = await getProductBySlug(slug);
        if (productFromDb) {
          setCurrentProduct(productFromDb);
          setSelectedImage(productFromDb.images?.[0] || null);
          document.title = `${productFromDb.name} | Aether Industries`;
          if (isItemInCart(productFromDb.id)) {
            setIsAdded(true);
          } else {
            setIsAdded(false);
          }
        } else {
          setCurrentProduct(defaultProduct);
          setSelectedImage(defaultProduct.images[0]);
          document.title = `Product Not Found | Aether Industries`;
        }
        setIsLoadingProduct(false);
      };
      fetchProduct();
    }
  }, [slug, isItemInCart]);

  useEffect(() => {
    // Secondary effect to handle cart status changes if product is already loaded
    if (currentProduct && currentProduct.id !== '0') {
      setIsAdded(isItemInCart(currentProduct.id));
    }
  }, [isItemInCart, currentProduct]);


  const handleAddToCart = () => {
    if (!currentProduct || currentProduct.id === '0' || !currentProduct.isPurchasable || currentProduct.availability === 'Out of Stock') return;

    setIsAdding(true);
    const productDetails: CartProduct = {
      productId: currentProduct.id,
      name: currentProduct.name,
      slug: currentProduct.slug,
      imageUrl: currentProduct.images?.[0]?.url || 'https://placehold.co/100x100.png',
      dataAiHint: currentProduct.images?.[0]?.dataAiHint || 'product image',
      price: currentProduct.price,
      isQuoteItem: !currentProduct.isPurchasable,
      requiresCertification: currentProduct.requiresCertification,
    };

    setTimeout(() => { 
      addToCart(productDetails, 1);
      toast({
        title: "Added to Cart!",
        description: `${currentProduct.name} has been successfully added to your cart.`,
        variant: "default",
        action: (
          <Link href="/cart">
            <Button variant="outline" size="sm">View Cart</Button>
          </Link>
        ),
      });
      setIsAdding(false);
      setIsAdded(true); 
    }, 700);
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />)}
        {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground/30 fill-muted-foreground/30" />)}
      </div>
    );
  };

  if (isLoadingProduct || !currentProduct) {
    return (
       <div className="space-y-12 md:space-y-16 py-4 md:py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="md:sticky md:top-24 space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-md" />)}
            </div>
          </div>
          <div className="space-y-6 min-w-0">
            <Skeleton className="h-6 w-1/4" /> {/* Category */}
            <Skeleton className="h-10 w-3/4" /> {/* Title */}
            <Skeleton className="h-5 w-1/3" /> {/* Rating */}
            <Skeleton className="h-6 w-1/2" /> {/* Availability */}
            <Skeleton className="h-20 w-full" /> {/* Short Description */}
            <Skeleton className="h-12 w-1/3" /> {/* Price */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 flex-1" />
            </div>
          </div>
        </div>
        <Skeleton className="h-96 w-full" /> {/* Tabs section */}
      </div>
    );
  }

  return (
    <div className="space-y-12 md:space-y-16 py-4 md:py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Image Gallery - Left Column */}
        <div className="md:sticky md:top-24 space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border shadow-lg">
            <Image
              src={selectedImage?.url || currentProduct.images?.[0]?.url || 'https://placehold.co/800x800.png'}
              alt={selectedImage?.alt || currentProduct.name}
              width={800}
              height={800}
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
              data-ai-hint={selectedImage?.dataAiHint || currentProduct.images?.[0]?.dataAiHint || 'product image detail'}
              priority
            />
          </div>
          {currentProduct.images && currentProduct.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {currentProduct.images.slice(0,4).map((img, idx) => (
                <button
                  key={idx}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all duration-150 ease-in-out hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
                              ${selectedImage?.url === img.url ? 'border-accent scale-105 shadow-md' : 'border-border hover:border-primary/50'}`}
                  onClick={() => setSelectedImage(img)}
                  aria-label={`View image ${idx + 1} for ${currentProduct.name}`}
                  >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                    data-ai-hint={img.dataAiHint}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information & Actions - Right Column */}
        <div className="space-y-6 min-w-0"> {/* Added min-w-0 */}
          <div className="space-y-3">
            <Link 
              href={`/products?category=${encodeURIComponent(currentProduct.category.toLowerCase().replace(/\s+/g, '-'))}`} 
              className="text-sm text-accent font-semibold tracking-wide uppercase hover:underline break-words"
            >
              {currentProduct.category}
            </Link>
            <h1 className="font-headline text-3xl lg:text-4xl font-bold leading-tight break-words">
              {currentProduct.name}
            </h1>
             {currentProduct.sku && <p className="text-xs text-muted-foreground">SKU: {currentProduct.sku}</p>}
            {currentProduct.averageRating && currentProduct.averageRating > 0 && currentProduct.reviewCount && (
              <div className="flex items-center gap-2 text-sm">
                {renderStars(currentProduct.averageRating)}
                <span className="text-muted-foreground">({currentProduct.reviewCount} reviews)</span>
              </div>
            )}
          </div>

          <p className={`text-lg font-semibold flex items-center gap-2 ${currentProduct.availability === "In Stock" ? "text-green-600 dark:text-green-400" : currentProduct.availability === "Out of Stock" ? "text-red-600 dark:text-red-400" : currentProduct.availability === "Pre-Order" ? "text-yellow-600 dark:text-yellow-400" : "text-muted-foreground"}`}>
            {currentProduct.availability === "In Stock" && <CheckCircle className="h-5 w-5"/>}
            {currentProduct.availability === "Out of Stock" && <XCircle className="h-5 w-5"/>}
            {currentProduct.availability === "Pre-Order" && <Clock className="h-5 w-5"/>}
            {currentProduct.availability}
          </p>

          <p className="text-muted-foreground leading-relaxed text-base">{currentProduct.shortDescription}</p>

          {currentProduct.isPurchasable && currentProduct.price !== null && (
            <p className="text-4xl font-bold text-primary">${currentProduct.price.toFixed(2)}</p>
          )}

          {currentProduct.requiresCertification && (
            <div className="p-4 bg-orange-50 dark:bg-orange-900/30 border-l-4 border-orange-500 text-orange-700 dark:text-orange-300 rounded-md text-sm flex items-start gap-2">
              <ShieldAlert className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="font-semibold">EPA Certification Required:</strong> Purchase of this refrigerant requires valid EPA Section 608 certification.
                <Link href="/disclaimers/refrigerant-certification" className="font-semibold underline ml-1 hover:opacity-80">Review Policy & Details</Link>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {currentProduct.isPurchasable ? (
              <Button
                size="lg"
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-150 ease-in-out shadow-md hover:shadow-lg text-base font-semibold py-3"
                onClick={handleAddToCart}
                disabled={currentProduct.id === '0' || currentProduct.availability === 'Out of Stock' || isAdding || isAdded}
              >
                {isAdding ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Adding...</>
                ) : isAdded ? (
                  <><Check className="mr-2 h-5 w-5" /> Added to Cart!</>
                ) : (
                  <><ShoppingCart className="mr-2 h-5 w-5" /> {currentProduct.availability === 'Pre-Order' ? 'Pre-Order Now' : 'Add to Cart'}</>
                )}
              </Button>
            ) : (
              currentProduct.id !== '0' && (
                <Button size="lg" asChild className="flex-1 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg text-base font-semibold py-3">
                  <Link href={`/contact?subject=Quote for ${encodeURIComponent(currentProduct.name)}&product_slug=${currentProduct.slug}`}>
                      <FileText className="mr-2 h-5 w-5" /> Request Quote
                  </Link>
                </Button>
              )
            )}
             <Button size="lg" variant="outline" className="flex-1 border-border hover:bg-muted/50 shadow-sm hover:shadow-md text-base font-semibold py-3" disabled={currentProduct.id === '0'}>
                <Heart className="mr-2 h-5 w-5" /> Add to Wishlist
            </Button>
          </div>
          {currentProduct.availability === 'Out of Stock' && currentProduct.id !== '0' && (
            <p className="text-sm text-muted-foreground">This item is currently out of stock. Please check back later or contact us for lead times.</p>
          )}
        </div>
      </div>

      {currentProduct.id !== '0' && (
      <Card className="mt-12 md:mt-16 shadow-lg border">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 bg-muted/50 rounded-t-lg rounded-b-none p-0 border-b">
            <TabsTrigger value="description" className="py-3 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:font-semibold rounded-tl-lg"><Info className="mr-1.5 h-4 w-4"/>Description</TabsTrigger>
            <TabsTrigger value="specs" className="py-3 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:font-semibold"><ListChecks className="mr-1.5 h-4 w-4"/>Tech Specs</TabsTrigger>
            <TabsTrigger value="safety" className="py-3 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:font-semibold"><ShieldAlert className="mr-1.5 h-4 w-4"/>Safety</TabsTrigger>
            <TabsTrigger value="applications" className="py-3 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:font-semibold"><PackageSearch className="mr-1.5 h-4 w-4"/>Applications</TabsTrigger>
            <TabsTrigger value="reviews" className="py-3 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:font-semibold rounded-tr-lg md:rounded-tr-lg"><MessageCircle className="mr-1.5 h-4 w-4"/>Reviews ({currentProduct.reviews?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="p-6 md:p-8">
            <div className="prose dark:prose-invert max-w-none prose-headings:font-headline prose-headings:text-primary prose-ul:list-disc prose-ul:pl-5 prose-li:mb-1 text-base" dangerouslySetInnerHTML={{ __html: currentProduct.longDescription }} />
          </TabsContent>

          <TabsContent value="specs" className="p-6 md:p-8">
              <h3 className="font-headline text-xl font-semibold mb-4 flex items-center text-primary"><ListChecks className="mr-2 h-5 w-5"/>Technical Specifications</h3>
              {currentProduct.technicalSpecs && Object.keys(currentProduct.technicalSpecs).length > 0 ? (
                <ul className="space-y-3 text-sm">
                  {Object.entries(currentProduct.technicalSpecs).map(([key, value]) => (
                    <li key={key} className="flex flex-col sm:flex-row sm:justify-between py-2.5 border-b border-border/50 last:border-b-0">
                      <span className="font-medium text-foreground">{key}:</span>
                      <span className="text-muted-foreground sm:text-right">{String(value)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No technical specifications available for this product.</p>
              )}
          </TabsContent>

          <TabsContent value="safety" className="p-6 md:p-8">
             <h3 className="font-headline text-xl font-semibold mb-4 flex items-center text-primary"><ShieldAlert className="mr-2 h-5 w-5"/>Safety Information & SDS</h3>
            <div className="prose dark:prose-invert max-w-none prose-headings:font-headline prose-ul:list-disc prose-ul:pl-5 prose-li:mb-1 text-base">
                {currentProduct.safetyInformation?.sdsUrl && (
                    <p className="mb-6">
                        <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
                          <Link href={currentProduct.safetyInformation.sdsUrl} target="_blank" rel="noopener noreferrer">
                            <FileBadge className="mr-2 h-4 w-4"/> Download Safety Data Sheet (SDS)
                          </Link>
                        </Button>
                    </p>
                )}
                 {currentProduct.safetyInformation?.precautions?.length > 0 && (
                    <>
                        <h4 className="font-headline text-lg font-semibold mt-4 mb-2">Handling Precautions:</h4>
                        <ul className="list-disc list-inside space-y-1.5 pl-1">
                            {currentProduct.safetyInformation.precautions.map((note: string, idx: number) => <li key={idx}>{note}</li>)}
                        </ul>
                    </>
                 )}
                {currentProduct.safetyInformation?.epaCertification && (
                    <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/30 border-l-4 border-orange-500 text-orange-700 dark:text-orange-300 rounded-md text-sm"
                         dangerouslySetInnerHTML={{ __html: currentProduct.safetyInformation.epaCertification }} />
                )}
                {!currentProduct.safetyInformation?.sdsUrl && !currentProduct.safetyInformation?.precautions?.length && !currentProduct.safetyInformation?.epaCertification && (
                    <p className="text-muted-foreground">No specific safety information available for this product.</p>
                )}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="p-6 md:p-8">
             <h3 className="font-headline text-xl font-semibold mb-4 flex items-center text-primary"><PackageSearch className="mr-2 h-5 w-5"/>Application Notes & Considerations</h3>
            <div className="prose dark:prose-invert max-w-none prose-headings:font-headline prose-headings:text-primary prose-ul:list-disc prose-ul:pl-5 prose-li:mb-1 text-base">
              {currentProduct.applicationNotes ? (
                <div dangerouslySetInnerHTML={{ __html: currentProduct.applicationNotes }} />
              ) : (
                <p className="text-muted-foreground">No application notes available for this product.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="p-6 md:p-8">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="font-headline text-xl font-semibold flex items-center text-primary"><MessageCircle className="mr-2 h-5 w-5"/>Customer Reviews</h3>
                <Button variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent">Write a Review</Button>
              </div>
              {currentProduct.reviews && currentProduct.reviews.length > 0 ? currentProduct.reviews.map((review: ProductReview) => (
                <div key={review.id} className="py-4 border-b border-border/50 last:border-b-0">
                  <div className="flex items-center mb-2">
                    {renderStars(review.rating)}
                    <span className="ml-3 font-semibold text-foreground">{review.userName}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                </div>
              )) : (
                <p className="text-muted-foreground py-4 text-center">No reviews yet for this product. Be the first to share your experience!</p>
              )}
          </TabsContent>
        </Tabs>
      </Card>
      )}

      {currentProduct.id !== '0' && currentProduct.relatedProducts && currentProduct.relatedProducts.length > 0 && (
        <section className="pt-12 md:pt-16">
          <h2 className="font-headline text-2xl md:text-3xl font-semibold mb-8 text-center">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentProduct.relatedProducts.map((related: RelatedProductInfo) => (
              <Card key={related.slug} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 group border">
                <CardHeader className="p-0 relative">
                 <Link href={`/products/${related.slug}`} className="block aspect-[4/3] overflow-hidden">
                  <Image src={related.imageUrl} alt={related.name} width={300} height={225} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-ai-hint={related.dataAiHint}/>
                 </Link>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <CardTitle className="font-headline text-md mb-1 line-clamp-2 leading-tight">
                     <Link href={`/products/${related.slug}`} className="hover:text-primary">{related.name}</Link>
                  </CardTitle>
                  {related.price && <p className="text-primary font-semibold text-sm mt-1">${related.price.toFixed(2)}</p>}
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm" size="sm">
                    <Link href={`/products/${related.slug}`}>View Product</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
