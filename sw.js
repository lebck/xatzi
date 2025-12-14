// Der Dateiname MUSS sw.js sein, wenn Sie ihn im Hauptverzeichnis registrieren.
// Andernfalls passen Sie den Pfad bei der Registrierung an.

// ----------------------------------------------------------------------
// 1. INSTALLATION: Der SW ist bereit zum Einsatz.
// ----------------------------------------------------------------------
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installation erfolgreich.");

  // Stellt sicher, dass der neue SW sofort aktiviert wird
  // und die alte Version (falls vorhanden) überspringt.
  // Dies ist besonders nützlich während der Entwicklung.
  self.skipWaiting();
});

// ----------------------------------------------------------------------
// 2. AKTIVIERUNG: Der SW ist aktiv und kann Anfragen abfangen.
// ----------------------------------------------------------------------
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Aktivierung erfolgreich.");

  // Übernimmt die Kontrolle über alle offenen Clients sofort
  // nach der Aktivierung.
  event.waitUntil(self.clients.claim());
});
