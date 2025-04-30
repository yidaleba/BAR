import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, Music } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] space-y-8 md:flex-row md:space-y-0 md:space-x-8">
      <Card className="w-full max-w-sm shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <ClipboardList className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-semibold">Realizar Pedido</CardTitle>
          <CardDescription>Ingresa tus datos y explora nuestro menú.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Link href="/info-pedido" passHref legacyBehavior>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Ir al Menú
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="w-full max-w-sm shadow-lg hover:shadow-xl transition-shadow">
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
  );
}
