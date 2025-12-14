import { html } from "htm/preact";
import { Button } from "./Button.js";
import { Dice } from "./Dice.js";

/**
 * @param {object} props
 * @param {string} props.currentPlayerName
 * @param {number[]} props.diceValues
 * @param {boolean[]} props.heldDice
 * @param {boolean} props.isRolling
 * @param {(index: number) => void} props.toggleHold
 * @param {number} props.rollCount
 * @param {() => void} props.rollDice
 * @param {() => void} props.onSkipRound
 * @returns {import("preact").VNode}
 */
export function DiceArena({
  currentPlayerName,
  diceValues,
  heldDice,
  isRolling,
  toggleHold,
  rollCount,
  rollDice,
  onSkipRound,
}) {
  return html`
    <div class="bg-gray-800 rounded-xl p-4 shadow-inner mb-4">
      <!-- Turn Indicator -->
      <div class="text-lg font-bold text-center mb-2">
        ${
          currentPlayerName
            ? html`<span class="text-cyan-400">${currentPlayerName}</span> ist
                am Zug.`
            : ""
        }
      </div>

      <div class="flex justify-center gap-3 md:gap-6 mb-4">
        ${diceValues.map(
          (val, idx) => html`
            <${Dice}
              value=${val}
              isHeld=${heldDice[idx]}
              isRolling=${isRolling}
              onClick=${() => toggleHold(idx)}
            />
          `,
        )}
      </div>

      <div class="flex flex-col items-center gap-2">
        <div
          class="text-cyan-400 font-mono font-bold text-lg ${
            rollCount >= 3 ? "text-red-400" : ""
          }"
        >
          Wurf: ${rollCount} / 3
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-3 w-full max-w-md justify-center">
          <${Button}
            onClick=${rollDice}
            disabled=${rollCount >= 3 || isRolling}
            class="flex-grow bg-cyan-600 text-white"
          >
            Würfeln
          </${Button}>
          <${Button}
            onClick=${onSkipRound}
            class="bg-gray-600 text-gray-200"
          >
            Runde überspringen
          </${Button}>
        </div>

        <p class="text-xs text-gray-400 mt-2">
          Klicke Würfel an, um sie zu behalten (grüner Rand).
        </p>
      </div>
    </div>
  `;
}
