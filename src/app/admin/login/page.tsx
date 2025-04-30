// src/app/admin/login/page.tsx
import AdminLoginForm from '@/components/admin-login-form';

export default function AdminLoginPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-10rem)]">
      <AdminLoginForm />
    </div>
  );
}
