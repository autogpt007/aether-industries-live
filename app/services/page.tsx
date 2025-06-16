
import Image from 'next/image';
import { CheckCircle, Package, Users, BookOpen, FileText, MessageSquare, Truck, Cpu } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Refrigerant Services & HVAC/R Support | Aether Industries',
  description: 'Aether Industries offers specialized services including technical support for Freon™ refrigerants, EPA compliance guidance, bulk ordering, Hazmat logistics, and refrigerant management resources for HVAC/R professionals.',
};

const services = [
  {
    icon: Cpu, // Changed from Users
    title: 'Expert Technical Support for Freon™ Refrigerants',
    description: 'Our knowledgeable team provides in-depth technical assistance for Freon™ refrigerants. We help you with product selection, PT chart interpretation, application queries, system compatibility, and troubleshooting to ensure optimal performance and safety.',
    image: 'https://placehold.co/700x500.png',
    dataAiHint: 'hvac technician support callcenter',
    points: [
      'Guidance on Freon™ product properties (GWP, ODP, glide)',
      'Assistance with refrigerant retrofitting options (e.g., R-22 alternatives)',
      'Lubricant compatibility information (POE, Mineral Oil, PVE)',
    ]
  },
  {
    icon: FileText,
    title: 'EPA Compliance & Certification Guidance',
    description: 'Stay current with evolving EPA regulations. We offer resources and guidance on Section 608 certification, compliant refrigerant handling, record-keeping, leak repair requirements, and understanding phase-down schedules for HFCs.',
    image: 'https://placehold.co/700x500.png',
    dataAiHint: 'epa regulations document compliance',
    points: [
      'Information on Section 608 technician certification types',
      'Best practices for refrigerant recovery, recycling, and reclaim',
      'Understanding SNAP (Significant New Alternatives Policy) program',
    ]
  },
  {
    icon: Truck, // Changed from Package
    title: 'Bulk Ordering & Hazmat Logistics for Refrigerants',
    description: 'Efficient and reliable logistics for bulk Freon™ refrigerant orders. We ensure safe, DOT-compliant packaging, proper labeling, and timely delivery of palletized or cylinder orders to your job site or facility, navigating Hazmat shipping complexities.',
    image: 'https://placehold.co/700x500.png',
    dataAiHint: 'refrigerant pallet shipping truck loading',
    points: [
      'Competitive pricing for bulk refrigerant purchases',
      'Coordination of freight and LTL shipments',
      'Cylinder exchange program information (if applicable)',
    ]
  },
  {
    icon: BookOpen,
    title: 'Refrigerant Management & Knowledge Base',
    description: 'Access our comprehensive library of resources on Freon™ refrigerant properties, Safety Data Sheets (SDS), technical data sheets, phase-out schedules, and best practices for environmentally responsible refrigerant management and system efficiency.',
    image: 'https://placehold.co/700x500.png',
    dataAiHint: 'digital library hvac resources online',
    points: [
      'Downloadable SDS and technical specification sheets',
      'Guides on new lower-GWP refrigerant alternatives',
      'Tools for calculating refrigerant charge and system capacity',
    ]
  },
];

export default function ServicesPage() {
  return (
    <div className="space-y-16 py-8">
      <section className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold mb-6">Refrigerant Services & HVAC/R Support</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Aether Industries is more than just a Freon™ refrigerant supplier. We offer a suite of specialized services designed to support HVAC/R professionals, ensuring efficiency, compliance, and technical excellence.
        </p>
      </section>

      <div className="grid gap-12">
        {services.map((service, index) => (
          <section key={service.title} className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? 'md:grid-flow-row-dense md:[&>*:last-child]:col-start-1' : ''}`}>
            <div className={`${index % 2 !== 0 ? 'md:col-start-2' : ''}`}>
              <Image
                src={service.image}
                alt={service.title}
                width={700}
                height={500}
                className="rounded-lg shadow-xl object-cover aspect-[7/5]"
                data-ai-hint={service.dataAiHint}
              />
            </div>
            <div className={`space-y-4 ${index % 2 !== 0 ? 'md:col-start-1 md:row-start-1' : ''}`}>
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex-shrink-0 bg-accent text-accent-foreground rounded-full p-3">
                  <service.icon className="h-6 w-6" />
                </div>
                <h2 className="font-headline text-3xl font-semibold">{service.title}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {service.description}
              </p>
              <ul className="space-y-2 text-muted-foreground">
                {service.points.map(point => (
                     <li key={point} className="flex items-center"><CheckCircle className="h-5 w-5 text-accent mr-2 flex-shrink-0" /> {point}</li>
                ))}
              </ul>
               <Button asChild size="lg" className="mt-4">
                 <Link href={`/contact?subject=Inquiry about ${service.title.replace(/\s/g, '%20')}`}>
                   <MessageSquare className="mr-2 h-5 w-5"/> Inquire About This Service
                 </Link>
               </Button>
            </div>
          </section>
        ))}
      </div>

      <section className="text-center py-12 bg-card rounded-lg shadow-lg">
        <h2 className="font-headline text-3xl font-semibold mb-6">Your Partner in Refrigerant Excellence</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Leverage Aether Industries' expertise and dedicated services to enhance your HVAC/R operations. Contact us to learn how we can support your business with genuine Freon™ products and unparalleled support.
        </p>
        <Button size="xl" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/contact">Contact Our Refrigerant Experts</Link>
        </Button>
      </section>
    </div>
  );
}
