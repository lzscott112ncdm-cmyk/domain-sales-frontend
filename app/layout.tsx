
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Domain Marketplace',
  description: 'Find and purchase premium domains',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="text-2xl font-bold text-primary-600">
                Domain Marketplace
              </a>
              <div className="flex gap-4">
                <a href="/" className="text-gray-700 hover:text-primary-600">
                  Home
                </a>
                <a href="/admin" className="text-gray-700 hover:text-primary-600">
                  Admin
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="bg-gray-900 text-white mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <p>&copy; 2024 Domain Marketplace. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
