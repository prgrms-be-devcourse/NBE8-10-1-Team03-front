import "./globals.css";
import { CartProvider } from "@/cart/CartContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}