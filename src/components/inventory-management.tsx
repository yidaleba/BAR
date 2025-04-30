// src/components/inventory-management.tsx
"use client";

import { useState, useEffect } from 'react';
import menuData from '@/data/menu.json'; // Assuming menu.json is in src/data
import AddItemForm from '@/components/add-item-form';
import InventoryTable from '@/components/inventory-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { MenuItem } from '@/types/menu'; // Import shared type

interface InventoryManagementProps {
    categoryName: string; // Receive category name as prop
}

export default function InventoryManagement({ categoryName }: InventoryManagementProps) {
  const [inventoryItems, setInventoryItems] = useState<MenuItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load and filter initial inventory data for the specific category
    // Filter from the potentially modified menuData during runtime
    const categoryItems = menuData.items.filter(
        item => item.category.toLowerCase() === categoryName.toLowerCase()
    );
    setInventoryItems(categoryItems);
  }, [categoryName]); // Re-filter if categoryName changes

  // Function to add a new item (simulated - logs to console)
  // Updated to automatically assign the current category
  const handleAddItem = (newItemData: Omit<MenuItem, 'id' | 'category'>) => {
    // In a real app, this would send data to the backend to persist.
    // Here, we simulate adding by updating local state and logging.
    // Generate ID based on ALL items in menuData to avoid potential conflicts if items were added/removed in other categories
    const newId = menuData.items.length > 0
        ? Math.max(...menuData.items.map(item => item.id)) + 1
        : 1; // Simple ID generation

    const itemToAdd: MenuItem = {
        ...newItemData,
        id: newId,
        category: categoryName // Assign the current category
    };

    console.log("Simulating Add Item:", itemToAdd); // Log the action

    // Add to local state for UI update in this category view
    setInventoryItems(prevItems => [...prevItems, itemToAdd]);

    // (Simulation) Add to the menuData object for runtime persistence across category views
    menuData.items.push(itemToAdd);

    toast({
      title: "Producto Añadido (Simulado)",
      description: `${newItemData.name} se ha añadido a la categoría "${categoryName}" localmente.`,
    });
    // NOTE: Changes are NOT saved to menu.json file. This requires a backend.
  };

  // Function to delete an item (simulated)
  const handleDeleteItem = (itemId: number) => {
     // In a real app, this would send a request to the backend.
     console.log("Simulating Delete Item ID:", itemId); // Log the action

     const itemToDelete = inventoryItems.find(item => item.id === itemId);

     // Remove from local state (this category's view)
     setInventoryItems(prevItems => prevItems.filter(item => item.id !== itemId));

     // (Simulation) Remove from the menuData object for runtime persistence
     const itemIndexGlobal = menuData.items.findIndex(item => item.id === itemId);
     if (itemIndexGlobal > -1) {
         menuData.items.splice(itemIndexGlobal, 1);
     }

     toast({
       title: "Producto Eliminado (Simulado)",
       description: `${itemToDelete?.name ?? 'El producto'} (ID: ${itemId}) se ha eliminado de la categoría "${categoryName}" localmente.`,
       variant: "destructive"
     });
      // NOTE: Changes are NOT saved to menu.json file. This requires a backend.
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       {/* Add Item Form */}
       <Card className="lg:col-span-1 h-fit shadow-md">
         <CardHeader>
           <CardTitle>Añadir Nuevo Producto</CardTitle>
           <CardDescription>Añadir a la categoría: <span className="font-semibold">{categoryName}</span></CardDescription>
         </CardHeader>
         <CardContent>
           {/* Pass handleAddItem without category expectation */}
           <AddItemForm onAddItem={handleAddItem} />
         </CardContent>
       </Card>

      {/* Inventory Table - Filtered Items */}
      <Card className="lg:col-span-2 shadow-md">
         <CardHeader>
           <CardTitle>Inventario Actual ({categoryName})</CardTitle>
           <CardDescription>Productos actualmente en esta categoría.</CardDescription>
         </CardHeader>
         <CardContent>
             {/* Pass only the filtered items */}
             <InventoryTable items={inventoryItems} onDeleteItem={handleDeleteItem} />
         </CardContent>
       </Card>
    </div>
  );
}
