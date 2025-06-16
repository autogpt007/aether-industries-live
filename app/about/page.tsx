
import Image from 'next/image';
import { Users, Target, Globe, CheckSquare, Award, ShieldCheck, Thermometer } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Aether Industries - Your Freon™ Refrigerant & HVAC/R Supplier',
  description: 'Learn about Aether Industries, your trusted supplier of genuine Freon™ refrigerants and essential HVAC/R accessories. Our mission, vision, and commitment to quality and supporting the HVAC/R industry.',
};

export default function AboutPage() {
  return (
    <div className="space-y-12 py-8">
      <section className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold mb-6">About Aether Industries</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Your dedicated partner for genuine Freon™ refrigerants and essential HVAC/R accessories, committed to supporting the cooling industry with quality products, regulatory expertise, and dependable service.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <Image
            src="https://placehold.co/800x600.png"
            alt="Aether Industries Warehouse with Freon™ Refrigerant Cylinders and HVAC Accessories"
            width={800}
            height={600}
            className="rounded-lg shadow-xl object-cover"
            data-ai-hint="refrigerant warehouse cylinders accessories"
          />
        </div>
        <div className="space-y-4">
          <h2 className="font-headline text-3xl font-semibold">Our Story: Specialists in Refrigerant Supply</h2>
          <p className="text-muted-foreground leading-relaxed">
            Aether Industries was founded with a clear vision: to be the premier supplier of Freon™ brand refrigerants and critical HVAC/R accessories for professionals. We recognized the industry's need for a reliable source of genuine, high-quality products, backed by in-depth technical knowledge and a commitment to regulatory compliance.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our focus is to empower HVAC/R technicians, contractors, and businesses by providing the essential supplies they need to install, service, and maintain cooling systems efficiently, safely, and in accordance with EPA and industry standards. We build lasting partnerships through dependable service, a comprehensive understanding of the refrigerant market, and support for evolving technologies.
          </p>
        </div>
      </section>

      <section className="space-y-8 bg-card p-8 md:p-12 rounded-lg shadow-lg">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 text-accent p-3 bg-accent/10 rounded-full">
              <Target className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-headline text-2xl font-semibold mb-2">Our Mission</h3>
              <p className="text-muted-foreground">
                To be the leading supplier of Freon™ refrigerants and HVAC/R accessories, equipping professionals with superior products, exceptional service, and expert resources for compliant, efficient, and sustainable cooling solutions.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 text-accent p-3 bg-accent/10 rounded-full">
              <Globe className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-headline text-2xl font-semibold mb-2">Our Vision</h3>
              <p className="text-muted-foreground">
                To be the most trusted and innovative partner in the refrigerant supply chain, recognized for our unwavering commitment to Freon™ quality, environmental stewardship, and advancing the capabilities of the HVAC/R industry.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="font-headline text-3xl font-semibold text-center mb-10">Our Core Values</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Award, title: "Freon™ Quality First", description: "Supplying only genuine Freon™ brand refrigerants and high-grade, compatible accessories." },
            { icon: ShieldCheck, title: "Compliance & Safety", description: "Prioritizing adherence to EPA regulations (Sec 608), Hazmat shipping, and safe handling practices." },
            { icon: Users, title: "Customer Success", description: "Dedicated to supporting the needs of HVAC/R technicians, contractors, and businesses with reliable solutions." },
            { icon: Thermometer, title: "Refrigerant Expertise", description: "Providing knowledgeable support and resources for refrigerant applications and management." },
          ].map(value => (
             <div key={value.title} className="p-6 bg-card rounded-lg shadow text-center hover:shadow-xl transition-shadow">
              <value.icon className="h-10 w-10 text-accent mx-auto mb-4" />
              <h3 className="font-headline text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center space-y-4">
        <h2 className="font-headline text-3xl font-semibold">Partner with Aether Industries for Your Refrigerant Needs</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our team consists of industry veterans passionate about refrigerants, logistics, and ensuring our customers succeed. We are dedicated to providing reliable solutions and expert advice for all your Freon™ refrigerant and HVAC/R accessory requirements.
        </p>
         <Image
            src="https://placehold.co/1200x400.png"
            alt="Aether Industries distribution network showing trucks and refrigerant cylinders"
            width={1200}
            height={400}
            className="rounded-lg shadow-lg object-cover mx-auto mt-6"
            data-ai-hint="refrigerant distribution network logistics"
          />
        <p className="text-sm text-muted-foreground">Strategically located fulfillment centers ensure prompt and compliant delivery of refrigerants across the US and Canada.</p>
      </section>
    </div>
  );
}
