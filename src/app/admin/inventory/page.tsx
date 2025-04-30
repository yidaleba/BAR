// src/app/admin/inventory/page.tsx
import InventoryManagement from '@/components/inventory-management';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function InventoryPage() {
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
            <Link href="/admin/dashboard" passHref legacyBehavior>
                <Button variant="outline" size="icon" className="mr-4">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Volver al Panel</span>
                </Button>
            </Link>
             <h1 className="text-3xl font-bold text-primary">Gestión de Inventario</h1>
        </div>
      <InventoryManagement />
    </div>
  );
}
