export function calculateCategoryScore(categoryId, dice) {
    const counts = {};
    let sum = 0;
    for (const d of dice) {
        counts[d] = (counts[d] || 0) + 1;
        sum += d;
    }
    const values = Object.values(counts);
    const sortedDice = [...dice].sort((a, b) => a - b);

    switch (categoryId) {
        // Oberer Teil: Summe der gleichen Würfel
        case 'ones':
            return counts[1] * 1 || 0;
        case 'twos':
            return counts[2] * 2 || 0;
        case 'threes':
            return counts[3] * 3 || 0;
        case 'fours':
            return counts[4] * 4 || 0;
        case 'fives':
            return counts[5] * 5 || 0;
        case 'sixes':
            return counts[6] * 6 || 0;

        // Unterer Teil
        case 'three_of_a_kind':
            return values.some(v => v >= 3) ? sum : 0;
        case 'four_of_a_kind':
            return values.some(v => v >= 4) ? sum : 0;
        case 'full_house':
            return (values.includes(3) && values.includes(2)) ? 25 : 0;

        case 'small_straight':
            // Suche nach Sequenzen 1-2-3-4, 2-3-4-5, oder 3-4-5-6
            const uniqueStr = [...new Set(sortedDice)].join('');
            if (uniqueStr.includes('1234') || uniqueStr.includes('2345') || uniqueStr.includes('3456')) return 30;
            return 0;

        case 'large_straight':
            // Suche nach Sequenzen 1-2-3-4-5 oder 2-3-4-5-6
            if ([...new Set(sortedDice)].length === 5) {
                if (sortedDice[0] === 1 && sortedDice[4] === 5) return 40; // 12345
                if (sortedDice[0] === 2 && sortedDice[4] === 6) return 40; // 23456
            }
            return 0;

        case 'yatzi':
            return values.includes(5) ? 50 : 0;

        case 'chance':
            return sum;

        default:
            return 0;
    }
}