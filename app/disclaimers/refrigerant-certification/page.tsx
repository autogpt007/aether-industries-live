
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refrigerant Purchase & EPA Section 608 Certification | Aether Industries',
  description: 'Essential information on EPA Section 608 certification requirements for purchasing and handling Freon™ refrigerants (HFCs, HCFCs) and other regulated products from Aether Industries.',
};

export default function RefrigerantCertificationPage() {
  return (
    <div className="prose prose-lg max-w-4xl mx-auto py-12 dark:prose-invert prose-headings:font-headline">
      <h1>Refrigerant Purchase Disclaimer & EPA Section 608 Certification Requirements</h1>
      <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>

      <p>
        Aether Industries is committed to responsible refrigerant sales and full compliance with all U.S. Environmental Protection Agency (EPA) regulations, particularly Section 608 of the Clean Air Act, as well as applicable state and local laws. This page outlines the requirements for purchasing certain refrigerants, especially Freon™ brand HFC and HCFC products.
      </p>

      <h2>Understanding EPA Section 608 Certification</h2>
      <p>
        The EPA requires technicians who maintain, service, repair, or dispose of equipment that could release ozone-depleting refrigerants (like HCFCs such as R-22) or their non-exempt substitutes (like HFCs such as R-410A, R-134a, R-32) into the atmosphere to be certified. This is commonly known as EPA 608 certification.
      </p>
      <p>
        The sale of these regulated refrigerants is restricted. Generally, they can only be sold to:
      </p>
      <ul>
        <li>Technicians who hold a valid EPA Section 608 certification (Type I, II, III, or Universal).</li>
        <li>Employers of certified technicians, provided they furnish proof that at least one employee is appropriately certified.</li>
        <li>Wholesalers who sell to certified technicians or EPA-certified reclaimers.</li>
        <li>Apparatus manufacturers (e.g., appliance or HVAC system manufacturers) where the refrigerant is used in the manufacturing, testing, or servicing of new equipment.</li>
        <li>EPA-approved refrigerant reclaimers.</li>
      </ul>

      <h3>Which Common Freon™ Refrigerants Require Certification for Purchase?</h3>
      <p>
        This includes, but is not limited to, most HFC and HCFC refrigerants:
      </p>
      <ul>
        <li><strong>Freon™ R-410A:</strong> Widely used in residential and light commercial air conditioning.</li>
        <li><strong>Freon™ R-134a:</strong> Common in automotive air conditioning and some medium-temperature refrigeration. (Note: Small cans under 2 lbs for DIY MVAC may have different rules, but Aether Industries primarily serves professionals.)</li>
        <li><strong>Freon™ R-32:</strong> A lower GWP HFC gaining popularity in new AC equipment.</li>
        <li><strong>Freon™ MO99 (R-438A):</strong> An HFC blend used as an R-22 retrofit option.</li>
        <li><strong>Freon™ R-404A, R-407C, R-507:</strong> HFCs common in commercial refrigeration.</li>
        <li><strong>Freon™ 22 (R-22):</strong> An HCFC. Sales of virgin R-22 are highly restricted due to phase-out; only reclaimed R-22 may be sold to certified technicians for servicing existing equipment.</li>
      </ul>
      <p>
        Newer HFO refrigerants and HFO blends may also have specific handling and sales requirements. Always check product details.
      </p>

      <h2>Aether Industries' Policy for Regulated Refrigerants</h2>
      <p>
        To purchase regulated refrigerants (including most Freon™ brand products listed above) from Aether Industries, you will generally be required to:
      </p>
      <ol>
        <li><strong>Provide Proof of Certification:</strong> This may involve submitting a copy of your valid EPA 608 certification card (or your technicians' cards if purchasing as an employer) during account setup or prior to order fulfillment.</li>
        <li><strong>Complete a Sales Disclaimer/Attestation Form:</strong> You may need to sign a statement affirming your certification status, your intent for resale only to certified individuals, or that the refrigerant will be used by certified technicians in your employ. This form also confirms you understand the proper handling and disposal requirements.</li>
        <li><strong>Account Verification:</strong> For business accounts, we may require verification of your company's status, tax ID, and its compliance with EPA regulations regarding certified personnel.</li>
      </ol>
      <p>
        These verification steps may occur during account setup, at checkout, or post-order before shipment can be completed. Aether Industries reserves the right to refuse sale if certification requirements cannot be satisfactorily met, or if there is suspicion of non-compliant use.
      </p>

      <h2>Why is EPA Certification Critical?</h2>
      <ul>
        <li><strong>Environmental Protection:</strong> Proper handling prevents the release of harmful refrigerants, protecting the ozone layer and mitigating climate change.</li>
        <li><strong>Technician Safety:</strong> Ensures that only trained and knowledgeable individuals handle high-pressure refrigerants and related systems, minimizing risks.</li>
        <li><strong>Legal Compliance:</strong> Adherence to EPA Section 608 regulations is mandatory. Violations can result in significant fines and penalties for both sellers and purchasers.</li>
        <li><strong>Equipment Integrity:</strong> Ensures correct refrigerants are used in appropriate systems, preventing damage and maintaining efficiency.</li>
      </ul>

      <h2>Obtaining EPA 608 Certification</h2>
      <p>
        If you or your technicians are not yet certified, EPA-approved certifying organizations offer training and testing for Section 608 technician certification (Type I, Type II, Type III, and Universal). Many resources are available online to find an EPA-approved program.
      </p>

      <h2>Further Information & Questions</h2>
      <p>
        For the most current and detailed information on EPA Section 608 regulations, refrigerant management, and certification, please visit the official EPA website: <Link href="https://www.epa.gov/section608" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">www.epa.gov/section608</Link>.
      </p>
      <p>
        If you have any questions about specific Freon™ product requirements, our certification verification process, or how to place an order as a certified technician or business, please do not hesitate to <Link href="/contact" className="text-accent hover:underline">contact our customer support team</Link>. We are here to help you stay compliant and operate effectively.
      </p>
    </div>
  );
}
