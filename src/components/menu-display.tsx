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
import type { MenuItem, OrderItem, PlacedOrder } from '@/types/menu'; // Import shared types

export default function MenuDisplay() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const { toast } = useToast();
  const [toastInfo, setToastInfo] = useState<{ title: string; description: string; variant?: "default" | "destructive" } | null>(null);


  useEffect(() => {
    // Load menu data from the imported JSON
    // Filter from the potentially modified menuData during runtime if inventory changes
    setMenuItems(menuData.items as MenuItem[]); // Assert type

    // Retrieve user info from localStorage
    const storedName = localStorage.getItem('userName');
    const storedTable = localStorage.getItem('tableNumber');
    setUserName(storedName);
    setTableNumber(storedTable);

    // Load existing temporary order from localStorage if any
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
                     console.error("Invalid temporary order structure in localStorage");
                     localStorage.removeItem('currentOrder');
                }
            }
        } catch (error) {
            console.error("Failed to parse temporary order from localStorage", error);
            localStorage.removeItem('currentOrder'); // Clear invalid data
        }
    }
  }, []);

   // Save temporary order to localStorage whenever it changes
   useEffect(() => {
    // Only save if order is not empty to avoid saving empty array initially
    if (order.length > 0) {
        localStorage.setItem('currentOrder', JSON.stringify(order));
    } else {
        // If order becomes empty, remove it from storage
        localStorage.removeItem('currentOrder');
    }
   }, [order]);

   // Effect to show toast messages after state updates
    useEffect(() => {
        if (toastInfo) {
            toast(toastInfo); // Use the toast function from the hook
            setToastInfo(null); // Reset after showing
        }
    }, [toastInfo, toast]); // Depend on toastInfo and the toast function


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
      // Set toast info to be shown by useEffect
      setToastInfo({ title: "Añadido al pedido", description: `${item.name} se ha añadido a tu pedido.` });
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

             // Set toast info to be shown by useEffect
             setToastInfo({ title: "Pedido actualizado", description: toastMessage });
            return updatedOrder;
        });
    };


  const placeOrder = () => {
      // Basic validation
      if (order.length === 0) {
          setToastInfo({ title: "Pedido vacío", description: "Añade algunos artículos antes de realizar el pedido.", variant: "destructive" });
          return;
      }

      if (!userName || !tableNumber) {
           setToastInfo({ title: "Falta información", description: "No se encontró el nombre o número de mesa. Vuelve a la página principal.", variant: "destructive" });
           return;
      }

      // Prepare the order object to be saved
      const newPlacedOrder: PlacedOrder = {
          id: crypto.randomUUID(), // Generate a unique ID
          userName: userName,
          tableNumber: tableNumber,
          items: order,
          total: calculateTotal(), // Total is calculated just before placing
          timestamp: Date.now(),
          status: 'active', // Initial status
      };

       // Retrieve existing placed orders, add the new one, and save back
       try {
            const existingPlacedOrdersRaw = localStorage.getItem('placedOrders');
            const existingPlacedOrders: PlacedOrder[] = existingPlacedOrdersRaw ? JSON.parse(existingPlacedOrdersRaw) : [];

            if (!Array.isArray(existingPlacedOrders)) {
                console.error("Invalid 'placedOrders' data in localStorage. Resetting.");
                localStorage.setItem('placedOrders', JSON.stringify([newPlacedOrder]));
            } else {
                existingPlacedOrders.push(newPlacedOrder);
                localStorage.setItem('placedOrders', JSON.stringify(existingPlacedOrders));
            }

            console.log("Placing Order (Saved to localStorage):", newPlacedOrder);

            // Simulate order placement success
            setToastInfo({ title: "Pedido Realizado", description: `Tu pedido para la mesa ${tableNumber} ha sido enviado.` });

            // Clear the temporary order after placing it
            setOrder([]);
            // localStorage removal for 'currentOrder' is handled by the useEffect hook when order becomes empty

       } catch (error) {
            console.error("Failed to save placed order to localStorage", error);
             setToastInfo({ title: "Error al Guardar", description: "No se pudo guardar el pedido realizado.", variant: "destructive" });
       }
  };


  const calculateTotal = () => {
    return order.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // Group items by category from the current menuItems state
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
                      {/* Updated currency symbol */}
                      <p className="text-lg font-semibold text-accent">COP {item.price.toFixed(2)}</p>
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
           {Object.keys(groupedMenu).length === 0 && (
                <p className="text-muted-foreground text-center py-10">El menú está vacío o no se pudo cargar.</p>
            )}
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
                            {/* Updated currency symbol */}
                           <span className="block text-xs text-muted-foreground">COP {item.price.toFixed(2)} c/u</span> {/* Show unit price */}
                       </div>
                        {/* Updated currency symbol */}
                        <div className="font-medium mr-2">COP {(item.price * item.quantity).toFixed(2)}</div> {/* Item total price */}
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
                    {/* Updated currency symbol */}
                    <span>COP {calculateTotal()}</span>
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
