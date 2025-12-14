import { html } from 'htm/preact';
import { useState, useEffect } from 'preact/hooks';
import { categories } from './utils/constants.js';
import { calculateCategoryScore } from './utils/gameLogic.js'; // Import the utility function
import { CustomModal } from './components/CustomModal.js';
import { SetupModal } from './components/SetupModal.js';
import { DiceSection } from './components/DiceSection.js';
import { ScoreSheet } from './components/ScoreSheet.js';

export function App() {
  // --- GAME STATE DYNAMISCH ---
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showSetup, setShowSetup] = useState(true); // Control visibility of setup modal

  // --- GAME STATE WÜRFEL ---
  const [diceValues, setDiceValues] = useState([1, 1, 1, 1, 1]);
  const [heldDice, setHeldDice] = useState([false, false, false, false, false]);
  const [rollCount, setRollCount] = useState(0);
  const [isRolling, setIsRolling] = useState(false);

  // --- MODAL STATE ---
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [modalType, setModalType] = useState('alert');
  const [modalCallback, setModalCallback] = useState(null);

  // --- MODAL FUNCTIONS ---
  const showModal = (title, content, type = 'alert', callback = null) => {
    setModalTitle(title);
    setModalContent(content);
    setModalType(type);
    setModalCallback(() => callback); // Store the callback
    setModalShow(true);
  };

  const handleModalConfirm = () => {
    setModalShow(false);
    if (modalCallback) {
      modalCallback();
    }
  };

  const handleModalCancel = () => {
    setModalShow(false);
  };

  // --- GAME LOGIC FUNCTIONS ---

  // Helper to calculate totals for a given player (replicated from ScoreSheet for state updates)
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

  const checkGameOver = (currentPlayers) => {
    const totalCategories = categories.filter(c => c.id !== 'separator').length;
    const allPlayersFinished = currentPlayers.every(player => {
      const scoredCount = Object.values(player.scores).filter(s => s > 0).length;
      return scoredCount >= totalCategories;
    });

    if (allPlayersFinished) {
      // Find the winner
      let winner = currentPlayers[0];
      let isTie = false;

      for (let i = 1; i < currentPlayers.length; i++) {
        if (currentPlayers[i].totals.grand_total > winner.totals.grand_total) {
          winner = currentPlayers[i];
          isTie = false;
        } else if (currentPlayers[i].totals.grand_total === winner.totals.grand_total) {
          isTie = true;
        }
      }

      const finalScores = currentPlayers.map(p => `${p.name}: ${p.totals.grand_total}`).join(', ');

      let winnerMessage;
      if (isTie) {
        const tiedPlayers = currentPlayers.filter(p => p.totals.grand_total === winner.totals.grand_total).map(p => p.name).join(' und ');
        winnerMessage = `Unentschieden! ${tiedPlayers} teilen sich den Sieg mit ${winner.totals.grand_total} Punkten.`;
      } else {
        winnerMessage = `${winner.name} gewinnt mit ${winner.totals.grand_total} Punkten!`;
      }

      showModal("Spiel beendet!", `${winnerMessage}\n\nEndergebnisse: ${finalScores}`);
      return true;
    }
    return false;
  };

  const switchPlayer = () => {
    // Before switching, calculate all players' totals to check for game over
    const updatedPlayersForCheck = players.map(p => ({
        ...p,
        totals: calculatePlayerTotals(p)
    }));
    setPlayers(updatedPlayersForCheck); // Update state with latest totals

    if (checkGameOver(updatedPlayersForCheck)) return;

    const nextPlayerIdx = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextPlayerIdx);
    setRollCount(0);
    setHeldDice([false, false, false, false, false]);
    setDiceValues([1, 1, 1, 1, 1]);
    setIsRolling(false);
    showModal("Spielerwechsel", `${players[nextPlayerIdx].name} ist jetzt am Zug.`, 'alert');
  };

  const handleCategorySelect = (categoryId, playerIndex, potentialScore) => {
    // 1. Validation
    if (playerIndex !== currentPlayerIndex) {
      showModal("Achtung", "Du kannst nur für den aktuellen Spieler Punkte eintragen.");
      return;
    }
    if (rollCount === 0) {
      showModal("Achtung", "Bitte würfle zuerst, um Punkte einzutragen.");
      return;
    }
    if (players[playerIndex].scores[categoryId] > 0) {
      showModal("Achtung", "In diese Kategorie wurde bereits eingetragen.");
      return;
    }

    // 2. Update Score
    setPlayers(prevPlayers => {
      const newPlayers = [...prevPlayers];
      newPlayers[playerIndex].scores[categoryId] = potentialScore;
      newPlayers[playerIndex].totals = calculatePlayerTotals(newPlayers[playerIndex]); // Update totals
      return newPlayers;
    });

    // 3. Switch Player / Next Round
    switchPlayer();
  };

  const toggleHold = (index) => {
    if (rollCount === 0 || isRolling) {
      showModal("Achtung", "Bitte würfle zuerst, bevor du Würfel festhältst.");
      return;
    }
    setHeldDice(prevHeldDice => {
      const newHeldDice = [...prevHeldDice];
      newHeldDice[index] = !newHeldDice[index];
      return newHeldDice;
    });
  };

  const finalizeRoll = () => {
    setDiceValues(prevValues => prevValues.map((val, idx) => {
      if (heldDice[idx]) return val;
      return Math.floor(Math.random() * 6) + 1;
    }));
    setIsRolling(false);
  };

  const rollDice = () => {
    if (rollCount >= 3 || isRolling) return;

    setIsRolling(true);
    setRollCount(prevCount => prevCount + 1);

    let iterations = 0;
    const maxIterations = 10;
    const interval = setInterval(() => {
      setDiceValues(prevValues => prevValues.map((val, idx) => {
        if (heldDice[idx]) return val;
        return Math.floor(Math.random() * 6) + 1;
      }));

      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        finalizeRoll();
      }
    }, 60);
  };

  const resetGame = () => {
    setShowSetup(true); // Always show setup on full reset
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setRollCount(0);
    setDiceValues([1,1,1,1,1]);
    setHeldDice([false,false,false,false,false]);
    setIsRolling(false);
    localStorage.removeItem('yatziPlayerNames');
  };


  const startGame = (newPlayerNames) => {
    const initialPlayers = newPlayerNames.map((name, index) => ({
      id: index + 1,
      name: name,
      scores: categories.reduce((acc, cat) => cat.id !== 'separator' ? ({ ...acc, [cat.id]: 0 }) : acc, {}),
      totals: calculatePlayerTotals({
          id: index + 1,
          name: name,
          scores: categories.reduce((acc, cat) => cat.id !== 'separator' ? ({ ...acc, [cat.id]: 0 }) : acc, {}),
          totals: {} // temporary empty, will be calculated
      }) // Calculate initial totals
    }));
    setPlayers(initialPlayers);
    setCurrentPlayerIndex(0);
    setRollCount(0);
    setHeldDice([false, false, false, false, false]);
    setDiceValues([1, 1, 1, 1, 1]);
    setIsRolling(false);
    setShowSetup(false);
    localStorage.setItem('yatziPlayerNames', JSON.stringify(newPlayerNames));
  };


  // --- INITIALISIERUNG ---
  useEffect(() => {
    const storedPlayerNames = localStorage.getItem('yatziPlayerNames');
    if (storedPlayerNames) {
      try {
        const playerNames = JSON.parse(storedPlayerNames);
        if (Array.isArray(playerNames) && playerNames.length > 0) {
          // Initialize players and also calculate their initial totals
          const initialPlayers = playerNames.map((name, index) => {
            const playerTemplate = {
              id: index + 1,
              name: name,
              scores: categories.reduce((acc, cat) => cat.id !== 'separator' ? ({ ...acc, [cat.id]: 0 }) : acc, {}),
              totals: {} // Placeholder for now
            };
            playerTemplate.totals = calculatePlayerTotals(playerTemplate); // Calculate initial totals
            return playerTemplate;
          });
          setPlayers(initialPlayers);
          setShowSetup(false); // Hide setup modal if players are loaded
        }
      } catch (e) {
        console.error("Error parsing player names from localStorage", e);
        localStorage.removeItem('yatziPlayerNames'); // Clear corrupted data
      }
    }
  }, []);


  if (showSetup) {
    return html`<${SetupModal} show=${showSetup} onStartGame=${startGame} />`;
  }

  return html`
    <div id="app-container" class="w-full max-w-4xl bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
      <${DiceSection}
        diceValues=${diceValues}
        heldDice=${heldDice}
        rollCount=${rollCount}
        isRolling=${isRolling}
        currentPlayerName=${players[currentPlayerIndex]?.name}
        toggleHold=${toggleHold}
        rollDice=${rollDice}
        onSkipRound=${() => showModal('Runde überspringen', 'Möchtest du die Runde wirklich überspringen? Der aktuelle Spieler bekommt 0 Punkte für diese Runde, und der nächste Spieler ist an der Reihe.', 'confirm', switchPlayer)}
      />

      <${ScoreSheet}
        players=${players}
        currentPlayerIndex=${currentPlayerIndex}
        diceValues=${diceValues}
        rollCount=${rollCount}
        onScoreSelect=${handleCategorySelect}
        onResetGameClick=${() => showModal('Spiel zurücksetzen', 'Möchtest du das Spiel wirklich komplett neu starten und die Spieler neu definieren?', 'confirm', resetGame)}
      />
    </div>

    <${CustomModal}
      show=${modalShow}
      title=${modalTitle}
      content=${modalContent}
      type=${modalType}
      onConfirm=${handleModalConfirm}
      onCancel=${handleModalCancel}
    />
  `;
}