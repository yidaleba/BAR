// src/components/inventory-table.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import type { MenuItem } from '@/types/menu';
import { ScrollArea } from "@/components/ui/scroll-area";

interface InventoryTableProps {
  items: MenuItem[];
  onDeleteItem: (itemId: number) => void;
}

export default function InventoryTable({ items, onDeleteItem }: InventoryTableProps) {
  return (
    <ScrollArea className="h-[60vh] border rounded-md">
      <Table>
        <TableHeader className="sticky top-0 bg-card z-10">
          <TableRow>
            <TableHead className="w-[250px]">Nombre</TableHead> {/* Adjusted width */}
            {/* Category column removed */}
             <TableHead>Descripción</TableHead> {/* Added Description */}
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-right w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 && (
            <TableRow>
              {/* Updated colspan */}
              <TableCell colSpan={4} className="h-24 text-center">
                No hay productos en esta categoría.
              </TableCell>
            </TableRow>
          )}
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
               {/* Category cell removed */}
               <TableCell className="text-muted-foreground">{item.description || '-'}</TableCell> {/* Show description or dash */}
              <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive/80"
                  onClick={() => onDeleteItem(item.id)}
                  aria-label={`Eliminar ${item.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
