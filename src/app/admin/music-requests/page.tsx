// src/app/admin/music-requests/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Music, Trash2, RotateCcw } from 'lucide-react'; // Added Trash2 and RotateCcw
import { useToast } from "@/hooks/use-toast";

// Define the structure for stored music requests (adjust if needed based on music-request-form.tsx)
type StoredMusicRequests = Record<string, string[]>; // { [tableNumber: string]: string[] }

export default function AdminMusicRequestsPage() {
    const [requests, setRequests] = useState<StoredMusicRequests>({});
    const { toast } = useToast();

    // Load requests from localStorage
    const loadRequests = () => {
        const stored = localStorage.getItem('musicRequests');
        if (stored) {
            try {
                const parsedRequests: StoredMusicRequests = JSON.parse(stored);
                if (typeof parsedRequests === 'object' && parsedRequests !== null) {
                     // Sort requests by table number (numeric part)
                    const sortedEntries = Object.entries(parsedRequests).sort(([tableA], [tableB]) => {
                        const numA = parseInt(tableA.match(/\d+/)?.join('') || '0');
                        const numB = parseInt(tableB.match(/\d+/)?.join('') || '0');
                        return numA - numB;
                    });
                    setRequests(Object.fromEntries(sortedEntries));
                } else {
                    localStorage.removeItem('musicRequests'); // Clear invalid data
                    setRequests({});
                }
            } catch (error) {
                console.error("Failed to parse music requests from localStorage", error);
                localStorage.removeItem('musicRequests'); // Clear invalid data
                setRequests({});
            }
        } else {
            setRequests({}); // No requests found
        }
    };

    useEffect(() => {
        loadRequests(); // Load on initial mount
    }, []);

    // Helper to save updated requests back to localStorage
    const saveRequests = (updatedRequests: StoredMusicRequests) => {
        try {
            localStorage.setItem('musicRequests', JSON.stringify(updatedRequests));
        } catch (error) {
            console.error("Failed to save music requests to localStorage", error);
            toast({
                title: "Error",
                description: "No se pudieron guardar los cambios en las solicitudes.",
                variant: "destructive",
            });
        }
    };

    // Function to delete a specific song request
    const deleteSongRequest = (tableNumber: string, songIndex: number) => {
        const currentTableRequests = requests[tableNumber];
        if (!currentTableRequests) return;

        const songToDelete = currentTableRequests[songIndex];
        const updatedTableRequests = currentTableRequests.filter((_, index) => index !== songIndex);

        let updatedRequests = { ...requests };
        if (updatedTableRequests.length === 0) {
            delete updatedRequests[tableNumber]; // Remove table entry if no songs left
        } else {
            updatedRequests[tableNumber] = updatedTableRequests;
        }

        setRequests(updatedRequests);
        saveRequests(updatedRequests);

        toast({
            title: "Solicitud Eliminada",
            description: `"${songToDelete}" de la mesa ${tableNumber} eliminada.`,
            variant: "destructive",
        });
    };

    // Function to delete all requests for a specific table
    const deleteTableRequests = (tableNumber: string) => {
        if (!requests[tableNumber]) return;

        const updatedRequests = { ...requests };
        delete updatedRequests[tableNumber];

        setRequests(updatedRequests);
        saveRequests(updatedRequests);

        toast({
            title: "Solicitudes Eliminadas",
            description: `Todas las solicitudes de la mesa ${tableNumber} han sido eliminadas.`,
            variant: "destructive",
        });
    };

     // Function to clear all music requests
    const clearAllRequests = () => {
        setRequests({});
        localStorage.removeItem('musicRequests');
        toast({
            title: "Todas las Solicitudes Eliminadas",
            description: `Se han borrado todas las solicitudes de música.`,
            variant: "destructive",
        });
    }

    const tableEntries = Object.entries(requests);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center">
                     <Link href="/admin/dashboard" passHref legacyBehavior>
                        <Button variant="outline" size="icon" className="mr-4">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Volver al Panel</span>
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-primary flex items-center">
                        <Music className="mr-2 h-7 w-7"/>
                        Solicitudes de Música
                    </h1>
                 </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={loadRequests}>
                        <RotateCcw className="mr-2 h-4 w-4" /> Actualizar
                    </Button>
                    <Button variant="destructive" onClick={clearAllRequests} disabled={tableEntries.length === 0}>
                         <Trash2 className="mr-2 h-4 w-4" /> Borrar Todo
                    </Button>
                  </div>
            </div>

            <ScrollArea className="h-[calc(100vh-12rem)]">
                 {tableEntries.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-muted-foreground text-xl">No hay solicitudes de música pendientes.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tableEntries.map(([tableNumber, songs]) => (
                            <Card key={tableNumber} className="shadow-md flex flex-col">
                                <CardHeader className="flex flex-row justify-between items-center">
                                    <CardTitle className="text-lg">Mesa: {tableNumber}</CardTitle>
                                     <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive/80 h-7 w-7"
                                        onClick={() => deleteTableRequests(tableNumber)}
                                        aria-label={`Eliminar todas las solicitudes de la mesa ${tableNumber}`}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <Separator />
                                <CardContent className="pt-4 flex-grow">
                                    <h4 className="font-semibold mb-2">Canciones Solicitadas:</h4>
                                    <ul className="space-y-2 text-sm list-inside pl-2">
                                        {songs.map((song, index) => (
                                            <li key={`${tableNumber}-${index}`} className="flex justify-between items-center group">
                                                <span>- {song}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive/80 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => deleteSongRequest(tableNumber, index)}
                                                    aria-label={`Eliminar solicitud: ${song}`}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
