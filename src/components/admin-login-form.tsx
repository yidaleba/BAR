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
import { LockKeyhole } from 'lucide-react'; // Icon for admin login
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  username: z.string().min(1, { message: "El nombre de usuario es requerido." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

export default function AdminLoginForm() {
  const router = useRouter();
   const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // --- Placeholder for actual admin authentication ---
    console.log("Admin Login Attempt:", values);

    // Simulate login success/failure
    if (values.username === "admin" && values.password === "password") { // VERY INSECURE - REPLACE WITH ACTUAL AUTH
      toast({
        title: "Inicio de sesión exitoso",
        description: "Redirigiendo al panel de administración...",
      });
      // Set some kind of auth token/session state here
      localStorage.setItem('isAdminAuthenticated', 'true'); // Example, not secure for production
      router.push('/admin/dashboard'); // Redirect to admin dashboard
    } else {
       toast({
        title: "Error de inicio de sesión",
        description: "Nombre de usuario o contraseña incorrectos.",
        variant: "destructive",
      });
       localStorage.removeItem('isAdminAuthenticated');
       form.reset(); // Clear form on failure
    }
    // --- End Placeholder ---
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
         <div className="flex justify-center items-center mb-4">
            <LockKeyhole className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-semibold">Acceso Administrador</CardTitle>
        <CardDescription>Ingresa tus credenciales.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <FormControl>
                    <Input placeholder="admin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Ingresar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
