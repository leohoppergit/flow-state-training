export function registerServiceWorker() {
  const isLocalDev = ["localhost", "127.0.0.1"].includes(window.location.hostname);

  if (!("serviceWorker" in navigator) || isLocalDev) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // A failed registration should never block the workout UI.
    });
  });
}
