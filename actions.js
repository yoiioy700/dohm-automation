import { log, sleep, clickByText, randomFloat, setFirstInputValue } from './utils.js';
import { CONFIG } from './config.js';

export async function checkFaucets(page) {
  log.info('Memeriksa ketersediaan Faucet testnet...');
  await page.goto(`${CONFIG.appUrl}/app/setup`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(3000);

  // Check if "Get BTC" button exists
  const btcBtn = await clickByText(page, 'Get BTC', 'button', 3000);
  if (btcBtn) {
    log.info('Klaim "Get BTC" berhasil diklik.');
    await sleep(4000);
  } else {
    log.warn('"Get BTC" belum tersedia / sedang cooldown.');
  }

  // Check if "Get frBTC" button exists
  const frbtcBtn = await clickByText(page, 'Get frBTC', 'button', 3000);
  if (frbtcBtn) {
    log.info('Klaim "Get frBTC" berhasil diklik.');
    await sleep(4000);
  } else {
    log.warn('"Get frBTC" belum tersedia / sedang cooldown.');
  }
}

export async function executeRandomSwap(page) {
  const amount = randomFloat(CONFIG.ranges.swapMin, CONFIG.ranges.swapMax, 5);
  log.info(`[SWAP] Mencoba Swap acak sebesar ${amount} frBTC -> DΦHM...`);

  await page.goto(`${CONFIG.appUrl}/app/swap`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(3000);

  const swapAvailable = await page.evaluate(() => {
    const swapBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.innerText.trim().toLowerCase().includes('swap') && !b.disabled
    );
    return !!swapBtn;
  });

  if (!swapAvailable) {
    log.warn('[SWAP] Fitur swap saat ini nonaktif / terkunci.');
    return false;
  }

  try {
    await setFirstInputValue(page, amount);
    await sleep(1500);

    const clicked = await clickByText(page, 'Swap', 'button');
    if (clicked) {
      log.info(`[SWAP] Transaksi Swap ${amount} frBTC dikirim! Menunggu konfirmasi...`);
      await sleep(5000);
      log.success(`[SWAP] Berhasil Swap ${amount} frBTC (+1 Poin harian)!`);
      return true;
    }
  } catch (err) {
    log.error(`[SWAP] Gagal: ${err.message}`);
  }
  return false;
}

export async function executeRandomBond(page) {
  const amount = randomFloat(CONFIG.ranges.bondMin, CONFIG.ranges.bondMax, 5);
  log.info(`[BOND] Mencoba Bond acak sebesar ${amount} frBTC...`);

  await page.goto(`${CONFIG.appUrl}/app/bond`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(3000);

  const bondAvailable = await page.evaluate(() => {
    const bondBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.innerText.trim().toLowerCase().includes('bond') && !b.disabled
    );
    return !!bondBtn;
  });

  if (!bondAvailable) {
    log.warn('[BOND] Fitur bond saat ini nonaktif / terkunci.');
    return false;
  }

  try {
    await setFirstInputValue(page, amount);
    await sleep(1500);

    const clicked = await clickByText(page, 'Bond', 'button');
    if (clicked) {
      log.info(`[BOND] Transaksi Bond ${amount} frBTC dikirim! Menunggu konfirmasi...`);
      await sleep(5000);
      log.success(`[BOND] Berhasil Bond ${amount} frBTC (+1 Poin per transaksi)!`);
      return true;
    }
  } catch (err) {
    log.error(`[BOND] Gagal: ${err.message}`);
  }
  return false;
}

export async function executeRandomStake(page) {
  const amount = randomFloat(CONFIG.ranges.stakeMin, CONFIG.ranges.stakeMax, 3);
  log.info(`[STAKE] Mencoba Stake acak sebesar ${amount} DΦHM...`);

  await page.goto(`${CONFIG.appUrl}/app/stake`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(3000);

  const stakeAvailable = await page.evaluate(() => {
    const stakeBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.innerText.trim().toLowerCase().includes('stake') && !b.disabled
    );
    return !!stakeBtn;
  });

  if (!stakeAvailable) {
    log.warn('[STAKE] Fitur stake saat ini nonaktif / terkunci.');
    return false;
  }

  try {
    await setFirstInputValue(page, amount);
    await sleep(1500);

    const clicked = await clickByText(page, 'Stake', 'button');
    if (clicked) {
      log.info(`[STAKE] Transaksi Stake ${amount} DΦHM dikirim! Menunggu konfirmasi...`);
      await sleep(5000);
      log.success(`[STAKE] Berhasil Stake ${amount} DΦHM (+1 Poin per transaksi)!`);
      return true;
    }
  } catch (err) {
    log.error(`[STAKE] Gagal: ${err.message}`);
  }
  return false;
}

export async function executeRandomUnstake(page) {
  const amount = randomFloat(CONFIG.ranges.unstakeMin, CONFIG.ranges.unstakeMax, 3);
  log.info(`[UNSTAKE] Mencoba Unstake acak sebesar ${amount} sDΦHM...`);

  await page.goto(`${CONFIG.appUrl}/app/stake`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(3000);

  // Click Unstake tab if available
  await clickByText(page, 'Unstake', 'button');
  await sleep(1500);

  try {
    await setFirstInputValue(page, amount);
    await sleep(1500);

    const clicked = await clickByText(page, 'Unstake', 'button');
    if (clicked) {
      log.info(`[UNSTAKE] Transaksi Unstake ${amount} sDΦHM dikirim!`);
      await sleep(5000);
      log.success(`[UNSTAKE] Berhasil Unstake ${amount} sDΦHM (+1 Poin per transaksi)!`);
      return true;
    }
  } catch (err) {
    log.error(`[UNSTAKE] Gagal: ${err.message}`);
  }
  return false;
}

export async function checkLeaderboardAndStreak(page) {
  log.info('Memeriksa status Leaderboard & Streak...');
  await page.goto(`${CONFIG.appUrl}/app/leaderboard`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(4000);

  const data = await page.evaluate(() => {
    const body = document.body.innerText;
    return {
      hasStreak: body.includes('streak') || body.includes('Streak'),
      fullText: body.slice(0, 300),
    };
  });

  log.info(`Ringkasan: ${data.fullText.replace(/\n+/g, ' ')}`);
}
