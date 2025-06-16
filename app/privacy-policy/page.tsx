import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Aether Industries Privacy Policy.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="prose prose-lg max-w-4xl mx-auto py-12 dark:prose-invert prose-headings:font-headline">
      <h1>Privacy Policy</h1>
      <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>

      <h2>1. Introduction</h2>
      <p>
        Welcome to Aether Industries ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website [YourWebsite.com], including any other media form, media channel, mobile website, or mobile application related or connected thereto (collectively, the "Site"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
      </p>

      <h2>2. Collection of Your Information</h2>
      <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
      <h3>Personal Data</h3>
      <p>
        Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards.
      </p>
      <h3>Derivative Data</h3>
      <p>
        Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
      </p>
      <h3>Financial Data</h3>
      <p>
        Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site. [We store only very limited, if any, financial information that we collect. Otherwise, all financial information is stored by our payment processor, [Payment Processor Name], and you are encouraged to review their privacy policy and contact them directly for responses to your questions.]
      </p>
      <h3>Data From Social Networks</h3>
      <p>
        User information from social networking sites, such as [Facebook, Google, Instagram, Twitter], including your name, your social network username, location, gender, birth date, email address, profile picture, and public data for contacts, if you connect your account to such social networks.
      </p>
       <h3>Tracking Technologies (e.g., Google Analytics, Facebook Pixel)</h3>
      <p>
        We use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site.
      </p>
      <p>Our Privacy Policy will explicitly state how user data is collected and used for advertising (e.g., Facebook Pixel for retargeting, Google Analytics). It will provide mechanisms for users to understand and control their data and tracking preferences.</p>


      <h2>3. Use of Your Information</h2>
      <p>
        Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
      </p>
      <ul>
        <li>Create and manage your account.</li>
        <li>Email you regarding your account or order.</li>
        <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
        <li>Improve the efficiency and operation of the Site.</li>
        <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
        <li>Notify you of updates to the Site.</li>
        <li>Offer new products, services, and/or recommendations to you.</li>
        <li>Perform other business activities as needed.</li>
        <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
        <li>Process payments and refunds.</li>
        <li>Request feedback and contact you about your use of the Site.</li>
        <li>Resolve disputes and troubleshoot problems.</li>
        <li>Respond to product and customer service requests.</li>
        <li>Send you a newsletter.</li>
        <li>Comply with Google Merchant Center and Facebook Ad policies.</li>
      </ul>
      <p><strong>We will NOT sell user contact information.</strong></p>

      <h2>4. Disclosure of Your Information</h2>
      <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
      <h3>By Law or to Protect Rights</h3>
      <p>
        If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
      </p>
      <h3>Third-Party Service Providers</h3>
      <p>
        We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
      </p>
      {/* ... Other sections like Security, Policy for Children, Contact Us etc. ... */}

      <h2>5. Security of Your Information</h2>
        <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

      <h2>6. Contact Us</h2>
      <p>
        If you have questions or comments about this Privacy Policy, please contact us at:
      </p>
      <p>
        Aether Industries<br />
        123 Industrial Way<br />
        Tech City, TX 75001<br />
        Email: <a href="mailto:privacy@aetherindustries.com">privacy@aetherindustries.com</a>
      </p>
    </div>
  );
}
