// app/layout.tsx
import "@/styles/global.css";
import { Open_Sans } from "next/font/google";

const open_sans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = { title: "BlueMonsterCase", description: "Loja" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`min-h-screen flex flex-col ${open_sans.className}`}>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
