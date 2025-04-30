// src/app/admin/inventory/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Import Input
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Import Card components
import { ArrowLeft, PlusCircle, List } from 'lucide-react';
import menuData from '@/data/menu.json'; // Assuming menu.json is in src/data
import { useToast } from "@/hooks/use-toast"; // Import useToast

export default function InventoryCategoriesPage() {
    const [categories, setCategories] = useState<string[]>([]);
    const [newCategory, setNewCategory] = useState<string>("");
    const { toast } = useToast(); // Initialize toast

    useEffect(() => {
        // Extract unique categories from menu data and add the default "Cerveza"
        const existingCategories = Array.from(new Set(menuData.items.map(item => item.category)));
        const initialCategories = Array.from(new Set(["Cerveza", ...existingCategories])); // Ensure "Cerveza" is present
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
        if (categories.some(cat => cat.toLowerCase() === newCategory.trim().toLowerCase())) {
             toast({
                title: "Categoría Duplicada",
                description: `La categoría "${newCategory.trim()}" ya existe.`,
                variant: "destructive",
            });
            setNewCategory(""); // Clear input
            return;
        }

        const addedCategory = newCategory.trim();
        // Simulate adding category (only in state, not persistent)
        setCategories(prev => [...prev, addedCategory].sort()); // Add and sort
        setNewCategory(""); // Clear input
         toast({
            title: "Categoría Añadida (Simulado)",
            description: `Categoría "${addedCategory}" añadida localmente.`,
        });
         console.log("Simulating Add Category:", addedCategory); // Log simulation
         // NOTE: Changes are NOT saved to menu.json here. This requires a backend.
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
                         <CardDescription>Selecciona una categoría para gestionar sus productos.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {categories.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">No hay categorías definidas.</p>
                        ) : (
                            <ul className="space-y-2">
                                {categories.map((category) => (
                                    <li key={category} className="group relative"> {/* Add group relative for positioning delete */}
                                        <Link href={`/admin/inventory/${encodeURIComponent(category)}`} passHref legacyBehavior>
                                             <Button variant="outline" className="w-full justify-start text-left h-auto py-3 pr-10"> {/* Add padding-right */}
                                                {category}
                                            </Button>
                                        </Link>
                                         {/* Delete button removed */}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
             {/* Delete Confirmation Dialog removed */}
        </div>
    );
}
