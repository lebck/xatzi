import { html } from "htm/preact";
import { Button } from "./ui/Button.js";
import { Dice } from "./ui/Dice.js";

/**
 * @param {object} props - The component props.
 * @param {number[]} props.diceValues - The values of the dice.
 * @param {boolean[]} props.heldDice - Which dice are held.
 * @param {number} props.rollCount - The number of rolls in the current turn.
 * @param {boolean} props.isRolling - Whether the dice are currently rolling.
 * @param {string} props.currentPlayerName - The name of the current player.
 * @param {(index: number) => void} props.toggleHold - Function to toggle holding a die.
 * @param {() => void} props.rollDice - Function to roll the dice.
 * @param {() => void} props.onSkipRound - Function to skip the current round.
 * @returns {import("preact").VNode}
 */
export function DiceSection({
  diceValues,
  heldDice,
  rollCount,
  isRolling,
  currentPlayerName,
  toggleHold,
  rollDice,
  onSkipRound, // New prop for skipping round
}) {
  return html`
    <div class="bg-gray-700 p-6 border-b border-gray-600">
      <h1 class="text-3xl font-extrabold text-center text-cyan-200 mb-6">
        Xatzi
      </h1>

      <!-- Würfel Arena -->
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
    </div>
  `;
}
