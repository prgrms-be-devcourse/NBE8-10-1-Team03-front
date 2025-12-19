// app/layout.tsx
import "./globals.css";
import HeaderShell from "@/components/layout/HeaderShell";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-dvh bg-white text-neutral-900">
        <HeaderShell />
        <div className="pt-14">{children}</div>
      </body>
    </html>
  );
}
