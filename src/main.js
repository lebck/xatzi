import { render } from "preact";
import { html } from "htm/preact";
import { GameProvider } from "./contexts/GameContext.js";
import { ModalProvider } from "./contexts/ModalContext.js";
import { App } from "./App.js";

/**
 * Renders the application to the DOM.
 */
render(html`<${ModalProvider}><${GameProvider}><${App} /></${GameProvider}></${ModalProvider}>`, document.getElementById("app"));
