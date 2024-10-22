export function registerServiceWorker() {
    console.log('register 1')
    if ("serviceWorker" in navigator) {
        console.log('register 2')
        window.addEventListener("load", () => {
            console.log('after load register 3')
            navigator.serviceWorker
                .register("/sw.js")
                .then((registration) => {
                    console.log("Service Worker registered with scope:", registration.scope);
                })
                .catch((error) => {
                    console.error("Service Worker registration failed:", error);
                });
        });
    }
}