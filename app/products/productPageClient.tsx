
// app/products/productPageClient.tsx
'use client';

// Action import
import { seedDatabaseAction } from './actions';

// React and Next.js imports
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// UI component imports
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


// Icon imports
import { SlidersHorizontal, Search, X, Filter, ShieldAlert, ShoppingCart, Loader2, Check, PanelLeftClose, Tag, PackageCheck, Info, DatabaseZap, AlertCircle, CheckCircleIcon } from 'lucide-react';

// Context and Hook imports
import { useCart, type CartProduct } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

// Type import
import type { Product } from '@/types/product'; // Ensure Product type is used

const filterOptions = {
  categories: ['Refrigerants', 'Manifold Gauges', 'Recovery Equipment', 'Vacuum Pumps', 'Leak Detectors', 'Hoses & Fittings', 'Tools & Gauges', 'Accessories'],
  refrigerantTypes: ['HFC', 'HFO', 'HCFC Alternatives', 'Natural Refrigerants', 'Other Gases'],
  applications: ['Residential AC', 'Commercial AC', 'Commercial Refrigeration', 'Automotive AC', 'Chillers', 'HVAC Tools', 'Industrial Refrigeration', 'Welding', 'Medical'],
  availability: ['In Stock', 'Out of Stock', 'Pre-Order'],
  priceRanges: [
    { label: 'Under $100', value: '0-99.99' },
    { label: '$100 - $249.99', value: '100-249.99' },
    { label: '$250 - $499.99', value: '250-499.99' },
    { label: '$500 - $999.99', value: '500-999.99' },
    { label: 'Over $1000', value: '1000-' },
  ],
};

interface ProductPageClientProps {
  initialProducts: Product[];
}

function ProductDisplayPageContent({ initialProducts }: ProductPageClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    categories: [], refrigerantTypes: [], applications: [], availability: [], priceRanges: []
  });
  const { addToCart, isItemInCart } = useCart();
  const { toast } = useToast();
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const { isMobile, open: isDesktopSidebarOpen } = useSidebar();
  const [pageIsMounted, setPageIsMounted] = useState(false);

  const [seederLoading, setSeederLoading] = useState(false);
  const [seederMessage, setSeederMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);


  useEffect(() => {
    setPageIsMounted(true);
    document.title = 'Freon™ Refrigerants & HVAC/R Accessories | Aether Industries';
  }, []); 

  useEffect(() => {
    setProducts(initialProducts);
    setIsLoadingProducts(false);
    console.log('[ProductPageClient] initialProducts prop received, products state set.');
  }, [initialProducts]);


  const handleFilterChange = useCallback((filterType: string, value: string) => {
    setSelectedFilters(prev => {
      const currentValues = prev[filterType] || [];
      let newFilters = { ...prev };
      if (filterType === 'categories') {
        const newCategories = currentValues.includes(value) ? currentValues.filter(v => v !== value) : [...currentValues, value];
        newFilters.categories = newCategories;
        if (!newCategories.includes('Refrigerants')) {
          newFilters.refrigerantTypes = [];
        }
      } else {
         newFilters = {
          ...prev,
          [filterType]: currentValues.includes(value) ? currentValues.filter(v => v !== value) : [...currentValues, value]
        };
      }
      return newFilters;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedFilters({ categories: [], refrigerantTypes: [], applications: [], availability: [], priceRanges: [] });
    setSearchTerm('');
  }, []);

  const filteredProducts = useMemo(() => {
    if (!pageIsMounted || !products) return [];
    if (products.length === 0) return [];

    let productsToFilter = products;

    if (searchTerm.trim() !== '') {
      productsToFilter = productsToFilter.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedFilters.categories.length > 0) {
      productsToFilter = productsToFilter.filter(product =>
        selectedFilters.categories.includes(product.category)
      );
    }

    if (selectedFilters.refrigerantTypes.length > 0 &&
        (selectedFilters.categories.length === 0 || selectedFilters.categories.includes('Refrigerants'))) {
      productsToFilter = productsToFilter.filter(product =>
        product.refrigerantType && selectedFilters.refrigerantTypes.includes(product.refrigerantType)
      );
    }

    if (selectedFilters.applications.length > 0) {
      productsToFilter = productsToFilter.filter(product =>
        product.application && selectedFilters.applications.includes(product.application)
      );
    }

    if (selectedFilters.availability.length > 0) {
      productsToFilter = productsToFilter.filter(product =>
        selectedFilters.availability.includes(product.availability)
      );
    }

    if (selectedFilters.priceRanges.length > 0) {
      productsToFilter = productsToFilter.filter(product => {
        if (product.price === null || product.price === undefined) return false;
        return selectedFilters.priceRanges.some(range => {
          const [minStr, maxStr] = range.split('-');
          const min = parseFloat(minStr);
          const max = maxStr ? parseFloat(maxStr) : Infinity;
          if (isNaN(max)) return product.price >= min;
          return product.price >= min && product.price <= max;
        });
      });
    }
    return productsToFilter;
  }, [products, searchTerm, selectedFilters, pageIsMounted]);

  const activeFilterCount = useMemo(() => {
    return Object.values(selectedFilters).reduce((acc, curr) => acc + curr.length, 0) + (searchTerm ? 1 : 0);
  }, [selectedFilters, searchTerm]);

  const handleAddToCartList = useCallback((product: Product) => {
    if (!product.isPurchasable || product.availability === 'Out of Stock') return;

    setAddingProductId(product.id);
    setAddedProductId(null);

    const productDetails: CartProduct = {
      productId: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.images?.[0]?.url || 'https://placehold.co/100x100.png',
      dataAiHint: product.images?.[0]?.dataAiHint || 'product image',
      price: product.price,
      isQuoteItem: !product.isPurchasable,
      requiresCertification: product.requiresCertification,
    };

    setTimeout(() => {
      addToCart(productDetails, 1);
      toast({
        title: "Added to Cart!",
        description: `${product.name} has been added to your cart.`,
        action: <Link href="/cart"><Button variant="outline" size="sm">View Cart</Button></Link>,
      });
      setAddingProductId(null);
      setAddedProductId(product.id);
      setTimeout(() => setAddedProductId(null), 2000);
    }, 700);
  }, [addToCart, toast]);

  const FilterGroup = ({ title, options, filterType }: { title: string; options: {label: string, value: string}[] | string[]; filterType: string }) => (
    <AccordionItem value={filterType}>
      <AccordionTrigger className="text-sm font-semibold hover:text-accent py-3">{title}</AccordionTrigger>
      <AccordionContent className="pt-1 pb-2 px-1">
        <div className="space-y-2">
          {options.map(opt => {
            const optionValue = typeof opt === 'string' ? opt : opt.value;
            const optionLabel = typeof opt === 'string' ? opt : opt.label;
            return (
              <div key={optionValue} className="flex items-center space-x-2">
                <Checkbox
                  id={`${filterType}-${optionValue.replace(/\s+/g, '-').toLowerCase()}`}
                  checked={selectedFilters[filterType]?.includes(optionValue)}
                  onCheckedChange={() => handleFilterChange(filterType, optionValue)}
                />
                <Label htmlFor={`${filterType}-${optionValue.replace(/\s+/g, '-').toLowerCase()}`} className="text-xs font-normal cursor-pointer">
                  {optionLabel}
                </Label>
              </div>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  const FiltersComponent = () => (
    <Accordion type="multiple" className="w-full space-y-1" defaultValue={['categories', 'availability']}>
      <div className="px-1 pb-2">
        <Label htmlFor="search-products" className="text-sm font-semibold mb-1 block">Search Products</Label>
        <div className="relative">
            <Input
            id="search-products"
            type="text"
            placeholder="Search by name, SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-9 text-xs"
            />
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
      <FilterGroup title="Categories" options={filterOptions.categories} filterType="categories" />
      {(selectedFilters.categories.length === 0 || selectedFilters.categories.includes('Refrigerants')) && (
        <FilterGroup title="Refrigerant Types" options={filterOptions.refrigerantTypes} filterType="refrigerantTypes" />
      )}
      <FilterGroup title="Applications" options={filterOptions.applications} filterType="applications" />
      <FilterGroup title="Availability" options={filterOptions.availability} filterType="availability" />
      <FilterGroup title="Price Range" options={filterOptions.priceRanges} filterType="priceRanges" />
    </Accordion>
  );

  const ProductCardSkeleton = () => (
    <Card className="flex flex-col overflow-hidden h-full border shadow-sm">
      <Skeleton className="w-full h-48" />
      <CardContent className="p-4 flex-grow space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto space-y-2">
        <Skeleton className="h-6 w-1/4 mb-2" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );

  const handleSeedDatabase = async () => {
    if (!confirm('Are you sure you want to add demo products to the database? This may create duplicates if run multiple times.')) {
        return;
    }
    setSeederLoading(true);
    setSeederMessage(null);
    try {
        const result = await seedDatabaseAction();
        if (result.success) {
          setSeederMessage({type: 'success', text: `Success! Added ${result.count} products. PLEASE REFRESH THE PAGE to see them.`});
          toast({
            title: 'Database Seeded!',
            description: `Successfully added ${result.count} products. Please refresh the page.`,
            duration: 5000,
          });
        } else {
          setSeederMessage({type: 'error', text: `Error seeding database: ${result.error || 'Unknown error'}`});
          toast({
            title: 'Seeding Error',
            description: `Error seeding database: ${result.error || 'Unknown error'}`,
            variant: 'destructive',
          });
        }
    } catch (error: any) {
        setSeederMessage({type: 'error', text: `Error calling seed action: ${error.message}`});
        toast({
            title: 'Action Error',
            description: `Error calling seed action: ${error.message}`,
            variant: 'destructive',
        });
    }
    setSeederLoading(false);
  };

  if (!pageIsMounted) {
    return (
      <div className="py-8">
        <div className="mb-8">
          <Skeleton className="h-12 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="flex flex-col md:flex-row gap-8 md:items-start">
          <aside className="hidden md:block w-full md:w-[280px] lg:w-[320px] sticky top-20 self-start">
            <Skeleton className="h-[500px] w-full" />
          </aside>
          <main className="flex-1 p-0 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold mb-2 break-words">Explore Refrigerants & HVAC/R Supplies</h1>
        <p className="text-lg text-muted-foreground break-words">
          Discover genuine Freon™ products, professional-grade tools, and essential accessories for all your cooling system needs.
        </p>
      </div>
      
      {/* Admin Tool: Seeder - TEMPORARY, FOR DEVELOPMENT */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30">
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center text-yellow-700 dark:text-yellow-300">
              <DatabaseZap className="mr-3 h-6 w-6" /> Admin Tool: Database Seeder (Dev Only)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-3">
              This tool populates the Firestore database with demo products. Use with caution.
            </p>
            <Button 
              onClick={handleSeedDatabase} 
              disabled={seederLoading}
              variant="outline"
              className="border-yellow-600 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-400 dark:text-yellow-300 dark:hover:bg-yellow-800"
            >
              {seederLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DatabaseZap className="mr-2 h-4 w-4" />}
              {seederLoading ? 'Seeding...' : 'Add Demo Products to DB'}
            </Button>
            {seederMessage && (
              <Alert className={`mt-4 ${seederMessage.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/30' : 'border-red-500 bg-red-50 dark:bg-red-900/30'}`}>
                <AlertTitle className={`font-semibold ${seederMessage.type === 'success' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                    {seederMessage.type === 'success' ? <CheckCircleIcon className="inline h-5 w-5 mr-2"/> : <AlertCircle className="inline h-5 w-5 mr-2"/>}
                    {seederMessage.type === 'success' ? 'Success' : 'Error'}
                </AlertTitle>
                <AlertDescription className={`${seederMessage.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {seederMessage.text}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}


      <Card className="mb-6 bg-blue-50 dark:bg-blue-900/30 border-blue-500">
        <CardHeader>
          <CardTitle className="font-headline text-lg flex items-center text-blue-700 dark:text-blue-300">
            <ShieldAlert className="mr-3 h-6 w-6" /> Important: EPA Certification & Safe Handling
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-600 dark:text-blue-400 break-words">
            The purchase and use of most refrigerants (e.g., R-410A, R-134a, R-32, MO99) are subject to EPA Section 608 regulations.
            Ensure you possess valid certification and adhere to all safe handling practices.
            Aether Industries is committed to compliant sales.
            Review our <Link href="/disclaimers/refrigerant-certification" className="font-semibold underline hover:opacity-80">Refrigerant Certification Policy</Link>.
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-primary hover:bg-primary/10" aria-label="Toggle Filters">
             {pageIsMounted && isMobile === false && isDesktopSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <SlidersHorizontal className="h-5 w-5" />}
            <span className="ml-1 text-sm font-medium md:hidden">Filters</span>
            {activeFilterCount > 0 && <Badge variant="secondary" className="md:hidden">{activeFilterCount}</Badge>}
          </SidebarTrigger>
          <span className="text-sm text-muted-foreground hidden md:inline">
            {isLoadingProducts && products.length === 0 ? 'Loading products...' : `${filteredProducts.length} products found`}
          </span>
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" onClick={clearFilters} className="text-xs text-accent hover:text-accent/80">
            Clear All Filters ({activeFilterCount}) <X className="ml-1 h-3 w-3"/>
          </Button>
        )}
      </div>
      <span className="text-sm text-muted-foreground md:hidden mb-4 block">
        {isLoadingProducts && products.length === 0 ? 'Loading products...' : `${filteredProducts.length} products found`}
      </span>

      <div className="flex flex-col md:flex-row gap-8 md:items-start">
        <aside className="hidden md:block w-full md:w-[280px] lg:w-[320px] sticky top-20 self-start">
          <div className="p-1 rounded-lg border bg-card shadow-sm">
            <ScrollArea className="h-auto max-h-[calc(100vh-12rem)]">
              <div className="p-3">
                <FiltersComponent />
              </div>
            </ScrollArea>
          </div>
        </aside>

        <Sidebar collapsible="offcanvas" side="left" className="md:hidden">
          <ScrollArea className="h-full">
            <SidebarHeader className="border-b p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Filter Products</h2>
                <SidebarTrigger asChild>
                  <Button variant="ghost" size="icon"><X className="h-5 w-5"/></Button>
                </SidebarTrigger>
              </div>
            </SidebarHeader>
            <SidebarContent className="p-4">
              <FiltersComponent />
            </SidebarContent>
            <SidebarFooter className="p-4 border-t flex flex-col sm:flex-row gap-2">
              <Button onClick={clearFilters} variant="outline" className="w-full">Clear Filters</Button>
              <SidebarTrigger asChild><Button className="w-full">Show Results</Button></SidebarTrigger>
            </SidebarFooter>
          </ScrollArea>
        </Sidebar>

        <main className="flex-1 p-0 min-w-0">
          {isLoadingProducts && products.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isCurrentlyAdding = addingProductId === product.id;
                const isCurrentlyAdded = addedProductId === product.id || (pageIsMounted && isItemInCart(product.id));
                
                const displayTitle = product.name;
                const displayDescription = product.shortDescription;
                const displayImage = product.images?.[0]?.url || 'https://placehold.co/600x400.png';
                const displayDataAiHint = product.images?.[0]?.dataAiHint || 'hvac product image';

                return (
                  <Card key={product.id} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 group h-full border rounded-lg">
                    <CardHeader className="p-0 relative">
                      <Link href={`/products/${product.slug}`} className="block aspect-video overflow-hidden">
                        <Image
                          src={displayImage}
                          alt={displayTitle}
                          width={600}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          data-ai-hint={displayDataAiHint}
                        />
                      </Link>
                      <div className="absolute top-2 right-2 space-y-1.5 flex flex-col items-end">
                        {product.requiresCertification && (
                          <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600 text-white text-xs shadow-md">
                            <ShieldAlert className="h-3.5 w-3.5 mr-1" /> EPA Cert. Req.
                          </Badge>
                        )}
                        {product.availability === 'Pre-Order' && (
                          <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs shadow-md">Pre-Order</Badge>
                        )}
                        {product.availability === 'Out of Stock' && (
                          <Badge variant="secondary" className="text-xs shadow-md">Out of Stock</Badge>
                        )}
                        {product.availability === 'In Stock' && (
                          <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white text-xs shadow-md">
                            <PackageCheck className="h-3.5 w-3.5 mr-1"/> In Stock
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow space-y-2">
                      <Link
                        href={`/products?category=${encodeURIComponent(product.category.toLowerCase().replace(/\s+/g, '-'))}`}
                        className="text-xs text-accent font-semibold tracking-wide uppercase hover:underline flex items-center gap-1"
                      >
                        <Tag className="h-3 w-3"/>{product.category}
                      </Link>
                      <CardTitle className="font-headline text-lg mt-0.5 mb-1.5 line-clamp-2 leading-tight">
                        <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">{displayTitle}</Link>
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-3 text-muted-foreground">{displayDescription}</CardDescription>
                    </CardContent>
                    <CardFooter className="p-4 pt-2 mt-auto flex flex-col items-stretch gap-2">
                      {product.price !== null && (
                        <p className="text-2xl font-bold text-primary text-center mb-2">${product.price?.toFixed(2)}</p>
                      )}
                      <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium py-2.5">
                        <Link href={`/products/${product.slug}`}><Info className="h-4 w-4 mr-1.5"/>View Details</Link>
                      </Button>
                      {product.price !== null && product.isPurchasable && product.availability !== 'Out of Stock' && (
                        <Button
                          variant="outline"
                          className="w-full text-sm font-medium py-2.5"
                          onClick={() => handleAddToCartList(product)}
                          disabled={isCurrentlyAdding || isCurrentlyAdded}
                        >
                          {isCurrentlyAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          {isCurrentlyAdding ? 'Adding...' : isCurrentlyAdded ? <><Check className="h-4 w-4 mr-2" /> Added!</> : <><ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart</>}
                        </Button>
                      )}
                      {(!product.isPurchasable || product.availability === 'Out of Stock') && (
                        <Button variant="outline" className="w-full text-sm font-medium py-2.5" asChild={!product.isPurchasable} disabled={product.availability === 'Out of Stock'}>
                          {product.availability === 'Out of Stock' ? 
                            <span>Currently Unavailable</span> : 
                            <Link href={`/contact?subject=Quote for ${encodeURIComponent(product.name)}&sku=${product.sku}`}>Request Quote</Link>
                          }
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
             <div className="text-center py-16 col-span-full min-w-0 bg-card rounded-lg shadow-md">
              <Search className="h-20 w-20 text-muted-foreground/50 mx-auto mb-6" />
              <h3 className="font-headline text-2xl font-semibold mb-3">No Products Match Your Criteria</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn't find any products matching your current search and filter selections.
                Try adjusting your filters or broadening your search terms.
              </p>
              <Button variant="outline" onClick={clearFilters} className="text-base">
                <X className="mr-2 h-4 w-4"/> Clear All Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductPageClientWrapper({ initialProducts }: ProductPageClientProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <ProductDisplayPageContent initialProducts={initialProducts} />
    </SidebarProvider>
  );
}
