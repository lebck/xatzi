import { html } from "htm/preact";

/**
 * @param {object} props
 * @param {number} props.value
 * @param {boolean} props.isHeld
 * @param {boolean} props.isRolling
 * @param {() => void} props.onClick
 * @returns {import("preact").VNode}
 */
export function Dice({ value, isHeld, isRolling, onClick }) {
  return html`
    <div
      class="die face-${value} ${isHeld ? "held" : ""} ${isRolling
        ? "rolling"
        : ""}"
      onClick=${onClick}
    >
      ${value > 0 &&
      [...new Array(value)].map(() => html`<span class="dot"></span>`)}
    </div>
  `;
}
