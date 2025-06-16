
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, UserCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

// Placeholder blog post data structure - in a real app, fetch by slug
// This specific post will be for 'choosing-freon-refrigerant'
const blogPostData: { [key: string]: any } = {
  'choosing-freon-refrigerant': {
    id: '1',
    slug: 'choosing-freon-refrigerant',
    title: 'Choosing the Right Freon™ Refrigerant for Your HVAC System',
    content: `
      <p>Selecting the correct Freon™ refrigerant is crucial for the optimal performance, energy efficiency, and longevity of any HVAC system. With various options available, understanding their properties and applications is key. This guide will walk you through common Freon™ products like R-410A, R-134a, and R-32, helping you make an informed decision.</p>
      
      <h2 class="font-headline text-2xl font-semibold mt-6 mb-3">Understanding Refrigerant Types</h2>
      <p>Freon™ is a brand name for various fluorocarbon refrigerants. The most common types you'll encounter are HFCs (Hydrofluorocarbons), which replaced older CFCs and HCFCs due to their non-ozone-depleting properties. However, HFCs still have Global Warming Potentials (GWPs), leading to regulations and the development of lower-GWP alternatives.</p>
      
      <h3 class="font-headline text-xl font-semibold mt-4 mb-2">Freon™ R-410A</h3>
      <p>R-410A is a high-efficiency HFC primarily used in new residential and light commercial air conditioning systems. It operates at higher pressures than R-22 and requires POE (polyolester) oil. It has a GWP of 2088.</p>
      
      <figure class="my-6">
        <img src="https://placehold.co/1000x500.png" alt="Comparison chart of R-410A, R-134a, R-32 properties" data-ai-hint="refrigerant properties chart" class="rounded-lg shadow-md w-full object-cover" />
        <figcaption class="text-sm text-center text-muted-foreground mt-2">Fig. 1: Key properties comparison of common Freon™ refrigerants.</figcaption>
      </figure>
      
      <h3 class="font-headline text-xl font-semibold mt-4 mb-2">Freon™ R-134a</h3>
      <p>R-134a is another HFC, widely used in automotive air conditioning and medium-temperature commercial refrigeration. It has a GWP of 1430. While effective, it's also being phased down in some applications in favor of lower-GWP options like R-1234yf for automotive.</p>

      <h3 class="font-headline text-xl font-semibold mt-4 mb-2">Freon™ R-32</h3>
      <p>R-32 is an HFC refrigerant gaining popularity for its lower GWP (675) compared to R-410A and excellent thermodynamic properties. It's mildly flammable (A2L safety classification), requiring specific handling and equipment design. Many new AC units are designed for R-32.</p>
      
      <h2 class="font-headline text-2xl font-semibold mt-6 mb-3">Factors to Consider</h2>
      <ul>
        <li><strong>System Compatibility:</strong> Always use the refrigerant specified by the equipment manufacturer. Mismatching can lead to poor performance or system damage.</li>
        <li><strong>Application:</strong> Residential AC, commercial refrigeration, automotive AC, and heat pumps have different refrigerant requirements.</li>
        <li><strong>Environmental Regulations:</strong> Be aware of phase-down schedules for high-GWP refrigerants and any local restrictions.</li>
        <li><strong>Safety:</strong> Understand the safety classification (e.g., A1, A2L) and required handling procedures for the chosen refrigerant.</li>
        <li><strong>Efficiency:</strong> Consider the energy efficiency ratings and performance characteristics.</li>
      </ul>
      
      <p>Aether Industries provides genuine Freon™ refrigerants and expert advice to help you select the right product for your needs. Always consult with certified professionals and adhere to safety guidelines.</p>
    `,
    imageUrl: 'https://placehold.co/1200x600.png',
    dataAiHint: 'hvac system components',
    author: 'Dr. Evelyn Reed, Refrigeration Specialist',
    date: '2024-07-20',
    category: 'Refrigerant Guides',
    tags: ['Freon', 'R-410A', 'R-134a', 'R-32', 'HVAC', 'Refrigerant Selection'],
  },
  // Add other posts here as needed, e.g., for 'epa-608-certification-guide'
  'epa-608-certification-guide': {
    id: '2',
    slug: 'epa-608-certification-guide',
    title: 'EPA 608 Certification: What Technicians Need to Know',
    content: `
      <p>EPA Section 608 certification is a mandatory requirement for technicians who maintain, service, repair, or dispose of equipment containing regulated refrigerants. This guide breaks down the essentials of EPA 608 certification.</p>
      <h2 class="font-headline text-2xl font-semibold mt-6 mb-3">Types of Certification</h2>
      <p>There are four types of EPA 608 certification: Type I (small appliances), Type II (high-pressure systems), Type III (low-pressure systems), and Universal (all types). Choose the certification that matches your work scope.</p>
      <p>Aether Industries is committed to supporting compliant refrigerant handling. Visit our <a href="/disclaimers/refrigerant-certification">Refrigerant Certification Information</a> page for more details and links to official EPA resources.</p>
    `, // Shortened content for brevity
    imageUrl: 'https://placehold.co/1200x600.png',
    dataAiHint: 'certificate official document',
    author: 'Marcus Chen, Compliance Manager',
    date: '2024-07-05',
    category: 'Regulations & Compliance',
    tags: ['EPA', 'Certification', 'Refrigerant Handling', 'Compliance', 'Section 608'],
  },
  // Default fallback if slug doesn't match
  'default-post': {
    id: '0',
    slug: 'default-post',
    title: 'Article Not Found',
    content: '<p>The article you are looking for could not be found. Please check the URL or navigate back to our blog.</p>',
    imageUrl: 'https://placehold.co/1200x600.png',
    dataAiHint: 'empty page document',
    author: 'Aether Industries',
    date: new Date().toISOString().split('T')[0],
    category: 'General',
    tags: ['Error'],
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPostData[params.slug] || blogPostData['default-post'];
  return {
    title: `${post.title} | Aether Industries Blog`,
    description: `Read about ${post.title}. ${post.content.substring(0,150).replace(/<[^>]*>?/gm, '')}...`,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPostData[params.slug] || blogPostData['default-post'];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <article className="space-y-8">
        <header className="space-y-4">
          <Button variant="outline" size="sm" asChild className="mb-6">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
          <span className="block text-sm text-accent font-semibold tracking-wide uppercase">{post.category}</span>
          <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <UserCircle className="h-5 w-5 mr-1.5" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="h-5 w-5 mr-1.5" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </header>

        <Image
          src={post.imageUrl}
          alt={post.title}
          width={1200}
          height={600}
          className="w-full rounded-lg shadow-lg object-cover aspect-[2/1]"
          priority
          data-ai-hint={post.dataAiHint}
        />

        <div
          className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-headline prose-img:rounded-md prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer className="pt-6 border-t">
          <div className="flex flex-wrap gap-2">
            <span className="font-semibold">Tags:</span>
            {post.tags.map((tag: string) => (
              <Link key={tag} href={`/blog/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`} className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                {tag}
              </Link>
            ))}
          </div>
        </footer>
      </article>
    </div>
  );
}
