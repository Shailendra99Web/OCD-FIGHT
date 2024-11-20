'use client'
import MainCounter from "@/components/MainCounter";

export default function Home() {

  // useEffect(() => { 
  //   console.log('sw.js register fu');
  //   if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  //     console.log('sw.js register fu 2');
  
  //     // Check if the page has already fully loaded
  //     if (document.readyState === 'complete') {
  //       // Page already loaded, register service worker immediately
  //       navigator.serviceWorker.register('/sw.js')
  //         .then(registration => {
  //           console.log('Service Worker registered with scope: ', registration.scope);
  //         })
  //         .catch(error => {
  //           console.error('Service Worker registration failed:', error);
  //         });
  //     } else {
  //       // Otherwise, register it when the window's load event fires
  //       window.addEventListener('load', () => {
  //         console.log('sw.js register fu 3 after load');
  //         navigator.serviceWorker.register('/sw.js')
  //           .then(registration => {
  //             console.log('Service Worker registered with scope: ', registration.scope);
  //           })
  //           .catch(error => {
  //             console.error('Service Worker registration failed:', error);
  //           });
  //       });
  //     }
  //   }
  // }, []);

  return (
    <>
      {<MainCounter />}
    </>
  );
}

