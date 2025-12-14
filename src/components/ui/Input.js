import { html } from "htm/preact";

/**
 * A simple input component.
 * @param {object} props - The component props.
 * @param {string} props.id - The input ID.
 * @param {string} props.placeholder - The input placeholder.
 * @param {string} props.value - The input value.
 * @param {(value: string) => void} props.onInput - The function to call on input.
 * @param {string} [props.class=''] - Additional CSS classes.
 * @returns {import("preact").VNode}
 */
export function Input({
  id,
  placeholder,
  value,
  onInput,
  class: className = "",
}) {
  const baseClasses =
    "bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500";
  const combinedClasses = `${baseClasses} ${className}`;

  return html`
    <input
      type="text"
      id=${id}
      placeholder=${placeholder}
      class=${combinedClasses}
      value=${value}
      onInput=${(e) => onInput(e.target.value)}
    />
  `;
}
