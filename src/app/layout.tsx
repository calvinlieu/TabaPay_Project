import "./globals.css";
import Nav from "../components/Nav";

export const metadata = { title: "TabaPay Project" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main style={{ padding: 16 }}>{children}</main>
      </body>
    </html>
  );
}
