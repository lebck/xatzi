import { html } from "htm/preact";
import { SetupModal } from "./components/SetupModal.js";
import { DiceSection } from "./components/DiceSection.js";
import { ScoreSheet } from "./components/ScoreSheet.js";
import { useGameContext } from "./contexts/GameContext.js";
import { useModalContext } from "./contexts/ModalContext.js";

/**
 * The main application component.
 * @returns {import("preact").VNode}
 */
export function App() {
  const {
    resetGame,
    startGame,
    showSetup,
    players,
    currentPlayerIndex,
    diceValues,
    heldDice,
    rollCount,
    isRolling,
    toggleHold,
    rollDice,
    switchPlayer,
    handleCategorySelect,
  } = useGameContext();

  const { showModal } = useModalContext();

  if (showSetup) {
    return html` <${SetupModal} show onStartGame=${startGame} />`;
  }

  return html`
    <div
      id="app-container"
      class="w-full max-w-4xl bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col"
    >
      <${DiceSection}
        diceValues=${diceValues}
        heldDice=${heldDice}
        rollCount=${rollCount}
        isRolling=${isRolling}
        currentPlayerName=${players[currentPlayerIndex]?.name}
        toggleHold=${toggleHold}
        rollDice=${rollDice}
        onSkipRound=${() =>
          showModal(
            "Runde überspringen",
            "Möchtest du die Runde wirklich überspringen? Der aktuelle Spieler bekommt 0 Punkte für diese Runde, und der nächste Spieler ist an der Reihe.",
            "confirm",
            switchPlayer,
          )}
      />

      <${ScoreSheet}
        players=${players}
        currentPlayerIndex=${currentPlayerIndex}
        diceValues=${diceValues}
        rollCount=${rollCount}
        isRolling=${isRolling}
        onScoreSelect=${handleCategorySelect}
        onResetGameClick=${() =>
          showModal(
            "Spiel zurücksetzen",
            "Möchtest du das Spiel wirklich komplett neu starten und die Spieler neu definieren?",
            "confirm",
            resetGame,
          )}
      />
    </div>
  `;
}
