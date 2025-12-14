import { render } from 'preact';
import { html } from 'htm/preact';
import { App } from './App.js'; // Will create App.js next

render(html`<${App} />`, document.getElementById('app-container'));
