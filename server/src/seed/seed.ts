import dotenv from 'dotenv';
dotenv.config();

import { seedDatabase } from '../services/clientService';

async function main() {
  console.log('🚀 ClientPulse AI - Seeding Demo Data & Initializing Hindsight Banks...');
  try {
    const result = await seedDatabase(true);
    console.log('==================================================');
    console.log('✨ Seed Result:', result.message);
    console.log(`📊 Clients: ${result.clientsCount}`);
    console.log(`📝 Interactions: ${result.interactionsCount}`);
    console.log(`🧠 Retained in Hindsight: ${result.hindsightRetainedCount}`);
    console.log(`🔗 Hindsight Connected: ${result.hindsightConnected}`);
    console.log('==================================================');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

main();
