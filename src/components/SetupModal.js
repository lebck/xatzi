import { html } from 'htm/preact';
import { useState } from 'preact/hooks';

export function SetupModal({ show, onStartGame }) {
  const [playerNames, setPlayerNames] = useState(Array(6).fill(''));
  const [error, setError] = useState('');

  if (!show) return null;

  const handleNameChange = (index, value) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = value;
    setPlayerNames(newPlayerNames);
  };

  const handleStartGame = () => {
    const activePlayerNames = playerNames.filter(name => name.trim() !== '');
    if (activePlayerNames.length === 0) {
      setError('Bitte gib mindestens einen Namen ein, um das Spiel zu starten.');
    } else {
      setError('');
      onStartGame(activePlayerNames);
    }
  };

  return html`
    <div class="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center p-4 z-50">
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-lg shadow-2xl border-2 border-purple-500">
        <h3 class="text-2xl font-bold text-purple-300 mb-4 text-center">Spieler-Setup</h3>
        <p class="text-gray-300 mb-6 text-center">Gib die Namen der Spieler ein (mindestens 1, maximal 6).</p>

        <div class="space-y-3">
          ${playerNames.map((name, i) => html`
            <div class="flex items-center gap-3">
              <label for="player-${i + 1}" class="text-gray-400 font-medium w-20">Spieler ${i + 1}:</label>
              <input type="text" id="player-${i + 1}" placeholder="Name (optional)"
                     class="flex-grow bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500"
                     value=${name}
                     onInput=${(e) => handleNameChange(i, e.target.value)}
              />
            </div>
          `)}
        </div>

        <button onClick=${handleStartGame}
                class="mt-8 w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg shadow-lg transition transform active:scale-95">
          Spiel starten!
        </button>
        ${error && html`<p class="text-red-400 text-sm mt-3 text-center">${error}</p>`}
      </div>
    </div>
  `;
}