
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refrigerant FAQs | Aether Industries',
  description: 'Find answers to common questions about Freon™ refrigerants, EPA certification, ordering, shipping, and Aether Industries policies.',
};

const faqItems = [
  {
    question: 'What types of Freon™ refrigerants do you sell?',
    answer: 'We stock a wide range of genuine Freon™ refrigerants including R-410A, R-134a, R-22 alternatives like MO99 (R-438A), R-32, and more. Check our <a href="/products" class="text-accent hover:underline">Products Page</a> for the full catalog.',
  },
  {
    question: 'Do I need an EPA certification to purchase refrigerants?',
    answer: 'Yes, for most HFC and HCFC refrigerants (like R-410A, R-134a in larger quantities, and R-22 alternatives), EPA Section 608 certification is required for purchase by technicians. We may require proof of certification. Please see our <a href="/disclaimers/refrigerant-certification" class="text-accent hover:underline">Refrigerant Certification Information</a> page for full details.',
  },
  {
    question: 'How do I place an order for refrigerants?',
    answer: 'You can place orders directly through our website for standard cylinder sizes. For bulk orders or special requests, please use the "Request a Quote" feature on the product page or contact our sales team via the <a href="/contact" class="text-accent hover:underline">Contact Us</a> page.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept major credit cards (Visa, MasterCard, American Express), and bank transfers for approved commercial accounts. Payment options will be presented at checkout.',
  },
  {
    question: 'Where can I find Safety Data Sheets (SDS) for Freon™ products?',
    answer: 'SDS documents are available for all our refrigerant products. They are typically linked on the individual product detail pages under the "Safety & SDS" tab. If you cannot find an SDS, please <a href="/contact" class="text-accent hover:underline">contact our support team</a>.',
  },
  {
    question: 'What is your shipping policy for refrigerants?',
    answer: 'Refrigerants are often classified as hazardous materials and require special shipping procedures. We adhere to all DOT regulations. Shipping costs and times may vary. Please review our full <a href="/shipping-policy" class="text-accent hover:underline">Shipping Policy</a> for detailed information, including Hazmat shipping.',
  },
  {
    question: 'What is your return policy for refrigerants and accessories?',
    answer: 'Due to the nature of these products, returns for refrigerants are often restricted, especially if the container seal is broken. Accessories may have a standard return window if unused and in original packaging. Please see our <a href="/returns-policy" class="text-accent hover:underline">Returns Policy</a> for complete details.',
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order ships, you will receive an email confirmation with tracking information. If you have an account with us, you can also track your order status by logging in.',
  },
  {
    question: 'Do you offer technical support for Freon™ refrigerants?',
    answer: 'Yes, our team includes experienced professionals who can provide technical support regarding Freon™ refrigerant properties, application guidance, and compatibility. Please <a href="/contact" class="text-accent hover:underline">contact us</a> with your specific questions.',
  },
  {
    question: 'Are all your Freon™ products genuine?',
    answer: 'Absolutely. Aether Industries is committed to supplying only authentic Freon™ brand refrigerants and high-quality, reliable accessories. We source directly from authorized channels to ensure product integrity.',
  }
];

export default function FaqPage() {
  return (
    <div className="py-8">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">Refrigerant FAQs</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Answers to common questions about Freon™ refrigerants, accessories, and our services. If you don't find what you're looking for, please contact us.
        </p>
      </section>

      <section className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg hover:text-accent text-left">{item.question}</AccordionTrigger>
              <AccordionContent>
                <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: item.answer }} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="text-center mt-16">
        <h2 className="font-headline text-2xl font-semibold mb-4">Still Have Questions?</h2>
        <p className="text-muted-foreground mb-6">Our refrigerant experts are ready to assist you. Reach out for personalized support.</p>
        <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-accent-foreground bg-accent hover:bg-accent/90">
          Contact Our Experts
        </Link>
      </section>
    </div>
  );
}
