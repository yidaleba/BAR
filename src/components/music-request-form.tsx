// src/components/music-request-form.tsx
"use client";

import { useEffect, useState } from 'react';
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
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    try {
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        console.error("Failed to parse music requests from localStorage", e);
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear invalid data
        return {};
    }
};

// Helper function to save requests to localStorage
const saveStoredRequests = (requests: Record<string, string[]>) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(requests));
};


const formSchema = z.object({
  tableNumber: z.coerce.number().int().positive({
    message: "El número de mesa debe ser positivo.",
  }),
  songRequest: z.string().min(1, {
    message: "El nombre de la canción o artista es requerido.",
  }),
});

export default function MusicRequestForm() {
  const router = useRouter(); // Keep if needed for future redirection
  const { toast } = useToast();
  const [currentTableRequests, setCurrentTableRequests] = useState<string[]>([]);
  const [initialTableNumber, setInitialTableNumber] = useState<number | ''>('');

  // Load initial table number and requests on mount
  useEffect(() => {
    const storedTable = localStorage.getItem('tableNumber');
    const tableNum = storedTable ? parseInt(storedTable, 10) : '';
    if (tableNum && !isNaN(tableNum)) {
        setInitialTableNumber(tableNum);
        form.setValue('tableNumber', tableNum); // Pre-fill form
        const allRequests = getStoredRequests();
        setCurrentTableRequests(allRequests[tableNum.toString()] || []);
    } else {
         // Optionally prompt user if table number isn't set, or handle differently
         toast({
             title: "Número de Mesa Requerido",
             description: "Por favor, ingresa tu número de mesa.",
             variant: "destructive"
         })
    }

  }, []); // Run only once on mount


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tableNumber: initialTableNumber,
      songRequest: "",
    },
  });

   // Watch table number changes to update request count display
   const watchedTableNumber = form.watch('tableNumber');
   useEffect(() => {
       if (watchedTableNumber) {
           const allRequests = getStoredRequests();
           setCurrentTableRequests(allRequests[watchedTableNumber.toString()] || []);
       } else {
            setCurrentTableRequests([]); // Clear if table number is cleared
       }
   }, [watchedTableNumber]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    const { tableNumber, songRequest } = values;
    const tableKey = tableNumber.toString();
    const allRequests = getStoredRequests();
    const tableRequests = allRequests[tableKey] || [];

    if (tableRequests.length >= MAX_REQUESTS_PER_TABLE) {
      toast({
        title: "Límite Alcanzado",
        description: `Ya has solicitado el máximo de ${MAX_REQUESTS_PER_TABLE} canciones para la mesa ${tableNumber}.`,
        variant: "destructive",
      });
      return;
    }

    // Add the new request
    const updatedTableRequests = [...tableRequests, songRequest];
    allRequests[tableKey] = updatedTableRequests;
    saveStoredRequests(allRequests);

    // Update state and UI
    setCurrentTableRequests(updatedTableRequests);
    form.resetField('songRequest'); // Clear only the song input
     form.setValue('tableNumber', tableNumber); // Keep table number filled

    toast({
      title: "¡Canción Solicitada!",
      description: `"${songRequest}" añadida a la cola para la mesa ${tableNumber}.`,
    });

    console.log("Music Request Added:", { tableNumber, songRequest, allRequests });
    // Optionally: Send request to backend here if needed
  }

  const remainingRequests = MAX_REQUESTS_PER_TABLE - currentTableRequests.length;
  const canRequest = remainingRequests > 0;

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
          <ListMusic className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl font-semibold">Pedir Música</CardTitle>
        <CardDescription>
            Solicita tu canción o artista favorito. Te quedan {remainingRequests} solicitudes.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="tableNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Mesa</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ej: 5"
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
              name="songRequest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Canción o Artista</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Bohemian Rhapsody - Queen" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={!canRequest || !watchedTableNumber}>
                {canRequest ? 'Enviar Solicitud' : 'Límite Alcanzado'}
                {canRequest && <Music className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </Form>

        {/* Display current requests for the table */}
        {currentTableRequests.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border">
                <h3 className="text-md font-medium mb-2 text-center text-muted-foreground">Solicitudes para Mesa {watchedTableNumber}:</h3>
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
