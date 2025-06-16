
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { Chatbot } from '@/components/chatbot/Chatbot';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext'; // Import CartProvider

export const metadata: Metadata = {
  title: {
    default: 'Aether Industries - Freon™ Refrigerants & HVAC Accessories',
    template: '%s | Aether Industries',
  },
  description: 'Your premier supplier for genuine Freon™ brand refrigerants and high-quality HVAC/R accessories. Nationwide distribution, EPA compliance resources, and expert support for professionals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-background text-foreground flex flex-col min-h-screen">
        <AuthProvider>
          <CartProvider> {/* Wrap with CartProvider */}
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
            <Chatbot />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
