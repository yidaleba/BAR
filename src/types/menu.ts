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

// Define the structure of a placed order (including user info and timestamp)
export interface PlacedOrder {
  id: string; // Unique ID for the order
  userName: string;
  tableNumber: string;
  items: OrderItem[];
  total: string;
  timestamp: number; // Use timestamp for sorting/display
  status: 'active' | 'completed'; // Add status field
}
