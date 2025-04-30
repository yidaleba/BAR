// src/types/menu.ts

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description?: string; // Optional description
  // quantity?: number; // Optional quantity, if needed in the future
}

export interface OrderItem extends MenuItem {
  quantity: number;
}
