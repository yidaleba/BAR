// src/app/pedir-musica/page.tsx
import MusicRequestForm from '@/components/music-request-form';

export default function PedirMusicaPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-10rem)]">
      <MusicRequestForm />
    </div>
  );
}
