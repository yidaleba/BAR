// src/app/page.tsx
import Link from 'next/link';
import UserInfoForm from '@/components/user-info-form';
import { Button } from "@/components/ui/button";
import { UserCog } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-10rem)] relative">
      {/* Display the UserInfoForm directly on the landing page */}
      <UserInfoForm />

      {/* Admin Access Button - Only on the home page */}
      <Link href="/admin/login" passHref legacyBehavior>
         <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-4 right-4 rounded-full shadow-lg w-14 h-14 bg-primary text-primary-foreground hover:bg-primary/90"
          aria-label="Admin Access"
        >
          <UserCog className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}
