import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import Footer from "./components/footer/Footer";
import { Toaster } from "react-hot-toast";

const Navbar = dynamic(() => import("./components/navbar/Navbar"), { ssr: false });

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Code Camp",
  description: "Aplikacija koja omogućuje korisnicima prijavu na Code Camp radionice.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="max-w-8xl mx-auto p-4">
          <Navbar />
          {children}
          <Footer />
          <Toaster position="bottom-center" />  
        </main>
      </body>
    </html>
  );
}