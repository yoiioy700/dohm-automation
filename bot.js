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

  log.banner();
  log.info(`🎯 Target URL    : \x1b[36m${CONFIG.appUrl}\x1b[0m`);
  log.info(`👥 Total Akun    : \x1b[33m${accounts.length} Akun\x1b[0m`);
  log.info(`🖥️ Mode Headless : \x1b[35m${CONFIG.headless}\x1b[0m`);
  log.info(`🌐 OS Platform   : \x1b[32m${process.platform}\x1b[0m`);

  for (let accIdx = 0; accIdx < accounts.length; accIdx++) {
    const account = accounts[accIdx];
    log.accountHeader(accIdx + 1, accounts.length, account.name);

    let browser;
    let successCount = 0;
    let totalActions = 0;
    let points = '0 pts';

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

      // 1. Restore / Connect Wallet
      const walletRes = await connectOrRestoreWallet(page, account);
      if (!walletRes.success) {
        log.error(`Gagal menghubungkan wallet "${account.name}". Lanjut ke akun berikutnya.`);
        await browser.close();
        continue;
      }

      // 2. Faucet Check
      await checkFaucets(page);
      await randomDelay(CONFIG.minDelaySec, CONFIG.maxDelaySec, 'Jeda Faucet');

      // 3. Rencanakan Transaksi Acak
      totalActions = customTxCount || randomInt(CONFIG.minTxPerRun, CONFIG.maxTxPerRun);
      log.random(`Menyiapkan \x1b[33m${totalActions} transaksi acak\x1b[0m untuk siklus ini.`);

      const actionPool = [
        { name: 'Swap frBTC -> DΦHM', run: executeRandomSwap },
        { name: 'Bond frBTC (Mint DΦHM)', run: executeRandomBond },
        { name: 'Stake DΦHM', run: executeRandomStake },
        { name: 'Bond frBTC (Mint DΦHM)', run: executeRandomBond },
        { name: 'Stake DΦHM', run: executeRandomStake },
        { name: 'Unstake sDΦHM', run: executeRandomUnstake },
      ];

      const selectedActions = [];
      for (let i = 0; i < totalActions; i++) {
        const randomIndex = randomInt(0, actionPool.length - 1);
        selectedActions.push(actionPool[randomIndex]);
      }
      const randomizedPlan = shuffleArray(selectedActions);

      console.log(`\n \x1b[36m📋 Pipeline Transaksi Terencana:\x1b[0m`);
      randomizedPlan.forEach((a, i) => {
        const isLast = i === randomizedPlan.length - 1;
        const prefix = isLast ? '  └─' : '  ├─';
        console.log(`  \x1b[90m${prefix}\x1b[0m [${i + 1}] \x1b[37m${a.name}\x1b[0m`);
      });

      // 4. Eksekusi setiap transaksi
      for (let i = 0; i < randomizedPlan.length; i++) {
        const action = randomizedPlan[i];
        const success = await action.run(page, i + 1, totalActions);
        if (success) successCount++;

        if (i < randomizedPlan.length - 1) {
          await randomDelay(CONFIG.minDelaySec, CONFIG.maxDelaySec, 'Jeda antar aksi');
        }
      }

      // 5. Cek Leaderboard
      await sleep(2000);
      points = await checkLeaderboardAndStreak(page);

      // 6. Tampilkan Ringkasan Akun
      log.summaryCard(account.name, points, successCount, totalActions);
    } catch (err) {
      log.error(`Terjadi error pada "${account.name}": ${err.message}`);
    } finally {
      if (browser) {
        await sleep(1500);
        await browser.close();
      }
    }

    // Jeda antar akun
    if (accIdx < accounts.length - 1) {
      console.log('');
      await randomDelay(CONFIG.accountDelayMin, CONFIG.accountDelayMax, 'Jeda antar akun');
    }
  }

  console.log(`\n\x1b[32m✨ Semua akun (${accounts.length} Akun) telah selesai diproses!\x1b[0m\n`);
  return true;
}
