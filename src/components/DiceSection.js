import { html } from 'htm/preact';
import { useCallback } from 'preact/hooks';

export function DiceSection({
  diceValues,
  heldDice,
  rollCount,
  isRolling,
  currentPlayerName,
  toggleHold,
  rollDice,
  onSkipRound // New prop for skipping round
}) {
  return html`
    <div class="bg-gray-700 p-6 border-b border-gray-600">
      <h1 class="text-3xl font-extrabold text-center text-cyan-200 mb-6">Xatzi</h1>

      <!-- Würfel Arena -->
      <div class="bg-gray-800 rounded-xl p-4 shadow-inner mb-4">
        <!-- Turn Indicator -->
        <div class="text-lg font-bold text-center mb-2">
          ${currentPlayerName ? html`<span class="text-cyan-400">${currentPlayerName}</span> ist am Zug.` : ''}
        </div>

        <div class="flex justify-center gap-3 md:gap-6 mb-4">
          ${diceValues.map((val, idx) => html`
            <div class="die face-${val} ${heldDice[idx] ? 'held' : ''} ${isRolling ? 'rolling' : ''}" onClick=${() => toggleHold(idx)}>
              ${[...Array(val)].map(() => html`<span class="dot"></span>`)}
            </div>
          `)}
        </div>

        <div class="flex flex-col items-center gap-2">
          <div class="text-cyan-400 font-mono font-bold text-lg ${rollCount >= 3 ? 'text-red-400' : ''}">
            Wurf: ${rollCount} / 3
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3 w-full max-w-md justify-center">
            <button onClick=${rollDice}
                    disabled=${rollCount >= 3 || isRolling}
                    class="flex-grow bg-cyan-600 ${rollCount >= 3 || isRolling ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cyan-500 active:scale-95'} text-white font-bold py-3 px-4 rounded-lg shadow-lg transition transform">
              Würfeln
            </button>
            <button onClick=${onSkipRound}
                    class="bg-gray-600 hover:bg-gray-500 text-gray-200 font-bold py-3 px-4 rounded-lg shadow-lg transition">
              Runde überspringen
            </button>
          </div>

          <p class="text-xs text-gray-400 mt-2">Klicke Würfel an, um sie zu behalten (grüner Rand).</p>
        </div>
      </div>
    </div>
  `;
}