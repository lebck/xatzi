import { render } from "preact";
import { html } from "htm/preact";
import { GameProvider } from "./contexts/GameContext.js";
import { ModalProvider } from "./contexts/ModalContext.js";
import { App } from "./App.js";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js") // Pfad zur sw.js
      .then((registration) => {
        console.log(
          "Service Worker Registrierung erfolgreich mit Scope:",
          registration.scope,
        );
      })
      .catch((error) => {
        console.error("Service Worker Registrierung fehlgeschlagen:", error);
      });
  });
}

render(
  html`<${ModalProvider}><${GameProvider}><${App} /></${GameProvider}></${ModalProvider}>`,
  document.getElementById("app"),
);
