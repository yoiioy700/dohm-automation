import puppeteer from 'puppeteer-core';
import { CONFIG, loadAccounts } from './config.js';
import { log, sleep, randomInt, randomDelay, shuffleArray, C } from './utils.js';
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
  console.log(`  ${C.dim}├─${C.reset} 🎯 ${C.bold}Target URL    :${C.reset} ${C.brightCyan}${CONFIG.appUrl}${C.reset}`);
  console.log(`  ${C.dim}├─${C.reset} 👥 ${C.bold}Total Akun    :${C.reset} ${C.brightYellow}${accounts.length} Akun${C.reset}`);
  console.log(`  ${C.dim}├─${C.reset} 🖥️  ${C.bold}Headless Mode :${C.reset} ${C.brightMagenta}${CONFIG.headless}${C.reset}`);
  console.log(`  ${C.dim}└─${C.reset} 🌐 ${C.bold}OS Platform   :${C.reset} ${C.brightGreen}${process.platform}${C.reset}`);

  // Tampilkan tabel akun
  log.accountsTable(accounts);

  const cycleResults = [];

  for (let accIdx = 0; accIdx < accounts.length; accIdx++) {
    const account = accounts[accIdx];
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
      log.accountCard(accIdx + 1, accounts.length, account.name, walletRes.address);

      if (!walletRes.success) {
        log.error(`Gagal menghubungkan wallet "${account.name}". Lanjut ke akun berikutnya.`);
        cycleResults.push({ name: account.name, points: 'Error', successTx: 0, totalTx: 0 });
        await browser.close();
        continue;
      }

      // 2. Faucet Check
      await checkFaucets(page);
      await randomDelay(CONFIG.minDelaySec, CONFIG.maxDelaySec, 'Jeda Verifikasi Faucet');

      // 3. Rencanakan Transaksi Acak
      totalActions = customTxCount || randomInt(CONFIG.minTxPerRun, CONFIG.maxTxPerRun);
      log.random(`Menyiapkan ${C.brightYellow}${totalActions} transaksi acak${C.reset} untuk "${account.name}".`);

      const actionPool = [
        { name: 'Swap frBTC ➜ DΦHM', run: executeRandomSwap },
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

      console.log(`\n  ${C.brightCyan}📋 Rencana Eksekusi Pipeline:${C.reset}`);
      randomizedPlan.forEach((a, i) => {
        const isLast = i === randomizedPlan.length - 1;
        const prefix = isLast ? '  └─' : '  ├─';
        console.log(`    ${C.dim}${prefix}${C.reset} ${C.dim}[#${i + 1}]${C.reset} ${C.brightWhite}${a.name}${C.reset}`);
      });

      // 4. Eksekusi setiap transaksi
      for (let i = 0; i < randomizedPlan.length; i++) {
        const action = randomizedPlan[i];
        const success = await action.run(page, i + 1, totalActions);
        if (success) successCount++;

        if (i < randomizedPlan.length - 1) {
          await randomDelay(CONFIG.minDelaySec, CONFIG.maxDelaySec, 'Jeda Antar Transaksi');
        }
      }

      // 5. Cek Leaderboard
      await sleep(2000);
      points = await checkLeaderboardAndStreak(page);

      cycleResults.push({
        name: account.name,
        points: points || '0 pts',
        successTx: successCount,
        totalTx: totalActions,
      });
    } catch (err) {
      log.error(`Terjadi error pada "${account.name}": ${err.message}`);
      cycleResults.push({ name: account.name, points: 'Error', successTx: successCount, totalTx: totalActions });
    } finally {
      if (browser) {
        await sleep(1500);
        await browser.close();
      }
    }

    // Jeda antar akun jika masih ada akun berikutnya
    if (accIdx < accounts.length - 1) {
      console.log('');
      await randomDelay(CONFIG.accountDelayMin, CONFIG.accountDelayMax, 'Jeda Pergantian Akun');
    }
  }

  // Tampilkan tabel hasil akhir seluruh akun
  log.cycleSummaryTable(cycleResults);
  console.log(`\n  ${C.brightGreen}✨ Semua akun (${accounts.length} Akun) telah selesai diproses dalam siklus ini!${C.reset}\n`);
  return true;
}
