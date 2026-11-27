import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import ChildrenWrapper from "@/components/ChildrenWrapper";
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "OCD FIGHT",
  description: "An Easier way to Tracker your OCD",
  generator: "Next.js",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      {/* <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head> */}
      <body className={`${inter.className}`}>
        {/* Redux store, to store Intervals. */}
        <StoreProvider>
          <div className="">
            {/* To store Intervals from localStorage and set theme before rendering other components */}
            <ChildrenWrapper>
              {children}
            </ChildrenWrapper>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
