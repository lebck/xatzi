import { html } from 'htm/preact';
import { categories } from '../utils/constants.js';
import { calculateCategoryScore } from '../utils/gameLogic.js';

export function ScoreSheet({
  players,
  currentPlayerIndex,
  diceValues,
  rollCount,
  onScoreSelect,
  onResetGameClick
}) {

  // Helper to calculate totals for a given player
  const calculatePlayerTotals = (player) => {
    let upperSum = 0;
    let lowerSum = 0;

    categories.forEach(cat => {
      if (cat.section === 'upper') {
        upperSum += player.scores[cat.id] || 0;
      } else if (cat.section === 'lower' && cat.id !== 'separator') {
        lowerSum += player.scores[cat.id] || 0;
      }
    });

    const bonus = upperSum >= 63 ? 35 : 0;
    const grandTotal = upperSum + bonus + lowerSum;

    return {
      upper_sum: upperSum,
      bonus: bonus,
      lower_sum: lowerSum,
      grand_total: grandTotal
    };
  };

  return html`
    <div class="p-2 md:p-6 overflow-x-auto">
      <p class="text-gray-400 text-center text-sm mb-4">Klicke auf eine freie Zelle des aktuellen Spielers, um die
        berechnete Punktzahl einzutragen.</p>
      <table class="min-w-full text-sm text-left text-gray-400">
        <thead class="text-xs text-gray-200 uppercase bg-gray-700">
        <tr id="score-header-row">
          <th scope="col" class="py-3 px-2 md:px-4 w-40 md:w-48 sticky left-0 bg-gray-700 z-10">Kategorie</th>
          ${players.map((player, index) => html`<th scope="col" class="py-3 px-2 text-center ${index === currentPlayerIndex ? 'score-cell-active' : ''}" key=${player.id}>${player.name}</th>`)}
        </tr>
        </thead>
        <tbody id="score-body" class="divide-y divide-gray-700">
        ${categories.map((cat, index) => {
          if (cat.section === 'separator') {
            return html`
              <tr class="bg-gray-700 text-gray-300 font-bold text-xs uppercase tracking-wider" key=${cat.id}>
                <td class="py-2 px-4 sticky left-0 bg-gray-700 z-10 border-t border-gray-600">${cat.name}</td>
                <td class="py-2 px-4 border-t border-gray-600" colspan="${players.length}"></td>
              </tr>
            `;
          }
          const rowBgClass = (index % 2) ? 'bg-gray-900' : 'bg-gray-800';
          return html`
            <tr class="category-row text-gray-300" key=${cat.id}>
              <td class="py-2 px-2 md:px-4 font-medium sticky left-0 ${rowBgClass} z-10 truncate border-r border-gray-700">${cat.name}</td>
              ${players.map((player, playerIndex) => {
                const isScored = player.scores[cat.id] > 0;
                const finalScore = player.scores[cat.id];
                const isCurrentPlayerTurn = (playerIndex === currentPlayerIndex);
                const potentialScore = calculateCategoryScore(cat.id, diceValues);

                let cellClasses = "py-1 px-1 text-center h-full border-r border-gray-700/50 relative";
                if (isScored) {
                  cellClasses += " bg-gray-900/50 text-gray-500 cursor-not-allowed";
                } else if (isCurrentPlayerTurn && rollCount > 0) {
                  cellClasses += " text-gray-600 cursor-pointer group hover:bg-cyan-900/50";
                } else {
                  cellClasses += " text-gray-600";
                }

                return html`
                  <td key=${player.id + '_' + cat.id}
                      class="${cellClasses}"
                      onClick=${isCurrentPlayerTurn && !isScored && rollCount > 0 ? () => onScoreSelect(cat.id, playerIndex, potentialScore) : null}>

                    <!-- Potenzielle Punktzahl (wird nach dem Würfeln eingeblendet) -->
                    ${isCurrentPlayerTurn && !isScored && rollCount > 0 && html`
                      <div class="potential-score text-cyan-400 text-base font-bold absolute inset-0 flex items-center justify-center bg-cyan-900/70 rounded transition duration-150">
                        → ${potentialScore}
                      </div>
                    `}

                    <!-- Endgültige/Eingetragene Punktzahl -->
                    <div class="final-score text-base ${isCurrentPlayerTurn && !isScored && rollCount > 0 ? 'opacity-0 group-hover:opacity-0' : ''}">
                      ${finalScore > 0 ? finalScore : '-'}
                    </div>
                  </td>
                `;
              })}
            </tr>
          `;
        })}
        </tbody>

        <!-- FOOTER TOTALS -->
        <tfoot class="font-semibold bg-gray-700 border-t-4 border-gray-600">
          <tr class="text-cyan-200 text-xs md:text-sm">
            <td class="py-2 px-4 sticky left-0 bg-gray-700 z-10">Summe Oben</td>
            ${players.map((player, index) => html`<td key=${player.id + '_upper_sum'} class="py-2 px-2 text-center">${calculatePlayerTotals(player).upper_sum}</td>`)}
          </tr>
          <tr class="text-green-400 text-xs md:text-sm">
            <td class="py-2 px-4 sticky left-0 bg-gray-700 z-10">Bonus (≥ 63: +35)</td>
            ${players.map((player, index) => html`<td key=${player.id + '_bonus'} class="py-2 px-2 text-center">${calculatePlayerTotals(player).bonus}</td>`)}
          </tr>
          <tr class="text-slate-200 bg-gray-800 border-t border-gray-600 text-xs md:text-sm">
            <td class="py-2 px-4 sticky left-0 bg-gray-800 z-10">Summe Unten</td>
            ${players.map((player, index) => html`<td key=${player.id + '_lower_sum'} class="py-2 px-2 text-center">${calculatePlayerTotals(player).lower_sum}</td>`)}
          </tr>
          <tr class="text-cyan-200 font-extrabold text-lg md:text-xl bg-gray-700 border-t-4 border-cyan-200">
            <td class="py-4 px-4 sticky left-0 bg-gray-700 z-10">GESAMT</td>
            ${players.map((player, index) => html`<td key=${player.id + '_grand_total'} class="py-2 px-2 text-center">${calculatePlayerTotals(player).grand_total}</td>`)}
          </tr>
        </tfoot>
      </table>

      <button onClick=${onResetGameClick}
              class="mt-8 w-full bg-red-900/50 hover:bg-red-800 text-red-200 border border-red-800 py-3 rounded-lg font-bold transition duration-150 text-sm">
        Spiel komplett zurücksetzen und Spieler neu definieren
      </button>
    </div>
  `;
}