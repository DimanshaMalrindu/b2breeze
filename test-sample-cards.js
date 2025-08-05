// Test sample business cards
import {
  initializeSampleBusinessCards,
  getBusinessCards,
  addSampleBusinessCards,
} from "./src/lib/wallet-utils";

console.log("Testing sample business cards...");

// Clear any existing data
localStorage.removeItem("businessCards");

// Initialize sample cards
initializeSampleBusinessCards();

// Check the cards
const cards = getBusinessCards();
console.log(`Initialized ${cards.length} sample business cards:`);
cards.forEach((card) => {
  console.log(`- ${card.name} (${card.company})`);
});

// Test adding more samples
addSampleBusinessCards();
const cardsAfterAdd = getBusinessCards();
console.log(`After adding samples: ${cardsAfterAdd.length} cards`);

console.log("Sample cards test completed!");
