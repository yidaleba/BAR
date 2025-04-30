// src/app/admin/orders/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ClipboardList, Trash2, CheckCircle } from 'lucide-react';
import type { OrderItem, PlacedOrder } from '@/types/menu'; // Import OrderItem type and PlacedOrder
import { useToast } from "@/hooks/use-toast";

// Define the structure of a placed order (including user info and timestamp)
// Moved to types/menu.ts


export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<PlacedOrder[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        // Load placed orders from localStorage
        const storedOrders = localStorage.getItem('placedOrders');
        if (storedOrders) {
            try {
                const parsedOrders: PlacedOrder[] = JSON.parse(storedOrders);
                 if (Array.isArray(parsedOrders)) {
                    // Filter only active orders and sort by timestamp (newest first)
                    const activeOrders = parsedOrders
                        .filter(order => order.status === 'active')
                        .sort((a, b) => b.timestamp - a.timestamp);
                    setOrders(activeOrders);
                 }
            } catch (error) {
                console.error("Failed to parse placed orders from localStorage", error);
                 localStorage.removeItem('placedOrders'); // Clear invalid data
            }
        }
    }, []);

     // Function to update localStorage with current orders
     const updateStoredOrders = (updatedOrders: PlacedOrder[]) => {
         try {
             localStorage.setItem('placedOrders', JSON.stringify(updatedOrders));
         } catch (error) {
             console.error("Failed to save orders to localStorage", error);
             toast({
                 title: "Error",
                 description: "No se pudieron guardar los cambios en los pedidos.",
                 variant: "destructive",
             });
         }
     };

     // Function to mark an order as completed
     const markOrderCompleted = (orderId: string) => {
         // Update the status in the main stored list
         const allStoredOrders = JSON.parse(localStorage.getItem('placedOrders') || '[]') as PlacedOrder[];
         const updatedAllOrders = allStoredOrders.map(order =>
             order.id === orderId ? { ...order, status: 'completed' } : order
         );
         updateStoredOrders(updatedAllOrders);

         // Update the local state to remove the completed order from the active view
         setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));

         toast({
             title: "Pedido Completado",
             description: `El pedido ${orderId.substring(0, 6)}... ha sido marcado como completado.`,
         });
         console.log("Marking order completed (simulated):", orderId);
     };

     // Function to delete an order (e.g., if made by mistake)
     const deleteOrder = (orderId: string) => {
          // Remove from the main stored list
         const allStoredOrders = JSON.parse(localStorage.getItem('placedOrders') || '[]') as PlacedOrder[];
         const updatedAllOrders = allStoredOrders.filter(order => order.id !== orderId);
         updateStoredOrders(updatedAllOrders);

          // Remove from the local state (active view)
         setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));

         toast({
             title: "Pedido Eliminado",
             description: `El pedido ${orderId.substring(0, 6)}... ha sido eliminado.`,
             variant: "destructive",
         });
         console.log("Deleting order (simulated):", orderId);
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
                <h1 className="text-3xl font-bold text-primary flex items-center">
                    <ClipboardList className="mr-2 h-7 w-7"/>
                    Pedidos Activos
                </h1>
            </div>

            <ScrollArea className="h-[calc(100vh-12rem)]"> {/* Adjust height as needed */}
                 {orders.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-muted-foreground text-xl">No hay pedidos activos en este momento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {orders.map((order) => (
                            <Card key={order.id} className="shadow-md flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-lg flex justify-between items-center">
                                        <span>Mesa: {order.tableNumber} <span className="font-normal text-base">({order.userName})</span></span>
                                        <span className="text-sm font-normal text-muted-foreground">
                                            {new Date(order.timestamp).toLocaleTimeString()} {/* Display time */}
                                        </span>
                                    </CardTitle>
                                    <CardDescription>
                                        ID Pedido: {order.id.substring(0, 8)}... {/* Show partial ID */}
                                    </CardDescription>
                                </CardHeader>
                                <Separator />
                                <CardContent className="pt-4 flex-grow">
                                    <h4 className="font-semibold mb-2">Artículos:</h4>
                                    <ul className="space-y-1 text-sm list-disc list-inside pl-2 mb-4">
                                        {order.items.map(item => (
                                            <li key={item.id}>
                                                 {/* Updated currency symbol */}
                                                {item.quantity}x {item.name} (COP {item.price.toFixed(2)} c/u)
                                            </li>
                                        ))}
                                    </ul>
                                    <Separator className="my-2"/>
                                     <div className="flex justify-between font-bold text-md mt-2">
                                        <span>Total:</span>
                                        {/* Updated currency symbol */}
                                        <span>COP {order.total}</span>
                                    </div>
                                </CardContent>
                                <Separator />
                                <CardContent className="pt-4 flex gap-2 justify-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 border-destructive/50"
                                        onClick={() => deleteOrder(order.id)}
                                    >
                                        <Trash2 className="mr-1 h-4 w-4" /> Eliminar
                                    </Button>
                                     <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => markOrderCompleted(order.id)}
                                    >
                                         <CheckCircle className="mr-1 h-4 w-4" /> Completar
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
