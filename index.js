import { runDohmAutomation } from './bot.js';
import { CONFIG } from './config.js';
import { log, sleep, C } from './utils.js';

async function countdownTimer(totalSeconds) {
  let remaining = totalSeconds;
  while (remaining > 0) {
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    process.stdout.write(
      `\r  ${C.dim}⏰ [AUTO-LOOP]${C.reset} Menunggu siklus berikutnya: ${C.brightYellow}${C.bold}${timeStr}${C.reset} ${C.dim}(Tekan Ctrl+C untuk berhenti)${C.reset} `
    );

    await sleep(1000);
    remaining--;
  }
  process.stdout.write('\n');
}

async function main() {
  const args = process.argv.slice(2);
  const isOnce = args.includes('--once') || args.includes('-o');
  const txIdx = args.indexOf('--tx');
  const customTxCount = txIdx !== -1 && args[txIdx + 1] ? parseInt(args[txIdx + 1], 10) : null;

  if (isOnce || customTxCount) {
    await runDohmAutomation(customTxCount);
    process.exit(0);
  }

  while (true) {
    try {
      await runDohmAutomation(customTxCount);
    } catch (err) {
      log.error(`Unhandled error dalam siklus: ${err.message}`);
    }

    const waitSeconds = CONFIG.intervalHours * 3600;
    console.log(`\n  ${C.brightCyan}⏳ Siklus selesai.${C.reset} Memulai penghitung waktu tidur ${CONFIG.intervalHours} jam...`);
    await countdownTimer(waitSeconds);
  }
}

main().catch((err) => {
  log.error(`Fatal error: ${err.message}`);
  process.exit(1);
});
