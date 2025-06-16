
// src/app/page.tsx
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShieldCheck, Award, Thermometer, Settings, Truck, Cpu, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getProducts, type Product } from '@/lib/firebaseServices';

export const metadata: Metadata = {
  title: 'Aether Industries - Your Premier Freon™ Refrigerant Supplier',
  description: 'Aether Industries: Specializing in genuine Freon™ refrigerants and essential HVAC/R accessories. Quality products, expert support for EPA compliance, and reliable nationwide distribution for professionals.',
};

const testimonials = [
  { id: '1', name: 'David R., Certified HVAC Technician', company: 'Precision Climate Solutions', quote: 'Aether Industries is my trusted source for genuine Freon™ refrigerants. Their R-410A is always top quality, and their EPA compliance resources are a huge help.' },
  { id: '2', name: 'Maria S., Commercial Refrigeration Specialist', company: 'ColdChain Experts Inc.', quote: 'The reliability of Freon™ MO99 from Aether for R-22 retrofits has been a game-changer. Fast shipping and knowledgeable support make them my preferred supplier.' },
];

const blogPosts = [
  { id: '1', title: 'Choosing the Right Freon™ Refrigerant', excerpt: 'A guide to understanding different Freon™ refrigerants (R-410A, R-134a, R-32, etc.), their applications, and how to select the best option for efficiency and compliance.', slug: 'choosing-freon-refrigerant' },
  { id: '2', title: 'EPA 608 Certification: What Technicians Need to Know', excerpt: 'A comprehensive overview of EPA Section 608 certification requirements, types, and why it\'s crucial for handling refrigerants safely and legally.', slug: 'epa-608-certification-guide' },
];

const whyChooseUsItems = [
  { icon: Award, title: 'Genuine Freon™ Products', description: 'Authorized supplier of authentic Freon™ brand refrigerants, ensuring optimal system performance and reliability.' },
  { icon: Truck, title: 'Reliable Supply & Hazmat Logistics', description: 'Efficient nationwide distribution with expertise in Hazmat shipping for timely and compliant refrigerant delivery.' },
  { icon: Thermometer, title: 'Comprehensive Refrigerant Range', description: 'Extensive stock of Freon™ refrigerants (HFCs, HFOs including R-410A, R-134a, R-32, MO99) for diverse HVAC/R needs.' },
  { icon: Settings, title: 'Essential HVAC/R Accessories', description: 'Curated selection of quality tools, gauges, recovery units, and supplies for professional refrigerant management.' },
  { icon: Cpu, title: 'Expert Refrigerant Guidance', description: 'Access to knowledgeable professionals for Freon™ application support, technical data, and troubleshooting assistance.' },
  { icon: ShieldCheck, title: 'EPA Compliance Support', description: 'Resources and guidance to help you navigate Section 608 certification, refrigerant handling regulations, and reporting.' },
];

export default async function HomePage() {
  let featuredProducts: Product[] = [];
  let fetchError = false;

  try {
    const allProducts = await getProducts(); // Fetch all products
    featuredProducts = allProducts.slice(0, 3); // Then take the first 3
  } catch (error) {
    console.error("Failed to fetch featured products for homepage:", error);
    fetchError = true;
  }

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/80 to-background text-primary-foreground py-20 md:py-32 rounded-lg shadow-xl overflow-hidden border border-primary/20">
        <div 
          className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Cg%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2327B3A2%22%20fill-opacity%3D%220.2%22%3E%3Cpath%20opacity%3D%22.5%22%20d%3D%22M96%2095%20h4v1H95zM4%205%20h-1v1h1z%22%2F%3E%3Cpath%20d%3D%22M9%2025%20V0h1v25zM10%200v25h1V0zM0%209v1h25V9zM0%2010v1h25v-1zM25%209v1h-1V9zM25%2010v1h-1v-1zM9%200v1H0V0zM10%200v1H0V0z%22%2F%3E%3Cpath%20d%3D%22M24.5%209.5%20V0h1v9.5zM25.5%200v9.5h1V0zM0%2024.5v1h9.5v-1zM0%2025.5v1h9.5v-1zM9.5%2024.5v1h-1v-1zM9.5%2025.5v1h-1v-1zM24.5%200v1H15V0zM25.5%200v1H15V0z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]"
          style={{ backgroundSize: '20px 20px' }}
        ></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-headline text-4xl md:text-6xl font-bold mb-6 text-foreground dark:text-primary-foreground">
            Your Premier Source for Freon™ Refrigerants & HVAC/R Solutions
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 dark:text-primary-foreground/80 mb-10 max-w-3xl mx-auto">
            Aether Industries: Delivering genuine Freon™ brand refrigerants and essential HVAC/R accessories. Supporting professionals with quality, compliance, and expert technical guidance.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/products?category=refrigerants">Shop Freon™ Refrigerants</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-primary/70 text-primary hover:bg-primary/10 dark:text-primary-foreground dark:border-primary-foreground/50 dark:hover:bg-primary-foreground/10">
              <Link href="/contact?subject=Bulk Freon Refrigerant Quote">Request a Bulk Quote</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center mb-12">Popular Freon™ Refrigerants & Accessories</h2>
        {fetchError ? (
          <div className="text-center p-8 bg-card rounded-lg shadow-md">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-xl text-destructive font-semibold">Could Not Load Products</p>
            <p className="text-muted-foreground">We encountered an issue fetching our featured products. Please try again later or browse our full catalog.</p>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 group h-full">
                <CardHeader className="p-0 relative">
                  <Image 
                      src={product.primaryImageUrl || product.images?.[0]?.url || 'https://placehold.co/600x400.png'} 
                      alt={product.name} 
                      width={600} 
                      height={400} 
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" 
                      data-ai-hint={product.images?.[0]?.dataAiHint || 'product image'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </CardHeader>
                <CardContent className="pt-6 flex-grow">
                  <CardTitle className="font-headline text-xl mb-2">{product.name}</CardTitle>
                  <CardDescription>{product.shortDescription}</CardDescription>
                </CardContent>
                <CardFooter className="p-6 pt-0 mt-auto">
                  <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href={`/products/${product.slug}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
            <div className="text-center p-8 bg-card rounded-lg shadow-md">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-xl text-muted-foreground">No featured products available at the moment.</p>
                <p className="text-muted-foreground">Please check back later or browse our full catalog.</p>
                <Button asChild variant="outline" className="mt-6">
                    <Link href="/products">Browse All Products</Link>
                </Button>
            </div>
        )}
         {(!fetchError && featuredProducts.length > 0) && (
            <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
                <Link href="/products">Explore All Products</Link>
            </Button>
            </div>
         )}
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-card p-8 md:p-12 rounded-lg shadow-lg">
        <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center mb-12">The Aether Industries Advantage for HVAC/R Professionals</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {whyChooseUsItems.map((item) => (
            <div key={item.title} className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-accent text-accent-foreground rounded-full p-3 mt-1">
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-headline text-xl font-semibold mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section>
        <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center mb-12">Trusted by HVAC/R Professionals</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-secondary/30 dark:bg-secondary/10">
              <CardContent className="pt-6">
                <blockquote className="text-lg italic text-foreground/90 mb-4">
                  "{testimonial.quote}"
                </blockquote>
                <p className="font-semibold text-primary">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.company}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Latest Blog Posts/News Section */}
      <section>
        <h2 className="font-headline text-3xl md:text-4xl font-semibold text-center mb-12">Refrigerant Insights & HVAC/R News</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <CardTitle className="font-headline text-xl mb-2">{post.title}</CardTitle>
                <CardDescription className="mb-4 text-sm">{post.excerpt}</CardDescription>
                <Button variant="link" asChild className="p-0 text-accent hover:text-accent/80">
                  <Link href={`/blog/${post.slug}`}>Read More &rarr;</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild variant="outline">
            <Link href="/blog">Explore All Articles</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

    