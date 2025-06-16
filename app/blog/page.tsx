
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, UserCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refrigerant Insights & HVAC News Blog | Aether Industries',
  description: 'Stay updated with the latest news, guides, and articles on Freon™ refrigerants, HVAC technology, EPA regulations, and industry best practices from Aether Industries.',
};

// Placeholder blog posts data - focused on refrigerants
const blogPosts = [
  {
    id: '1',
    slug: 'choosing-freon-refrigerant',
    title: 'Choosing the Right Freon™ Refrigerant for Your HVAC System',
    excerpt: 'A guide to understanding different Freon™ refrigerants (R-410A, R-134a, R-32, etc.), their applications, and how to select the best option for efficiency and compliance.',
    imageUrl: 'https://placehold.co/800x450.png',
    dataAiHint: 'hvac system schematics',
    author: 'Dr. Evelyn Reed, Refrigeration Specialist',
    date: '2024-07-20',
    category: 'Refrigerant Guides',
  },
  {
    id: '2',
    slug: 'epa-608-certification-guide',
    title: 'EPA 608 Certification: What Technicians Need to Know',
    excerpt: 'A comprehensive overview of EPA Section 608 certification requirements, types, and why it\'s crucial for handling refrigerants safely and legally.',
    imageUrl: 'https://placehold.co/800x450.png',
    dataAiHint: 'epa certificate document',
    author: 'Marcus Chen, Compliance Manager',
    date: '2024-07-05',
    category: 'Regulations & Compliance',
  },
  {
    id: '3',
    slug: 'safe-refrigerant-handling-practices',
    title: 'Top 5 Safety Practices for Handling Refrigerants',
    excerpt: 'Essential safety tips for HVAC/R technicians when working with refrigerants to prevent accidents and ensure environmental protection.',
    imageUrl: 'https://placehold.co/800x450.png',
    dataAiHint: 'technician safety gear',
    author: 'Aisha Khan, Safety Officer',
    date: '2024-06-15',
    category: 'Safety & Best Practices',
  },
];

export default function BlogPage() {
  return (
    <div className="space-y-12 py-8">
      <section className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">Aether Industries Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your source for expert insights on Freon™ refrigerants, HVAC/R technology, EPA compliance, and industry news.
        </p>
      </section>

      {/* Blog Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Card key={post.id} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="p-0">
              <Link href={`/blog/${post.slug}`}>
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={800}
                  height={450}
                  className="w-full h-56 object-cover"
                  data-ai-hint={post.dataAiHint}
                />
              </Link>
            </CardHeader>
            <CardContent className="pt-6 flex-grow">
              <span className="text-xs text-accent font-semibold tracking-wide uppercase mb-1 block">{post.category}</span>
              <CardTitle className="font-headline text-xl mb-2 leading-tight">
                <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription className="text-sm mb-3">{post.excerpt}</CardDescription>
              <div className="text-xs text-muted-foreground flex items-center space-x-4">
                <div className="flex items-center">
                  <UserCircle className="h-4 w-4 mr-1.5" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-1.5" />
                  <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/blog/${post.slug}`}>Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* TODO: Add Pagination if many posts */}
    </div>
  );
}
