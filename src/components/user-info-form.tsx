"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from 'next/navigation';

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Utensils } from 'lucide-react'; // Icon for the card header

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  tableNumber: z.coerce.number().int().positive({
    message: "El número de mesa debe ser positivo.",
  }),
});

export default function UserInfoForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      tableNumber: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Store user info (e.g., in localStorage or context) and navigate
    console.log("User Info:", values); // Replace with actual logic later
    localStorage.setItem('userName', values.name);
    localStorage.setItem('tableNumber', values.tableNumber.toString());
    router.push('/menu'); // Navigate to the menu page after submission
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
           <Utensils className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-semibold">Bienvenido a Bar Buddy</CardTitle>
        <CardDescription>Ingresa tu nombre y número de mesa para comenzar.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tableNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Mesa</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Ver Menú
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
