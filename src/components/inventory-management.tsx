// src/components/inventory-management.tsx
"use client";

import { useState, useEffect } from 'react';
import menuData from '@/data/menu.json'; // Assuming menu.json is in src/data
import AddItemForm from '@/components/add-item-form';
import InventoryTable from '@/components/inventory-table';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { MenuItem } from '@/types/menu'; // Import shared type

// Interface removed, using shared type from '@/types/menu'

export default function InventoryManagement() {
  const [inventoryItems, setInventoryItems] = useState<MenuItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load initial inventory data from the imported JSON
    // Add a placeholder quantity for display purposes if needed,
    // or assume it's managed elsewhere if not directly in menu.json
    const itemsWithPlaceholderQuantity = menuData.items.map(item => ({
        ...item,
        // quantity: item.quantity ?? 100 // Example: Default quantity if not present
    }));
    setInventoryItems(itemsWithPlaceholderQuantity);
  }, []);

  // Function to add a new item (simulated - logs to console)
  const handleAddItem = (newItem: Omit<MenuItem, 'id'>) => {
    // In a real app, this would send data to the backend to persist.
    // Here, we simulate adding by updating local state and logging.
    const newId = Math.max(0, ...inventoryItems.map(item => item.id)) + 1; // Simple ID generation
    const itemToAdd: MenuItem = { ...newItem, id: newId };

    console.log("Simulating Add Item:", itemToAdd); // Log the action

    // Add to local state for UI update
    setInventoryItems(prevItems => [...prevItems, itemToAdd]);

    toast({
      title: "Producto Añadido (Simulado)",
      description: `${newItem.name} se ha añadido al inventario localmente.`,
    });
    // NOTE: Changes are NOT saved to menu.json here. This requires a backend.
  };

  // Function to delete an item (simulated)
  const handleDeleteItem = (itemId: number) => {
     // In a real app, this would send a request to the backend.
     console.log("Simulating Delete Item ID:", itemId); // Log the action

     const itemToDelete = inventoryItems.find(item => item.id === itemId);

     // Remove from local state
     setInventoryItems(prevItems => prevItems.filter(item => item.id !== itemId));

     toast({
       title: "Producto Eliminado (Simulado)",
       description: `${itemToDelete?.name ?? 'El producto'} se ha eliminado del inventario localmente.`,
       variant: "destructive"
     });
      // NOTE: Changes are NOT saved to menu.json here. This requires a backend.
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       {/* Add Item Form */}
       <Card className="lg:col-span-1 h-fit shadow-md">
         <CardHeader>
           <CardTitle>Añadir Nuevo Producto</CardTitle>
         </CardHeader>
         <CardContent>
           <AddItemForm onAddItem={handleAddItem} />
         </CardContent>
       </Card>

      {/* Inventory Table */}
      <Card className="lg:col-span-2 shadow-md">
         <CardHeader>
           <CardTitle>Inventario Actual</CardTitle>
         </CardHeader>
         <CardContent>
             <InventoryTable items={inventoryItems} onDeleteItem={handleDeleteItem} />
         </CardContent>
       </Card>


    </div>
  );
}
