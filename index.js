import { runDohmAutomation } from './bot.js';
import { CONFIG } from './config.js';
import { log, sleep } from './utils.js';

async function main() {
  const args = process.argv.slice(2);
  const isOnce = args.includes('--once') || args.includes('-o');
  const txIdx = args.indexOf('--tx');
  const customTxCount = txIdx !== -1 && args[txIdx + 1] ? parseInt(args[txIdx + 1], 10) : null;

  if (isOnce || customTxCount) {
    await runDohmAutomation(customTxCount);
    process.exit(0);
  }

  log.banner();
  log.info(`Mode \x1b[32mAuto-Loop Aktif\x1b[0m (Interval: Setiap ${CONFIG.intervalHours} Jam)`);

  while (true) {
    try {
      await runDohmAutomation(customTxCount);
    } catch (err) {
      log.error(`Unhandled cycle error: ${err.message}`);
    }

    const waitMs = CONFIG.intervalHours * 60 * 60 * 1000;
    const nextRun = new Date(Date.now() + waitMs).toLocaleTimeString('id-ID');
    log.info(`Siklus selesai. Tidur selama ${CONFIG.intervalHours} jam (Siklus berikutnya: \x1b[33m${nextRun}\x1b[0m)...`);
    await sleep(waitMs);
  }
}

main().catch((err) => {
  log.error(`Fatal error: ${err.message}`);
  process.exit(1);
});
