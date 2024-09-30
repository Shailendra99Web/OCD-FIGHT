import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import IntervalWrapper from "@/components/IntervalWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "OCD FIGHT",
  description: "An Easier way to Tracker your OCD",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      {/* To store setInterval in Redux store */}
      <StoreProvider>
        <body className={`${inter.className}`}>
          <div className="">
            {/* To store Intervals from localStorage and set theme before rendering other components */}
            <IntervalWrapper>
              {children}
            </IntervalWrapper>
          </div>
        </body>
      </StoreProvider>
    </html>
  );
}
