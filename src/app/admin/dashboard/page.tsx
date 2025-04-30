// src/app/admin/dashboard/page.tsx
"use client"; // Required for checking localStorage and redirection

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogOut, Package } from 'lucide-react'; // Import Package icon

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // --- Placeholder for actual auth check ---
    const isAdmin = localStorage.getItem('isAdminAuthenticated') === 'true';
    if (!isAdmin) {
      router.replace('/admin/login'); // Redirect if not authenticated
    } else {
      setIsAuthenticated(true);
    }
    // --- End Placeholder ---
  }, [router]);

  const handleLogout = () => {
      // --- Placeholder for actual logout ---
      localStorage.removeItem('isAdminAuthenticated');
      router.replace('/admin/login');
      // --- End Placeholder ---
  }

  // Render loading or null while checking auth
  if (!isAuthenticated) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <p>Verificando acceso...</p>
             {/* Optionally add a spinner here */}
        </div>
    );
  }

  // Render dashboard content if authenticated
  return (
    <div className="container mx-auto px-4 py-12">
       <div className="flex justify-between items-center mb-8">
           <h1 className="text-3xl font-bold text-primary flex items-center">
                <LayoutDashboard className="mr-2 h-7 w-7"/>
                Panel de Administración
            </h1>
            <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
            </Button>
       </div>

      {/* Updated Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"> <Package className="mr-2 h-5 w-5"/> Gestión de Inventario</CardTitle> {/* Added icon */}
          </CardHeader>
          <CardContent>
            <p>Añade, edita o elimina productos del menú.</p> {/* Updated description */}
            {/* Add links/buttons for inventory actions */}
             <Link href="/admin/inventory" passHref legacyBehavior>
                <Button className="mt-4 w-full"> {/* Enabled button and linked */}
                    Gestionar Inventario
                 </Button>
             </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ver Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Visualiza los pedidos activos realizados por los usuarios.</p>
             <Button className="mt-4 w-full" disabled>Próximamente</Button>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Ajustes generales del sistema.</p>
             <Button className="mt-4 w-full" disabled>Próximamente</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
