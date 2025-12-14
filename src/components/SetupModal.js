import { html } from "htm/preact";
import { useState } from "preact/hooks";
import { Button } from "./ui/Button.js";
import { Input } from "./ui/Input.js";

/**
 * The setup modal component for starting a new game.
 * @param {object} props - The component props.
 * @param {boolean} props.show - Whether to show the modal.
 * @param {(playerNames: string[]) => void} props.onStartGame - Function to start the game.
 * @returns {import("preact").VNode | null}
 */
export function SetupModal({ show, onStartGame }) {
  const [playerNames, setPlayerNames] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");

  if (!show) return null;

  /**
   * Handles changes to the player name input fields.
   * @param {number} index - The index of the player name to change.
   * @param {string} value - The new value of the input field.
   */
  const handleNameChange = (index, value) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = value;
    setPlayerNames(newPlayerNames);
  };

  const handleStartGame = () => {
    const activePlayerNames = playerNames.filter((name) => name.trim() !== "");
    if (activePlayerNames.length === 0) {
      setError(
        "Bitte gib mindestens einen Namen ein, um das Spiel zu starten.",
      );
    } else {
      setError("");
      onStartGame(activePlayerNames);
    }
  };

  return html`
    <div
      class="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-gray-800 rounded-lg p-6 w-full max-w-lg shadow-2xl border-2 border-purple-500"
      >
        <h3 class="text-2xl font-bold text-purple-300 mb-4 text-center">
          Spieler-Setup
        </h3>
        <p class="text-gray-300 mb-6 text-center">
          Gib die Namen der Spieler ein (mindestens 1, maximal 6).
        </p>

        <div class="space-y-3">
          ${playerNames.map(
            (name, i) => html`
              <div class="flex items-center gap-3">
                <label
                  for="player-${i + 1}"
                  class="text-gray-400 font-medium w-20"
                  >Spieler ${i + 1}:</label
                >
                <${Input}
                  id="player-${i + 1}"
                  placeholder="Name (optional)"
                  class="flex-grow"
                  value=${name}
                  onInput=${(value) => handleNameChange(i, value)}
                />
              </div>
            `,
          )}
        </div>

        <${Button}
          onClick=${handleStartGame}
          class="mt-8 w-full bg-purple-600 text-white py-3"
        >
          Spiel starten!
        </${Button}>
        ${
          error &&
          html`<p class="text-red-400 text-sm mt-3 text-center">${error}</p>`
        }
      </div>
    </div>
  `;
}
