import type { Metadata } from 'next';
import './globals.css';
import { Provider } from '@/components/Providers';


export const metadata: Metadata = {
  title: 'Site Name',
  description: 'Welcome to our site',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
