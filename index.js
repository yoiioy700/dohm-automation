import { runDohmAutomation } from './bot.js';
import { CONFIG } from './config.js';
import { log, sleep } from './utils.js';

const args = process.argv.slice(2);
const isOnce = args.includes('--once') || args.includes('-o');

// Parse --tx <number> if provided
let customTx = null;
const txIndex = args.indexOf('--tx');
if (txIndex !== -1 && args[txIndex + 1]) {
  customTx = parseInt(args[txIndex + 1], 10);
}

async function main() {
  if (isOnce || customTx !== null) {
    log.info(`Menjalankan mode sekali jalan (Single Run) dengan ${customTx || 'rentang acak'} transaksi...`);
    await runDohmAutomation(customTx);
    process.exit(0);
  }

  log.info(`Menjalankan mode otomatis terjadwal (Setiap ${CONFIG.intervalHours} jam)...`);
  while (true) {
    await runDohmAutomation(customTx);
    log.info(`Tidur selama ${CONFIG.intervalHours} jam sampai siklus berikutnya...`);
    await sleep(CONFIG.intervalHours * 60 * 60 * 1000);
  }
}

main().catch((err) => {
  log.error(`Fatal error: ${err.message}`);
  process.exit(1);
});
