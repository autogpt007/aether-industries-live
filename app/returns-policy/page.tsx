
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refrigerant Return & Refund Policy | Aether Industries',
  description: 'Aether Industries Return & Refund Policy for Freon™ refrigerants and HVAC/R accessories.',
};

export default function ReturnsPolicyPage() {
  return (
    <div className="prose prose-lg max-w-4xl mx-auto py-12 dark:prose-invert prose-headings:font-headline">
      <h1>Return & Refund Policy for Refrigerants & Accessories</h1>
      <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>

      <p>Thank you for your purchase from Aether Industries. We strive to ensure your satisfaction. This policy outlines the conditions under which returns and refunds are processed for Freon™ refrigerants and related accessories.</p>

      <h2>RETURNS</h2>
      <h3>Refrigerants:</h3>
      <p>Due to the nature of refrigerant products and regulatory requirements, returns for refrigerant cylinders are generally <strong>NOT accepted if the factory seal on the cylinder valve or packaging has been broken or tampered with</strong>, or if the cylinder shows signs of use or contamination. </p>
      <p>Unopened and untampered refrigerant cylinders in their original, intact packaging may be eligible for return within <strong>fourteen (14) days</strong> of the purchase date, subject to inspection and approval by Aether Industries. A restocking fee may apply. Customer is responsible for all return shipping costs, which must comply with all DOT/Transport Canada regulations for hazardous materials.</p>

      <h3>Refrigerant Accessories (Tools, Gauges, Recovery Equipment, etc.):</h3>
      <p>Accessories may be returned within <strong>thirty (30) days</strong> of the purchase date if they are in new, unused condition, with all original tags, labels, and packaging intact. Used or damaged items (not due to shipping) are not eligible for return.</p>

      <h2>RETURN PROCESS</h2>
      <p>To initiate a return for any eligible item, you MUST contact our customer service team to obtain a Return Merchandise Authorization (RMA) number and specific return instructions.</p>
      <ol>
        <li>Email customer service at <a href="mailto:returns@aetherindustries.com">returns@aetherindustries.com</a> or call (800) 555-0123 to request an RMA. Please provide your order number and reason for return.</li>
        <li>If your return is approved, you will receive an RMA number and detailed instructions, including the return shipping address and any specific packaging or labeling requirements (especially for refrigerants).</li>
        <li>Securely package the item. For refrigerants, ensure packaging complies with all hazardous material shipping regulations.</li>
        <li>Clearly mark the RMA number on the outside of the package.</li>
      </ol>
      <p><strong>You are responsible for all return shipping costs and ensuring the item is returned safely and compliantly.</strong> We strongly recommend using a trackable shipping method and appropriate insurance. Aether Industries is not responsible for items lost or damaged during return shipment.</p>

      <h2>REFUNDS</h2>
      <p>Upon receipt and inspection of your returned item(s), we will notify you of the approval or rejection of your refund. </p>
      <p>If approved:</p>
      <ul>
        <li>For accessories, your refund will be processed, and a credit will automatically be applied to your original method of payment, within 7-10 business days.</li>
        <li>For eligible refrigerant returns, refunds (less any applicable restocking fees and original shipping charges) will be processed similarly.</li>
      </ul>
      <p>Please allow 1-2 billing cycles for the refund to appear on your credit card statement.</p>
      <p>Original shipping charges are non-refundable unless the return is due to an error on our part (e.g., wrong item shipped, item damaged in transit by our carrier and properly documented).</p>

      <h2>EXCEPTIONS & NON-RETURNABLE ITEMS</h2>
      <p>The following items are generally non-returnable:</p>
      <ul>
        <li>Opened or used refrigerant cylinders, or cylinders with broken/tampered seals.</li>
        <li>Custom-ordered or special-order items.</li>
        <li>Products explicitly marked as "Final Sale" or "Non-Returnable."</li>
        <li>Items damaged due to customer misuse or improper handling.</li>
        <li>Refrigerants that cannot be safely and legally shipped back by standard carriers without professional Hazmat services arranged by the customer.</li>
      </ul>
      
      <h3>Defective or Damaged Products (Due to Shipping by Our Carrier):</h3>
      <p>If you receive an item that is defective or was damaged during shipment by our carrier, please contact us within <strong>48 hours</strong> of delivery. Follow the damage reporting instructions in our Shipping Policy. We will arrange for a replacement or refund for verified defective/damaged items.</p>

      <h2>QUESTIONS</h2>
      <p>If you have any questions concerning our return policy, please contact us at:</p>
      <p>
        Phone: (800) 555-0123<br />
        Email: <a href="mailto:returns@aetherindustries.com">returns@aetherindustries.com</a>
      </p>
    </div>
  );
}
