'use client'
import MainCounter from "@/components/MainCounter";
import { useEffect } from "react";

export default function Home() {

  // useEffect(() => {
  //   if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  //     window.addEventListener('load', () => {
  //       navigator.serviceWorker.register('/sw.js')
  //         .then(registration => {
  //           console.log('Service Worker registered with scope: ', registration.scope);
  //         })
  //         .catch(error => {
  //           console.error('Service Worker registration failed:', error);
  //         });
  //     });
  //   }
  // }, []);

  return (
    <>
      {<MainCounter />}
    </>
  );
}

