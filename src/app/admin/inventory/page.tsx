// src/app/admin/inventory/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, PlusCircle, List, Trash2 } from 'lucide-react';
import menuData from '@/data/menu.json'; // Assuming menu.json is in src/data
import { useToast } from "@/hooks/use-toast";

export default function InventoryCategoriesPage() {
    const [categories, setCategories] = useState<string[]>([]);
    const [newCategory, setNewCategory] = useState<string>("");
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    // Removed isDeleteDialogOpen state as each dialog will manage its open state internally via AlertDialog's `open` prop based on which trigger is clicked.
    // The AlertDialog component itself handles the open/closed state triggered by its trigger.
    // We only need to know *which* category is targeted for deletion when confirming.
    const { toast } = useToast();

    useEffect(() => {
        // Extract unique categories from menu data
        const existingCategories = Array.from(new Set(menuData.items.map(item => item.category)));
        const initialCategories = existingCategories.length > 0 ? existingCategories : ["Cerveza"];
        if (!initialCategories.includes("Cerveza") && !existingCategories.some(cat => cat.toLowerCase() === "cerveza")) {
             // Add Cerveza if it wasn't in the data and data wasn't empty
            // initialCategories.push("Cerveza"); // Let's not force "Cerveza" if not present initially
        }
        setCategories(initialCategories.sort()); // Sort categories alphabetically
    }, []);

    const handleAddCategory = () => {
        if (newCategory.trim() === "") {
            toast({
                title: "Error",
                description: "El nombre de la categoría no puede estar vacío.",
                variant: "destructive",
            });
            return;
        }
        const trimmedCategory = newCategory.trim();
        if (categories.some(cat => cat.toLowerCase() === trimmedCategory.toLowerCase())) {
             toast({
                title: "Categoría Duplicada",
                description: `La categoría "${trimmedCategory}" ya existe.`,
                variant: "destructive",
            });
            setNewCategory(""); // Clear input
            return;
        }

        // Simulate adding category (only in state, not persistent)
        setCategories(prev => [...prev, trimmedCategory].sort()); // Add and sort
        setNewCategory(""); // Clear input
         toast({
            title: "Categoría Añadida (Simulado)",
            description: `Categoría "${trimmedCategory}" añadida localmente.`,
        });
         console.log("Simulating Add Category:", trimmedCategory); // Log simulation
         // NOTE: Changes are NOT saved to menu.json here. This requires a backend.
         // To persist, you'd need an API call here.
    };

    const handleDeleteClick = (category: string) => {
        // Set the category to delete when the trigger button is clicked.
        // The dialog opening is handled by the AlertDialog component itself.
        setCategoryToDelete(category);
    };

    const handleConfirmDelete = () => {
        if (!categoryToDelete) return;

        // Simulate deleting category and its items (only in state/imported data, not persistent)
        console.log("Simulating Delete Category:", categoryToDelete);

        // 1. Remove category from the list state
        setCategories(prev => prev.filter(cat => cat !== categoryToDelete));

        // 2. (Simulation) Remove items of this category from the menuData object (runtime only)
        const initialLength = menuData.items.length;
        menuData.items = menuData.items.filter(item => item.category !== categoryToDelete);
        const itemsRemovedCount = initialLength - menuData.items.length;


        toast({
            title: "Categoría Eliminada (Simulado)",
            description: `Categoría "${categoryToDelete}" y sus ${itemsRemovedCount} productos asociados eliminados localmente.`,
            variant: "destructive",
        });

        // Reset state - No need to manage open state, just clear the targeted category
        setCategoryToDelete(null);
         // NOTE: Changes are NOT saved to menu.json permanently. This requires a backend.
         // To persist, you'd need an API call here to delete the category and its items.
         // The dialog will close automatically on action/cancel click if not prevented.
    };

     const handleCancelDelete = () => {
        // Reset the targeted category when cancel is clicked.
        setCategoryToDelete(null);
        // Dialog closes automatically.
    };


    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex items-center mb-8">
                <Link href="/admin/dashboard" passHref legacyBehavior>
                    <Button variant="outline" size="icon" className="mr-4">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Volver al Panel</span>
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold text-primary">Gestión de Inventario por Categoría</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Add Category Section */}
                <Card className="md:col-span-1 h-fit shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center"><PlusCircle className="mr-2 h-5 w-5" /> Añadir Categoría</CardTitle>
                         <CardDescription>Crea una nueva categoría de productos.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            type="text"
                            placeholder="Nombre de la nueva categoría"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()} // Allow adding with Enter key
                        />
                        <Button onClick={handleAddCategory} className="w-full">
                            Añadir Categoría
                        </Button>
                    </CardContent>
                </Card>

                {/* List Categories Section */}
                <Card className="md:col-span-2 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center"><List className="mr-2 h-5 w-5" /> Categorías Existentes</CardTitle>
                         <CardDescription>Selecciona una categoría para gestionar sus productos o elimínala.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {categories.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">No hay categorías definidas.</p>
                        ) : (
                            <ul className="space-y-2">
                                {categories.map((category) => (
                                    // Wrap each list item's delete functionality in its own AlertDialog
                                    <AlertDialog key={category}>
                                        <li className="group relative flex items-center justify-between"> {/* Use flex to align items */}
                                            <Link href={`/admin/inventory/${encodeURIComponent(category)}`} passHref legacyBehavior className="flex-grow mr-2">
                                                <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                                                    {category}
                                                </Button>
                                            </Link>
                                            {/* Delete Button Trigger */}
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive/80 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" // Show on hover
                                                    onClick={() => handleDeleteClick(category)} // Set the category to delete when clicked
                                                    aria-label={`Eliminar categoría ${category}`}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>

                                            {/* Delete Confirmation Dialog Content for this specific category */}
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta acción no se puede deshacer. Esto eliminará permanentemente la categoría
                                                        <span className="font-semibold"> "{category}" </span>
                                                        y todos los productos asociados a ella.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    {/* Cancel resets the categoryToDelete state */}
                                                    <AlertDialogCancel onClick={handleCancelDelete}>Cancelar</AlertDialogCancel>
                                                    {/* Action proceeds with deletion using categoryToDelete state */}
                                                    <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                        Eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </li>
                                    </AlertDialog>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>

             {/* Dialog component moved inside the map loop */}
        </div>
    );
}
