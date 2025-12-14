import { html } from "htm/preact";
import { Button } from "./Button.js";

/**
 * A modal component.
 * @param {object} props - The component props.
 * @param {string} props.title - The title of the modal.
 * @param {import("preact").ComponentChildren} props.children - The modal content.
 * @param {'alert' | 'confirm'} props.type - The type of the modal.
 * @param {() => void} props.onConfirm - The function to call on confirm.
 * @param {() => void} [props.onCancel] - The function to call on cancel.
 * @param {boolean} props.show - Whether to show the modal.
 * @returns {import("preact").VNode | null}
 */
export function Modal({ title, children, type, onConfirm, onCancel, show }) {
  if (!show) return null;

  return html`
    <div
      class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-gray-800 rounded-lg p-6 w-full max-w-sm shadow-xl border border-cyan-500/50"
      >
        <h3 class="text-xl font-bold text-cyan-200 mb-4">${title}</h3>
        <div class="text-gray-300 mb-6">${children}</div>
        <div class="flex justify-end gap-3">
          ${type === "confirm" &&
          html`
            <${Button}
              onClick=${onCancel}
              class="bg-gray-600 text-white"
            >
              Abbrechen
            </${Button}>
          `}
          <${Button}
            onClick=${onConfirm}
            class="bg-cyan-600 text-white"
          >
            ${type === "confirm" ? "Bestätigen" : "OK"}
          </${Button}>
        </div>
      </div>
    </div>
  `;
}

