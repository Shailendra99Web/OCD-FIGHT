'use client'
import MainCounter from "@/components/MainCounter";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    console.log('sw.js register fu')
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      console.log('sw.js register fu 2')
      window.addEventListener('load', () => {
      console.log('sw.js register fu 3 after load')
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('Service Worker registered with scope: ', registration.scope);
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  return (
    <>
      {<MainCounter />}
    </>
  );
}

