import MenuDisplay from '@/components/menu-display';

export default function MenuPage() {
  return (
    <div className="container mx-auto px-4 py-8">
       <h1 className="text-3xl font-bold text-center mb-8 text-primary">Nuestro Menú</h1>
      <MenuDisplay />
    </div>
  );
}
