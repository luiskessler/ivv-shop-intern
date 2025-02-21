export interface Product {
  id: string;
  name: string;
  imageURLs: string[]; // imageURLs now match with the `ImageURL` relation
  description: string;
  price: number;
  isFeatured: boolean;
  stock: number;
  category: string;
  size?: string[]; // ["XS", "S", "M", "L", "XL", "XXL"]
  colorVariant?: ColorVariant[]; // [{ name: "black", hex: "#000000", imageURL: "https://placehold.co/600x400" }]
}

export interface ColorVariant {
  name: string;
  hex: string;
  imageURL: string;
}


export interface Order {
  id: string;
  userId: number;
  products: OrderItem[]; // Linking to OrderItem rather than Product directly
  status: "open" | "completed";
  createdAt: string;
  updatedAt: string;
  paymentID: string;
  order_number: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product; // Link to Product via OrderItem relation
}

export interface SEPAQRCode {
  version: string; // "001" für die Version des QR-Codes
  encoding: string; // "1" für die Zwischenkodierung
  transferType: string; // "SCT" für SEPA Credit Transfer
  recipientName: string;
  recipientIBAN: string;
  recipientBIC?: string; // Optional
  amount?: string; // Betrag, z.B. "EUR123.45"
  currency: string; // Währung, z.B. "EUR"
  reference?: string; // Optionaler Verwendungszweck, bis zu 140 Zeichen
}

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: "admin" | "user";
  orders: Order[]; // Linking to orders
}
