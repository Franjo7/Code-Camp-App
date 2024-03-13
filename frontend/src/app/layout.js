import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Code Camp",
  description: "Aplikacija koja omogućuje korisnicima prijavu Code Camp radionice.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="max-w-6xl mx-auto border p-4">
          <Navbar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}