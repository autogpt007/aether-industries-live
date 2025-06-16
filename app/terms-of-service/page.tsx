import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Aether Industries Terms of Service.',
};

export default function TermsOfServicePage() {
  return (
    <div className="prose prose-lg max-w-4xl mx-auto py-12 dark:prose-invert prose-headings:font-headline">
      <h1>Terms of Service</h1>
      <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>

      <h2>1. Agreement to Terms</h2>
      <p>
        These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Aether Industries ("Company," “we," “us," or “our”), concerning your access to and use of the [YourWebsite.com] website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).
      </p>
      <p>
        You agree that by accessing the Site, you have read, understood, and agreed to be bound by all of these Terms of Service. If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the Site and you must discontinue use immediately.
      </p>

      <h2>2. Intellectual Property Rights</h2>
      <p>
        Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws of the United States, foreign jurisdictions, and international conventions.
      </p>

      <h2>3. User Representations</h2>
      <p>By using the Site, you represent and warrant that: </p>
      <ol>
        <li>all registration information you submit will be true, accurate, current, and complete;</li>
        <li>you will maintain the accuracy of such information and promptly update such registration information as necessary;</li>
        <li>you have the legal capacity and you agree to comply with these Terms of Service;</li>
        {/* ... more representations ... */}
      </ol>

      <h2>4. Prohibited Activities</h2>
      <p>You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
      {/* ... list of prohibited activities ... */}

      <h2>5. Term and Termination</h2>
      <p>
        These Terms of Service shall remain in full force and effect while you use the Site. WITHOUT LIMITING ANY OTHER PROVISION OF THESE TERMS OF SERVICE, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SITE (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON...
      </p>
      
      {/* ... Other sections like Governing Law, Dispute Resolution, Disclaimer, Limitation of Liability, Contact Us etc. ... */}
      <h2>6. Governing Law</h2>
      <p>These Terms of Service and your use of the Site are governed by and construed in accordance with the laws of the State of Texas applicable to agreements made and to be entirely performed within the State of Texas, without regard to its conflict of law principles.</p>

      <h2>7. Contact Us</h2>
      <p>
        In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
      </p>
      <p>
        Aether Industries<br />
        123 Industrial Way<br />
        Tech City, TX 75001<br />
        Email: <a href="mailto:legal@aetherindustries.com">legal@aetherindustries.com</a>
      </p>
    </div>
  );
}
