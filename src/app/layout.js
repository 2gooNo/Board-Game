import { Inter, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  variable: "--font-display",
});

export const metadata = {
  title: "Board Game — Race to 100",
  description: "Хоёр тоглогчийн шоотой ширээний тоглоом",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${inter.variable} ${cinzel.variable}`}>
        {children}
      </body>
    </html>
  );
}
