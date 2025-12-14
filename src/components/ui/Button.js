import { html } from "htm/preact";

/**
 * A simple button component.
 * @param {object} props - The component props.
 * @param {import("preact").ComponentChildren} props.children - The button content.
 * @param {() => void} props.onClick - The function to call on click.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {string} [props.class=''] - Additional CSS classes.
 * @returns {import("preact").VNode}
 */
export function Button({
  children,
  onClick,
  disabled = false,
  class: className = "",
}) {
  const baseClasses =
    "font-bold py-2 px-4 rounded-lg shadow-lg transition transform";
  const disabledClasses = "opacity-50 cursor-not-allowed";
  const enabledClasses = "hover:bg-opacity-80 active:scale-95";

  const combinedClasses = `${baseClasses} ${className} ${disabled ? disabledClasses : enabledClasses}`;

  return html`
    <button onClick=${onClick} disabled=${disabled} class=${combinedClasses}>
      ${children}
    </button>
  `;
}
