// src/app/home-options/page.tsx
"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, Music } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HomeOptionsPage() {
    const [userName, setUserName] = useState<string | null>(null);
    const [tableNumber, setTableNumber] = useState<string | null>(null);

    useEffect(() => {
        // Retrieve user info from localStorage on client side
        const storedName = localStorage.getItem('userName');
        const storedTable = localStorage.getItem('tableNumber');
        setUserName(storedName);
        setTableNumber(storedTable);
    }, []);

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] space-y-8">
       {userName && tableNumber && (
            <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-primary">¡Hola, {userName}! (Mesa {tableNumber})</h1>
                <p className="text-muted-foreground">¿Qué te apetece hacer?</p>
            </div>
        )}
      <div className="flex flex-col md:flex-row md:space-y-0 md:space-x-8 w-full max-w-3xl">
          <Card className="flex-1 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="flex justify-center items-center mb-4">
                <ClipboardList className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl font-semibold">Realizar Pedido</CardTitle>
              <CardDescription>Explora nuestro menú y pide algo delicioso.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Link href="/menu" passHref legacyBehavior>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Ir al Menú
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="flex-1 shadow-lg hover:shadow-xl transition-shadow mt-8 md:mt-0">
            <CardHeader className="text-center">
              <div className="flex justify-center items-center mb-4">
                <Music className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl font-semibold">Pedir Música</CardTitle>
              <CardDescription>Sugiere canciones para ambientar (máx. 3 por mesa).</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
               <Link href="/pedir-musica" passHref legacyBehavior>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Solicitar Canción
                </Button>
              </Link>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
