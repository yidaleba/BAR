// src/components/menu-display.tsx
"use client";

import { useState, useEffect } from 'react';
import menuData from '@/data/menu.json'; // Assuming menu.json is in src/data
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, ShoppingCart, MinusCircle, Trash2 } from 'lucide-react'; // Added MinusCircle, Trash2
import { useToast } from "@/hooks/use-toast";
import type { MenuItem, OrderItem } from '@/types/menu'; // Import shared types

// Interfaces removed, using shared types from '@/types/menu'

export default function MenuDisplay() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load menu data from the imported JSON
    setMenuItems(menuData.items as MenuItem[]); // Assert type

    // Retrieve user info from localStorage
    const storedName = localStorage.getItem('userName');
    const storedTable = localStorage.getItem('tableNumber');
    setUserName(storedName);
    setTableNumber(storedTable);

    // Load existing order from localStorage if any
    const savedOrder = localStorage.getItem('currentOrder');
    if (savedOrder) {
        try {
            const parsedOrder: OrderItem[] = JSON.parse(savedOrder); // Assert type
             if (Array.isArray(parsedOrder)) {
                // Basic validation: Check if items have necessary properties
                const isValidOrder = parsedOrder.every(item =>
                    typeof item.id === 'number' &&
                    typeof item.name === 'string' &&
                    typeof item.price === 'number' &&
                    typeof item.quantity === 'number' && item.quantity > 0
                );
                if (isValidOrder) {
                    setOrder(parsedOrder);
                } else {
                     console.error("Invalid order structure in localStorage");
                     localStorage.removeItem('currentOrder');
                }
            }
        } catch (error) {
            console.error("Failed to parse order from localStorage", error);
            localStorage.removeItem('currentOrder'); // Clear invalid data
        }
    }
  }, []);

   // Save order to localStorage whenever it changes
   useEffect(() => {
    // Only save if order is not empty to avoid saving empty array initially
    if (order.length > 0) {
        localStorage.setItem('currentOrder', JSON.stringify(order));
    } else {
        // If order becomes empty, remove it from storage
        localStorage.removeItem('currentOrder');
    }
   }, [order]);

   // Wrap toast calls in useEffect to prevent calling during render
   const showToast = (title: string, description: string, variant: "default" | "destructive" = "default") => {
       toast({ title, description, variant });
   };


  const addToOrder = (item: MenuItem) => {
    setOrder(prevOrder => {
      const existingItemIndex = prevOrder.findIndex(orderItem => orderItem.id === item.id);
      let updatedOrder;
      if (existingItemIndex > -1) {
        // Increase quantity
        updatedOrder = [...prevOrder];
        updatedOrder[existingItemIndex] = {
          ...updatedOrder[existingItemIndex],
          quantity: updatedOrder[existingItemIndex].quantity + 1,
        };
      } else {
        // Add new item
        updatedOrder = [...prevOrder, { ...item, quantity: 1 }];
      }
      // Use useEffect for toast
       showToast("Añadido al pedido", `${item.name} se ha añadido a tu pedido.`);
      return updatedOrder;
    });
  };

   const removeFromOrder = (itemId: number, removeAll: boolean = false) => {
        setOrder(prevOrder => {
            const itemIndex = prevOrder.findIndex(orderItem => orderItem.id === itemId);
            if (itemIndex === -1) {
                return prevOrder; // Item not found
            }

            const currentItem = prevOrder[itemIndex];
            let updatedOrder = [...prevOrder];
            let toastMessage = "";

            if (removeAll || currentItem.quantity <= 1) {
                updatedOrder.splice(itemIndex, 1);
                toastMessage = `${currentItem.name} eliminado del pedido.`;
            } else {
                const newQuantity = currentItem.quantity - 1;
                updatedOrder[itemIndex] = { ...currentItem, quantity: newQuantity };
                toastMessage = `Cantidad de ${currentItem.name} reducida a ${newQuantity}.`;
            }

             // Use useEffect for toast
             showToast("Pedido actualizado", toastMessage);
            return updatedOrder;
        });
    };


  const placeOrder = () => {
      // Basic validation
      if (order.length === 0) {
          showToast("Pedido vacío", "Añade algunos artículos antes de realizar el pedido.", "destructive");
          return;
      }

      if (!userName || !tableNumber) {
           showToast("Falta información", "No se encontró el nombre o número de mesa. Vuelve a la página principal.", "destructive");
           return;
      }

      // Here you would typically send the order to the backend
      console.log("Placing Order:", {
          userName,
          tableNumber,
          items: order,
          total: calculateTotal()
      });

      // Simulate order placement
       showToast("Pedido Realizado", `Tu pedido para la mesa ${tableNumber} ha sido enviado.`);

      // Clear the order after placing it
      setOrder([]);
      // localStorage removal is handled by the useEffect hook when order becomes empty
  };


  const calculateTotal = () => {
    return order.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // Group items by category
  const groupedMenu = menuItems.reduce((acc, item) => {
    const category = item.category || 'Otros'; // Default category if missing
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Menu Items */}
      <ScrollArea className="md:col-span-2 h-[70vh] pr-4">
        <div className="space-y-8">
          {Object.entries(groupedMenu).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-2xl font-semibold mb-4 text-primary border-b-2 border-accent pb-2">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <Card key={item.id} className="flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {item.description && <p className="text-sm text-muted-foreground mb-2">{item.description}</p>}
                      <p className="text-lg font-semibold text-accent">${item.price.toFixed(2)}</p>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => addToOrder(item)} className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" /> Añadir
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Current Order Summary */}
      <Card className="md:col-span-1 shadow-lg sticky top-8 h-fit">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
             <ShoppingCart className="mr-2 h-5 w-5"/> Tu Pedido
          </CardTitle>
           {userName && tableNumber && (
               <p className="text-sm text-muted-foreground">Mesa: {tableNumber} | Cliente: {userName}</p>
           )}
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          {order.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Tu pedido está vacío.</p>
          ) : (
             <ScrollArea className="h-[30vh] pr-2">
                <ul className="space-y-3">
                {order.map(item => (
                    <li key={item.id} className="flex justify-between items-center text-sm group">
                       <div className="flex-grow mr-2"> {/* Added margin-right */}
                           <span>{item.quantity}x {item.name}</span>
                           <span className="block text-xs text-muted-foreground">${item.price.toFixed(2)} c/u</span> {/* Show unit price */}
                       </div>
                        <div className="font-medium mr-2">${(item.price * item.quantity).toFixed(2)}</div> {/* Item total price */}
                       <div className="flex items-center ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"> {/* Prevent shrinking */}
                           <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-accent"
                                onClick={() => removeFromOrder(item.id)}
                                aria-label={`Reducir cantidad de ${item.name}`}
                           >
                               <MinusCircle className="h-4 w-4"/>
                           </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive/80"
                                onClick={() => removeFromOrder(item.id, true)} // Pass true to remove all
                                aria-label={`Eliminar ${item.name} del pedido`}
                           >
                               <Trash2 className="h-4 w-4"/>
                           </Button>
                       </div>
                    </li>
                ))}
                </ul>
             </ScrollArea>
          )}
        </CardContent>
        {order.length > 0 && (
            <>
                <Separator />
                <CardFooter className="flex flex-col items-stretch gap-4 pt-4">
                    <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${calculateTotal()}</span>
                    </div>
                    <Button onClick={placeOrder} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Realizar Pedido
                    </Button>
                </CardFooter>
            </>
        )}
      </Card>
    </div>
  );
}
