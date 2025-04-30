import type { Metadata } from 'next';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { UserCog } from 'lucide-react'; // Changed from ShieldAlert to UserCog for admin access

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Bar Buddy',
  description: 'Gestion de Bar',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col relative`}>
        <main className="flex-grow">
          {children}
        </main>
        <Link href="/admin/login" passHref legacyBehavior>
           <Button
            variant="secondary" // Use secondary which is light grey
            size="icon"
            className="fixed bottom-4 right-4 rounded-full shadow-lg w-14 h-14 bg-primary text-primary-foreground hover:bg-primary/90"
            aria-label="Admin Access"
          >
            <UserCog className="h-6 w-6" />
          </Button>
        </Link>
        <Toaster />
      </body>
    </html>
  );
}
