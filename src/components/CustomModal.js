import { html } from "htm/preact";
import { Modal } from "./ui/Modal.js";

/**
 * A custom modal component that wraps the base Modal component.
 * @param {object} props - The component props.
 * @param {string} props.title - The title of the modal.
 * @param {string} props.content - The content of the modal.
 * @param {'alert' | 'confirm'} props.type - The type of the modal.
 * @param {() => void} props.onConfirm - The function to call on confirm.
 * @param {() => void} props.onCancel - The function to call on cancel.
 * @param {boolean} props.show - Whether to show the modal.
 * @returns {import("preact").VNode | null}
 */
export function CustomModal({
  title,
  content,
  type,
  onConfirm,
  onCancel,
  show,
}) {
  return html`
    <${Modal}
      title=${title}
      type=${type}
      onConfirm=${onConfirm}
      onCancel=${onCancel}
      show=${show}
    >
      <p>${content}</p>
    </${Modal}>
  `;
}
