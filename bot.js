import puppeteer from 'puppeteer-core';
import { CONFIG, loadAccounts } from './config.js';
import { log, sleep, randomInt, randomDelay, shuffleArray } from './utils.js';
import { connectOrRestoreWallet } from './wallet.js';
import {
  checkFaucets,
  executeRandomSwap,
  executeRandomBond,
  executeRandomStake,
  executeRandomUnstake,
  checkLeaderboardAndStreak,
} from './actions.js';

export async function runDohmAutomation(customTxCount = null) {
  const accounts = loadAccounts();
  if (accounts.length === 0) {
    log.error('Tidak ada akun yang ditemukan! Silakan isi accounts.json atau .env');
    return false;
  }

  log.info('====================================================');
  log.info('🚀 Memulai DOHM Testnet Multi-Account Bot');
  log.info(`👥 Total Akun: ${accounts.length} Akun`);
  log.info(`🎯 Target App: ${CONFIG.appUrl}`);
  log.info(`🖥️ Headless Mode: ${CONFIG.headless}`);
  log.info(`🌐 OS Platform: ${process.platform}`);
  log.info('====================================================');

  for (let accIdx = 0; accIdx < accounts.length; accIdx++) {
    const account = accounts[accIdx];
    log.info(`\n\x1b[36m====================================================\x1b[0m`);
    log.info(`🔄 [AKUN ${accIdx + 1}/${accounts.length}] Memproses Akun: "${account.name}"`);
    log.info(`\x1b[36m====================================================\x1b[0m`);

    let browser;
    try {
      browser = await puppeteer.launch({
        executablePath: CONFIG.executablePath,
        headless: CONFIG.headless ? 'new' : false,
        defaultViewport: { width: 1280, height: 800 },
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process',
          '--no-first-run',
          '--no-zygote',
        ],
      });

      const pages = await browser.pages();
      const page = pages.length > 0 ? pages[0] : await browser.newPage();

      // 1. Restore / Connect Wallet untuk Akun ini
      const connected = await connectOrRestoreWallet(page, account);
      if (!connected) {
        log.error(`[${account.name}] Gagal menghubungkan wallet. Lanjut ke akun berikutnya.`);
        await browser.close();
        continue;
      }

      // 2. Faucet Check
      await checkFaucets(page);
      await randomDelay(CONFIG.minDelaySec, CONFIG.maxDelaySec);

      // 3. Tentukan jumlah aksi acak untuk akun ini
      const totalActions = customTxCount || randomInt(CONFIG.minTxPerRun, CONFIG.maxTxPerRun);
      log.random(`[${account.name}] Siklus ini akan menjalankan ${totalActions} transaksi acak.`);

      // Pool aksi yang tersedia (Bond, Stake, Swap, Unstake)
      const actionPool = [
        { name: 'Swap frBTC -> DΦHM', run: executeRandomSwap },
        { name: 'Bond frBTC (Mint DΦHM)', run: executeRandomBond },
        { name: 'Stake DΦHM', run: executeRandomStake },
        { name: 'Bond frBTC (Mint DΦHM)', run: executeRandomBond },
        { name: 'Stake DΦHM', run: executeRandomStake },
        { name: 'Unstake sDΦHM', run: executeRandomUnstake },
      ];

      // Pilih aksi secara acak dan acak urutannya
      const selectedActions = [];
      for (let i = 0; i < totalActions; i++) {
        const randomIndex = randomInt(0, actionPool.length - 1);
        selectedActions.push(actionPool[randomIndex]);
      }
      const randomizedPlan = shuffleArray(selectedActions);

      log.info(`[${account.name}] Rencana aksi: ${randomizedPlan.map((a) => a.name).join(' -> ')}`);

      // 4. Eksekusi setiap transaksi dengan jeda waktu alami
      let successCount = 0;
      for (let i = 0; i < randomizedPlan.length; i++) {
        const action = randomizedPlan[i];
        log.step(i + 1, `${action.name} (${account.name})`);

        const success = await action.run(page);
        if (success) successCount++;

        // Jeda acak antar transaksi jika bukan aksi terakhir
        if (i < randomizedPlan.length - 1) {
          await randomDelay(CONFIG.minDelaySec, CONFIG.maxDelaySec);
        }
      }

      // 5. Cek Leaderboard dan Streak
      await sleep(3000);
      await checkLeaderboardAndStreak(page);

      log.success(`[${account.name}] Transaksi selesai: (${successCount}/${totalActions} berhasil)`);
    } catch (err) {
      log.error(`[${account.name}] Terjadi error: ${err.message}`);
    } finally {
      if (browser) {
        await sleep(2000);
        await browser.close();
      }
    }

    // Jeda acak sebelum berganti ke akun berikutnya (jika ada lebih dari 1 akun)
    if (accIdx < accounts.length - 1) {
      log.random(`Menunggu jeda antar akun sebelum memproses akun berikutnya...`);
      await randomDelay(CONFIG.accountDelayMin, CONFIG.accountDelayMax);
    }
  }

  log.success(`\n🎉 Semua akun (${accounts.length} Akun) telah selesai diproses dalam siklus ini!`);
  return true;
}
