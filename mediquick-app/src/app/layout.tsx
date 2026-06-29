import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'MediQuick — Premium Online Medicine Delivery App',
  description: 'Order authentic medicines, vitamins, baby care and medical devices online with 2-hour doorstep delivery. Upload your prescription and get certified pharmacist verification instantly.',
  keywords: 'medicine delivery, online pharmacy, pharmacy delivery, prescriptions online, medical devices, wellness supplements',
  openGraph: {
    title: 'MediQuick — Online Medicine Delivery',
    description: 'Get verified medicines delivered under 2 hours. Secure payments and genuine pharmacist approval.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="layout-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main className="layout-main" style={{ flex: '1 0 auto' }}>
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
