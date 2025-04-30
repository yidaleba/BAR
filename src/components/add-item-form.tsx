// src/components/add-item-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import type { MenuItem } from '@/types/menu';

// Define the schema based on MenuItem, excluding 'id'
const formSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  price: z.coerce.number().positive({ message: "El precio debe ser un número positivo." }),
  category: z.string().min(1, { message: "La categoría es requerida." }),
  description: z.string().optional(), // Description is optional
  // quantity: z.coerce.number().int().nonnegative({ message: "La cantidad debe ser 0 o más." }), // Add quantity field as requested initially
});

interface AddItemFormProps {
  onAddItem: (item: Omit<MenuItem, 'id'>) => void; // Callback to handle adding the item
}

export default function AddItemForm({ onAddItem }: AddItemFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: '' as unknown as number, // Initialize for controlled input
      category: "",
      description: "",
      // quantity: '' as unknown as number, // Initialize for controlled input
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddItem(values); // Pass validated data to the parent component
    form.reset(); // Reset form after successful submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Producto</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Cerveza Lager" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                 <Input
                    type="number"
                    step="0.01" // Allow decimal prices
                    placeholder="Ej: 3.50"
                    {...field}
                    value={field.value ?? ''}
                    onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                 />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Cervezas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Ej: Clásica y refrescante." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         {/* Quantity field removed as it's not in the current menu.json structure */}
        {/* <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cantidad Inicial</FormLabel>
              <FormControl>
                 <Input
                     type="number"
                     placeholder="Ej: 100"
                     {...field}
                     value={field.value ?? ''}
                     onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                 />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <Button type="submit" className="w-full">
          Añadir Producto
        </Button>
      </form>
    </Form>
  );
}
