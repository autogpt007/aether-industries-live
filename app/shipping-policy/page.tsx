
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refrigerant Shipping Policy | Aether Industries',
  description: 'Aether Industries Shipping Policy for Freon™ refrigerants and accessories, including information on Hazmat shipping.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="prose prose-lg max-w-4xl mx-auto py-12 dark:prose-invert prose-headings:font-headline">
      <h1>Shipping Policy for Refrigerants & Accessories</h1>
      <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>

      <p>Thank you for choosing Aether Industries for your Freon™ refrigerants and HVAC/R accessories. The following terms and conditions constitute our Shipping Policy.</p>

      <h2>Domestic Shipping Policy (U.S. & Canada)</h2>
      <h3>Shipment processing times</h3>
      <p>All orders are processed within 1-2 business days, subject to product availability and any required certification verification (e.g., EPA 608 for regulated refrigerants). Orders are not typically shipped or delivered on weekends or holidays.</p>
      <p>If we are experiencing a high volume of orders, or if there are delays due to carrier issues or hazardous material processing, shipments may be delayed. We will communicate any significant delays to you via email or telephone.</p>
      
      <h3>Hazardous Materials (Hazmat) Shipping</h3>
      <p><strong>Many refrigerants, including Freon™ products, are classified as hazardous materials by the Department of Transportation (DOT) and Transport Canada. Shipping these items requires strict adherence to regulations.</strong></p>
      <p>This means:</p>
      <ul>
        <li><strong>Specialized Packaging:</strong> Products will be packaged in UN-specification packaging appropriate for their hazard class.</li>
        <li><strong>Certified Carriers:</strong> We use carriers certified to transport hazardous materials. This may limit shipping options or destinations.</li>
        <li><strong>Additional Fees:</strong> Hazmat shipping often incurs additional fees from carriers due to special handling requirements. These fees, if applicable, will be calculated and shown at checkout or included in your quote.</li>
        <li><strong>Documentation:</strong> Shipments will include all necessary shipping papers, labels, and markings as required by law.</li>
        <li><strong>Restrictions:</strong> Air freight is often restricted or prohibited for many refrigerants. Most shipments will be via ground transport. Some remote locations may have service limitations.</li>
        <li><strong>Signature Required:</strong> Due to the nature of these products, a signature from an adult may be required upon delivery.</li>
      </ul>
      <p>We are committed to ensuring safe and compliant delivery of all products.</p>

      <h3>Shipping rates & delivery estimates</h3>
      <p>Shipping charges for your order will be calculated and displayed at checkout, or provided in your quote for bulk/freight orders. Delivery estimates will be provided once your order is processed and shipped.</p>
      <p>Example Shipping Options (may vary by product and location):</p>
      <ul>
        <li><strong>Standard Ground Shipping:</strong> Typically 3-7 business days (longer for Hazmat or remote areas). Cost varies.</li>
        <li><strong>Expedited Shipping (Non-Hazmat only):</strong> 2-3 business days. Cost varies. Not available for most refrigerants.</li>
        <li><strong>LTL Freight (for bulk/pallet orders):</strong> Timeline and cost quoted separately. Requires commercial address with loading dock or forklift capability for best rates.</li>
      </ul>
      <p>Delivery delays can occasionally occur due to carrier issues, weather, or other unforeseen circumstances.</p>

      <h3>Shipment to P.O. boxes or APO/FPO addresses</h3>
      <p>Due to Hazmat regulations and carrier restrictions, we generally CANNOT ship refrigerants to P.O. Boxes. Shipments to APO/FPO/DPO addresses may also be heavily restricted or unavailable for refrigerants. Please provide a physical street address for delivery. Accessories may have more flexible shipping options.</p>

      <h3>Shipment confirmation & Order tracking</h3>
      <p>You will receive a Shipment Confirmation email once your order has shipped, containing your tracking number(s). The tracking number will typically become active within 24-48 hours.</p>

      <h3>Customs, Duties and Taxes (for Canadian Shipments)</h3>
      <p>For shipments to Canada, Aether Industries will act as the Non-Resident Importer (NRI) where possible, or will clearly communicate if the customer is responsible for acting as the Importer of Record. All applicable Canadian duties, taxes (GST/HST/PST), and brokerage fees will be calculated and either included at checkout or billed separately as per the terms of sale. We strive to make cross-border shipping as seamless as possible.</p>

      <h3>Damages</h3>
      <p>Aether Industries is committed to ensuring your products arrive safely. If you receive your order damaged, please take the following steps IMMEDIATELY:</p>
      <ol>
        <li>Note any visible damage on the carrier's delivery receipt before signing (if possible).</li>
        <li>Take photos of the damaged packaging and product(s).</li>
        <li>Contact us at <a href="mailto:shipping@aetherindustries.com">shipping@aetherindustries.com</a> or call (800) 555-0123 within 48 hours of delivery to report the damage. Please provide your order number and photos.</li>
      </ol>
      <p>We will work with you and the carrier to resolve the issue, which may involve filing a claim and arranging for a replacement or refund.</p>
      
      <h2>International Shipping Policy (Outside U.S. & Canada)</h2>
      <p>At this time, Aether Industries primarily ships within the United States and Canada. For inquiries about shipping to other international destinations, please contact our sales team directly, as regulations and capabilities vary significantly.</p>

      <h2>Contact Us</h2>
      <p>If you have any questions about our Shipping Policy, please contact us:</p>
      <p>
        Phone: (800) 555-0123<br />
        Email: <a href="mailto:shipping@aetherindustries.com">shipping@aetherindustries.com</a>
      </p>
    </div>
  );
}
