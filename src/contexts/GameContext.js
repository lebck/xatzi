import { html } from "htm/preact";
import { createContext } from "preact";
import { useState, useEffect, useContext } from "preact/hooks";
import { categories } from "../utils/constants.js";
import { useModalContext } from "./ModalContext.js";

/**
 * @typedef {object} Player
 * @property {number} id - The player's ID.
 * @property {string} name - The player's name.
 * @property {Object<string, number>} scores - The player's scores for each category.
 * @property {object} totals - The player's total scores.
 * @property {number} totals.upper_sum - The sum of the upper section scores.
 * @property {number} totals.bonus - The bonus for the upper section.
 * @property {number} totals.lower_sum - The sum of the lower section scores.
 * @property {number} totals.grand_total - The grand total score.
 */

/**
 * @typedef {object} GameState
 * @property {Player[]} players - The list of players.
 * @property {number} currentPlayerIndex - The index of the current player.
 * @property {boolean} showSetup - Whether to show the setup modal.
 */

/**
 * @typedef {object} DiceState
 * @property {number[]} diceValues - The values of the dice.
 * @property {boolean[]} heldDice - Which dice are held.
 * @property {number} rollCount - The number of rolls in the current turn.
 * @property {boolean} isRolling - Whether the dice are currently rolling.
 */

/**
 * @typedef {object} GameLogic
 * @property {(player: Player) => {upper_sum: number, bonus: number, lower_sum: number, grand_total: number}} calculatePlayerTotals - Calculates the total scores for a player.
 * @property {(currentPlayers: Player[]) => boolean} checkGameOver - Checks if the game is over.
 * @property {() => void} switchPlayer - Switches to the next player.
 * @property {(categoryId: string, playerIndex: number, potentialScore: number) => void} handleCategorySelect - Handles selecting a score category.
 * @property {(index: number) => void} toggleHold - Toggles holding a die.
 * @property {() => void} rollDice - Rolls the dice.
 * @property {() => void} resetGame - Resets the game.
 * @property {(newPlayerNames: string[]) => void} startGame - Starts the game with new players.
 */

/**
 * @typedef {GameState & DiceState & GameLogic} GameContextType
 */

/**
 * Custom hook for managing game state.
 * @returns {{players: Player[], setPlayers: import("preact/hooks").StateUpdater<Player[]>, currentPlayerIndex: number, setCurrentPlayerIndex: import("preact/hooks").StateUpdater<number>, showSetup: boolean, setShowSetup: import("preact/hooks").StateUpdater<boolean>}}
 */
function useGameState() {
  const [players, setPlayers] = useState(/** @type {Player[]} */ ([]));
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showSetup, setShowSetup] = useState(true);
  return {
    players,
    setPlayers,
    currentPlayerIndex,
    setCurrentPlayerIndex,
    showSetup,
    setShowSetup,
  };
}

/**
 * Custom hook for managing dice state.
 * @returns {{diceValues: number[], setDiceValues: import("preact/hooks").StateUpdater<number[]>, heldDice: boolean[], setHeldDice: import("preact/hooks").StateUpdater<boolean[]>, rollCount: number, setRollCount: import("preact/hooks").StateUpdater<number>, isRolling: boolean, setIsRolling: import("preact/hooks").StateUpdater<boolean>}}
 */
function useDice() {
  const [diceValues, setDiceValues] = useState([1, 1, 1, 1, 1]);
  const [heldDice, setHeldDice] = useState([false, false, false, false, false]);
  const [rollCount, setRollCount] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  return {
    diceValues,
    setDiceValues,
    heldDice,
    setHeldDice,
    rollCount,
    setRollCount,
    isRolling,
    setIsRolling,
  };
}

/**
 * Custom hook for managing game logic.
 * @returns {GameContextType}
 */
function useGame() {
  const { showModal } = useModalContext();
  const {
    players,
    setPlayers,
    currentPlayerIndex,
    setCurrentPlayerIndex,
    showSetup,
    setShowSetup,
  } = useGameState();

  const {
    diceValues,
    setDiceValues,
    heldDice,
    setHeldDice,
    rollCount,
    setRollCount,
    isRolling,
    setIsRolling,
  } = useDice();

  /**
   * Calculates the total scores for a player.
   * @param {Player} player - The player to calculate totals for.
   * @returns {{upper_sum: number, bonus: number, lower_sum: number, grand_total: number}}
   */
  const calculatePlayerTotals = (player) => {
    let upperSum = 0;
    let lowerSum = 0;

    categories.forEach((cat) => {
      if (cat.section === "upper") {
        upperSum += player.scores[cat.id] || 0;
      } else if (cat.section === "lower" && cat.id !== "separator") {
        lowerSum += player.scores[cat.id] || 0;
      }
    });

    const bonus = upperSum >= 63 ? 35 : 0;
    const grandTotal = upperSum + bonus + lowerSum;

    return {
      upper_sum: upperSum,
      bonus: bonus,
      lower_sum: lowerSum,
      grand_total: grandTotal,
    };
  };

  /**
   * Checks if the game is over.
   * @param {Player[]} currentPlayers - The current list of players.
   * @returns {boolean} - True if the game is over, false otherwise.
   */
  const checkGameOver = (currentPlayers) => {
    const totalCategories = categories.filter(
      (c) => c.id !== "separator",
    ).length;
    const allPlayersFinished = currentPlayers.every((player) => {
      const scoredCount = Object.values(player.scores).filter(
        (s) => s > 0,
      ).length;
      return scoredCount >= totalCategories;
    });

    if (allPlayersFinished) {
      let winner = currentPlayers[0];
      let isTie = false;

      for (let i = 1; i < currentPlayers.length; i++) {
        if (currentPlayers[i].totals.grand_total > winner.totals.grand_total) {
          winner = currentPlayers[i];
          isTie = false;
        } else if (
          currentPlayers[i].totals.grand_total === winner.totals.grand_total
        ) {
          isTie = true;
        }
      }

      const finalScores = currentPlayers
        .map((p) => `${p.name}: ${p.totals.grand_total}`)
        .join(", ");

      let winnerMessage;
      if (isTie) {
        const tiedPlayers = currentPlayers
          .filter((p) => p.totals.grand_total === winner.totals.grand_total)
          .map((p) => p.name)
          .join(" und ");
        winnerMessage = `Unentschieden! ${tiedPlayers} teilen sich den Sieg mit ${winner.totals.grand_total} Punkten.`;
      } else {
        winnerMessage = `${winner.name} gewinnt mit ${winner.totals.grand_total} Punkten!`;
      }

      showModal(
        "Spiel beendet!",
        `${winnerMessage}\n\nEndergebnisse: ${finalScores}`,
      );
      return true;
    }
    return false;
  };

  const switchPlayer = () => {
    const updatedPlayersForCheck = players.map((p) => ({
      ...p,
      totals: calculatePlayerTotals(p),
    }));
    setPlayers(updatedPlayersForCheck);

    if (checkGameOver(updatedPlayersForCheck)) return;

    const nextPlayerIdx = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextPlayerIdx);
    setRollCount(0);
    setHeldDice([false, false, false, false, false]);
    setDiceValues([1, 1, 1, 1, 1]);
    setIsRolling(false);
    showModal(
      "Spielerwechsel",
      `${players[nextPlayerIdx].name} ist jetzt am Zug.`,
      "alert",
    );
  };

  /**
   * Handles selecting a score category for a player.
   * @param {string} categoryId - The ID of the category to score.
   * @param {number} playerIndex - The index of the player.
   * @param {number} potentialScore - The potential score for the category.
   */
  const handleCategorySelect = (categoryId, playerIndex, potentialScore) => {
    if (playerIndex !== currentPlayerIndex) {
      showModal(
        "Achtung",
        "Du kannst nur für den aktuellen Spieler Punkte eintragen.",
      );
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

    setPlayers((prevPlayers) => {
      const newPlayers = [...prevPlayers];
      newPlayers[playerIndex].scores[categoryId] = potentialScore;
      newPlayers[playerIndex].totals = calculatePlayerTotals(
        newPlayers[playerIndex],
      );
      return newPlayers;
    });

    switchPlayer();
  };

  /**
   * Toggles holding a die.
   * @param {number} index - The index of the die to toggle.
   */
  const toggleHold = (index) => {
    if (rollCount === 0 || isRolling) {
      showModal("Achtung", "Bitte würfle zuerst, bevor du Würfel festhältst.");
      return;
    }
    setHeldDice((prevHeldDice) => {
      const newHeldDice = [...prevHeldDice];
      newHeldDice[index] = !newHeldDice[index];
      return newHeldDice;
    });
  };

  const finalizeRoll = () => {
    setDiceValues((prevValues) =>
      prevValues.map((val, idx) => {
        if (heldDice[idx]) return val;
        return Math.floor(Math.random() * 6) + 1;
      }),
    );
    setIsRolling(false);
  };

  const rollDice = () => {
    if (rollCount >= 3 || isRolling) return;

    setIsRolling(true);
    setRollCount((prevCount) => prevCount + 1);

    let iterations = 0;
    const maxIterations = 10;
    const interval = setInterval(() => {
      setDiceValues((prevValues) =>
        prevValues.map((val, idx) => {
          if (heldDice[idx]) return val;
          return Math.floor(Math.random() * 6) + 1;
        }),
      );

      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        finalizeRoll();
      }
    }, 60);
  };

  const resetGame = () => {
    setShowSetup(true);
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setRollCount(0);
    setDiceValues([1, 1, 1, 1, 1]);
    setHeldDice([false, false, false, false, false]);
    setIsRolling(false);
    localStorage.removeItem("yatziPlayerNames");
  };

  /**
   * Starts the game with a new set of players.
   * @param {string[]} newPlayerNames - The names of the new players.
   */
  const startGame = (newPlayerNames) => {
    const initialPlayers = newPlayerNames.map((name, index) => ({
      id: index + 1,
      name: name,
      scores: categories.reduce(
        (acc, cat) => (cat.id === "separator" ? acc : { ...acc, [cat.id]: 0 }),
        {},
      ),
      totals: calculatePlayerTotals({
        id: index + 1,
        name: name,
        scores: categories.reduce(
          (acc, cat) =>
            cat.id === "separator" ? acc : { ...acc, [cat.id]: 0 },
          {},
        ),
        totals: {},
      }),
    }));
    setPlayers(initialPlayers);
    setCurrentPlayerIndex(0);
    setRollCount(0);
    setHeldDice([false, false, false, false, false]);
    setDiceValues([1, 1, 1, 1, 1]);
    setIsRolling(false);
    setShowSetup(false);
    localStorage.setItem("yatziPlayerNames", JSON.stringify(newPlayerNames));
  };

  // Effect to load players from localStorage
  useEffect(() => {
    const storedPlayerNames = localStorage.getItem("yatziPlayerNames");
    if (storedPlayerNames) {
      try {
        const playerNames = JSON.parse(storedPlayerNames);
        if (Array.isArray(playerNames) && playerNames.length > 0) {
          const initialPlayers = playerNames.map((name, index) => {
            const playerTemplate = {
              id: index + 1,
              name: name,
              scores: categories.reduce(
                (acc, cat) =>
                  cat.id === "separator"
                    ? acc
                    : {
                        ...acc,
                        [cat.id]: 0,
                      },
                {},
              ),
              totals: {},
            };
            playerTemplate.totals = calculatePlayerTotals(playerTemplate);
            return playerTemplate;
          });
          setPlayers(initialPlayers);
          setShowSetup(false);
        }
      } catch (e) {
        console.error("Error parsing player names from localStorage", e);
        localStorage.removeItem("yatziPlayerNames");
      }
    }
  }, []);

  return {
    players,
    currentPlayerIndex,
    diceValues,
    heldDice,
    rollCount,
    isRolling,
    showSetup,
    calculatePlayerTotals,
    checkGameOver,
    switchPlayer,
    handleCategorySelect,
    toggleHold,
    rollDice,
    resetGame,
    startGame,
    showModal,
  };
}

/**
 * @type {import("preact").Context<GameContextType>}
 */
const GameContext = createContext();

/**
 * Provides the game context to its children.
 * @param {object} props - The component props.
 * @param {import("preact").ComponentChildren} props.children - The child components.
 * @returns {import("preact").VNode}
 */
export const GameProvider = ({ children }) => {
  const game = useGame();

  return html`
    <${GameContext.Provider} value=${game}>
      ${children}
    </${GameContext.Provider}>
  `;
};

/**
 * Custom hook to use the game context.
 * @returns {GameContextType}
 */
export const useGameContext = () => useContext(GameContext);
