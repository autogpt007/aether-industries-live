import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Disclaimers',
  description: 'Important disclaimers regarding products sold by Aether Industries.',
};

export default function DisclaimersPage() {
  return (
    <div className="prose prose-lg max-w-4xl mx-auto py-12 dark:prose-invert prose-headings:font-headline">
      <h1>Product Disclaimers</h1>
      <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>

      <p>The information provided by Aether Industries (“we,” “us,” or “our”) on [YourWebsite.com] (the “Site”) and our mobile application is for general informational purposes only. All information on the Site and our mobile application is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site or our mobile application.</p>

      <h2>Professional Disclaimer</h2>
      <p>The Site cannot and does not contain chemical or industrial advice. The chemical/industrial information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of chemical or industrial advice. THE USE OR RELIANCE OF ANY INFORMATION CONTAINED ON THIS SITE OR OUR MOBILE APPLICATION IS SOLELY AT YOUR OWN RISK.</p>
      
      <h2>Product Use Disclaimer</h2>
      <p>Products sold by Aether Industries are intended for use by qualified professionals or individuals with appropriate training and understanding of their handling, application, and safety precautions. It is the responsibility of the purchaser and user to ensure that products are used safely, legally, and in accordance with all applicable regulations, manufacturer guidelines, and best practices for their intended application.</p>
      <p>Misuse of products can be dangerous and may result in injury, property damage, or environmental harm. Always consult Safety Data Sheets (SDS) and technical documentation provided with products before use.</p>

      <h2>Regulated Products Disclaimer (e.g., Refrigerants)</h2>
      <p>Certain products, such as specific refrigerants (e.g., R-32, R-410A), may be subject to federal, state, or local regulations governing their sale, purchase, and use. This may include requirements for EPA certification (such as Section 608 certification for handling refrigerants) or other licenses.</p>
      <p>By purchasing regulated products from Aether Industries, you affirm that you meet all applicable legal and certification requirements for possessing and using these products. Aether Industries reserves the right to request proof of certification or licensing before completing a sale of regulated items. Specific disclaimer forms or attestations may be required for certain products.</p>
      <p>For more information on refrigerant certification, please see our dedicated <Link href="/disclaimers/refrigerant-certification">Refrigerant Certification Information page</Link>.</p>

      <h2>External Links Disclaimer</h2>
      <p>The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED THROUGH THE SITE OR ANY WEBSITE OR FEATURE LINKED IN ANY BANNER OR OTHER ADVERTISING.</p>
      
      <h2>Contact Us</h2>
      <p>If you have any questions concerning our disclaimers, please contact us at:</p>
      <p>
        Email: <a href="mailto:legal@aetherindustries.com">legal@aetherindustries.com</a>
      </p>
    </div>
  );
}
