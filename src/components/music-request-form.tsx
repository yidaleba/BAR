// src/components/music-request-form.tsx
"use client";

import { useEffect, useState, useCallback } from 'react'; // Import useCallback
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from 'next/navigation'; // Use if redirection is needed later

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
import { Music, ListMusic } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

const MAX_REQUESTS_PER_TABLE = 3;
const LOCAL_STORAGE_KEY = 'musicRequests';

// Helper function to get requests from localStorage
const getStoredRequests = (): Record<string, string[]> => {
    // Check if window is defined (runs only on client-side)
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    try {
        const parsed = stored ? JSON.parse(stored) : {};
        // Basic validation to ensure it's an object
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
            return parsed;
        }
        // If data is invalid (e.g., null, array, or parsing failed), return empty object and clean up
        console.error("Invalid music requests format in localStorage, resetting.");
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return {};
    } catch (e) {
        console.error("Failed to parse music requests from localStorage", e);
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear invalid data
        return {};
    }
};


// Helper function to save requests to localStorage
const saveStoredRequests = (requests: Record<string, string[]>) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(requests));
    } catch (error) {
         console.error("Failed to save music requests to localStorage", error);
         // Optionally show a toast error to the user if saving fails
    }
};


// Schema now only includes the song request
const formSchema = z.object({
  songRequest: z.string().min(1, {
    message: "El nombre de la canción o artista es requerido.",
  }),
});

export default function MusicRequestForm() {
  const router = useRouter(); // Keep if needed for future redirection
  const { toast } = useToast();
  const [currentTableRequests, setCurrentTableRequests] = useState<string[]>([]);
  const [tableNumber, setTableNumber] = useState<string | null>(null); // Store table number as string

  // Function to load requests for the current table
  const loadCurrentTableRequests = useCallback(() => {
    if (typeof window !== 'undefined') {
      const storedTable = localStorage.getItem('tableNumber');
      if (storedTable) {
        setTableNumber(storedTable);
        const allRequests = getStoredRequests();
        setCurrentTableRequests(allRequests[storedTable] || []);
      } else {
        toast({
          title: "Número de Mesa No Encontrado",
          description: "No se pudo encontrar tu número de mesa. Por favor, vuelve a la página principal.",
          variant: "destructive"
        });
        // Optionally disable form or redirect
      }
    }
  }, [toast]); // Add toast as dependency

  // Load table number and requests on mount, and listen for storage changes
  useEffect(() => {
    loadCurrentTableRequests(); // Initial load

    // Define the event handler
    const handleStorageChange = (event: StorageEvent) => {
      // Check if the change happened to our specific key and originated from another tab/window
      if (event.key === LOCAL_STORAGE_KEY && event.storageArea === localStorage) {
         console.log('Music requests updated in another tab. Reloading...');
        loadCurrentTableRequests(); // Reload requests when localStorage changes
      }
    };

    // Add event listener
    window.addEventListener('storage', handleStorageChange);

    // Cleanup: Remove event listener when component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadCurrentTableRequests]); // Depend on the memoized loader function


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      songRequest: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!tableNumber) {
        toast({
             title: "Error",
             description: "Número de mesa no disponible. Intenta recargar.",
             variant: "destructive"
        });
        return;
    }

    // Re-check the current number of requests *right before* adding a new one
    // This ensures the limit check uses the most up-to-date data from localStorage
    const allRequests = getStoredRequests();
    const currentRequestsForTable = allRequests[tableNumber] || [];

    if (currentRequestsForTable.length >= MAX_REQUESTS_PER_TABLE) {
      toast({
        title: "Límite Alcanzado",
        description: `Ya has solicitado el máximo de ${MAX_REQUESTS_PER_TABLE} canciones para la mesa ${tableNumber}.`,
        variant: "destructive",
      });
      return;
    }


    const { songRequest } = values;
    const tableKey = tableNumber; // Use the state variable

    // Add the new request
    const updatedTableRequests = [...currentRequestsForTable, songRequest]; // Use the freshly fetched requests
    allRequests[tableKey] = updatedTableRequests;
    saveStoredRequests(allRequests);

    // Update state and UI
    setCurrentTableRequests(updatedTableRequests);
    form.resetField('songRequest'); // Clear the song input

    toast({
      title: "¡Canción Solicitada!",
      description: `"${songRequest}" añadida a la cola para la mesa ${tableNumber}.`,
    });

    console.log("Music Request Added:", { tableNumber, songRequest, allRequests });
    // Optionally: Send request to backend here if needed
  }

  const remainingRequests = tableNumber ? MAX_REQUESTS_PER_TABLE - currentTableRequests.length : 0;
  const canRequest = tableNumber && remainingRequests > 0;

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
          <ListMusic className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl font-semibold">Pedir Música</CardTitle>
        {tableNumber ? (
             <CardDescription>
                 Mesa {tableNumber}. Solicita tu canción o artista favorito. Te quedan {remainingRequests} solicitudes.
             </CardDescription>
        ) : (
             <CardDescription className="text-destructive">
                 Número de mesa no encontrado. Vuelve a inicio.
             </CardDescription>
        )}
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             {/* Removed Table Number Field */}
            <FormField
              control={form.control}
              name="songRequest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Canción o Artista</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Bohemian Rhapsody - Queen" {...field} disabled={!tableNumber}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={!canRequest}>
                {canRequest ? 'Enviar Solicitud' : (tableNumber ? 'Límite Alcanzado' : 'Mesa no definida')}
                {canRequest && <Music className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </Form>

        {/* Display current requests for the table */}
        {tableNumber && currentTableRequests.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border">
                <h3 className="text-md font-medium mb-2 text-center text-muted-foreground">Tus Solicitudes (Mesa {tableNumber}):</h3>
                <ul className="list-disc list-inside text-sm text-center space-y-1">
                    {currentTableRequests.map((req, index) => (
                        <li key={index}>{req}</li>
                    ))}
                </ul>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
