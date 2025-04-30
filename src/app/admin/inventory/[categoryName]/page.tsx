// src/app/admin/inventory/[categoryName]/page.tsx
import InventoryManagement from '@/components/inventory-management';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface CategoryInventoryPageProps {
  params: {
    categoryName: string;
  };
}

export default function CategoryInventoryPage({ params }: CategoryInventoryPageProps) {
  // Decode category name in case it contains special characters
  const categoryName = decodeURIComponent(params.categoryName);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Link href="/admin/inventory" passHref legacyBehavior>
            <Button variant="outline" size="icon" className="mr-4">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Volver a Categorías</span>
            </Button>
        </Link>
        <h1 className="text-3xl font-bold text-primary">
          Gestión de Inventario: <span className="text-accent">{categoryName}</span>
        </h1>
      </div>
      {/* Pass the category name to the management component */}
      <InventoryManagement categoryName={categoryName} />
    </div>
  );
}
