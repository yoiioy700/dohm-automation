import { log, sleep, clickByText, randomFloat, setFirstInputValue } from './utils.js';
import { CONFIG } from './config.js';

export async function checkFaucets(page) {
  log.faucet('Memeriksa ketersediaan Faucet testnet...');
  await page.goto(`${CONFIG.appUrl}/app/setup`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(3000);

  // Check if "Get BTC" button exists
  const btcBtn = await clickByText(page, 'Get BTC', 'button', 3000);
  if (btcBtn) {
    log.faucet('Klaim \x1b[32m"Get BTC"\x1b[0m berhasil terpicu.');
    await sleep(4000);
  } else {
    log.warn('Faucet "Get BTC" belum siap / cooldown.');
  }

  // Check if "Get frBTC" button exists
  const frbtcBtn = await clickByText(page, 'Get frBTC', 'button', 3000);
  if (frbtcBtn) {
    log.faucet('Klaim \x1b[32m"Get frBTC"\x1b[0m berhasil terpicu.');
    await sleep(4000);
  } else {
    log.warn('Faucet "Get frBTC" belum siap / cooldown.');
  }
}

export async function executeRandomSwap(page, stepNum, totalSteps) {
  const amount = randomFloat(CONFIG.ranges.swapMin, CONFIG.ranges.swapMax, 5);
  log.stepBox(stepNum, totalSteps, 'SWAP frBTC ➜ DΦHM', `${amount} frBTC`);

  await page.goto(`${CONFIG.appUrl}/app/swap`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(3000);

  const swapAvailable = await page.evaluate(() => {
    const swapBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.innerText.trim().toLowerCase().includes('swap') && !b.disabled
    );
    return !!swapBtn;
  });

  if (!swapAvailable) {
    log.stepEnd(false, 'Terkunci (menunggu konfirmasi saldo)');
    return false;
  }

  try {
    await setFirstInputValue(page, amount);
    await sleep(1500);

    const clicked = await clickByText(page, 'Swap', 'button');
    if (clicked) {
      await sleep(5000);
      log.stepEnd(true, `Swap ${amount} frBTC sukses diproses`);
      return true;
    }
  } catch (err) {
    log.stepEnd(false, err.message);
  }
  return false;
}

export async function executeRandomBond(page, stepNum, totalSteps) {
  const amount = randomFloat(CONFIG.ranges.bondMin, CONFIG.ranges.bondMax, 5);
  log.stepBox(stepNum, totalSteps, 'BOND frBTC (Mint DΦHM)', `${amount} frBTC`);

  await page.goto(`${CONFIG.appUrl}/app/bond`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(3000);

  const bondAvailable = await page.evaluate(() => {
    const bondBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.innerText.trim().toLowerCase().includes('bond') && !b.disabled
    );
    return !!bondBtn;
  });

  if (!bondAvailable) {
    log.stepEnd(false, 'Terkunci (menunggu konfirmasi saldo)');
    return false;
  }

  try {
    await setFirstInputValue(page, amount);
    await sleep(1500);

    const clicked = await clickByText(page, 'Bond', 'button');
    if (clicked) {
      await sleep(5000);
      log.stepEnd(true, `Bond ${amount} frBTC sukses diproses`);
      return true;
    }
  } catch (err) {
    log.stepEnd(false, err.message);
  }
  return false;
}

export async function executeRandomStake(page, stepNum, totalSteps) {
  const amount = randomFloat(CONFIG.ranges.stakeMin, CONFIG.ranges.stakeMax, 3);
  log.stepBox(stepNum, totalSteps, 'STAKE DΦHM (Compounding)', `${amount} DΦHM`);

  await page.goto(`${CONFIG.appUrl}/app/stake`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(3000);

  const stakeAvailable = await page.evaluate(() => {
    const stakeBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.innerText.trim().toLowerCase().includes('stake') && !b.disabled
    );
    return !!stakeBtn;
  });

  if (!stakeAvailable) {
    log.stepEnd(false, 'Terkunci (menunggu konfirmasi saldo)');
    return false;
  }

  try {
    await setFirstInputValue(page, amount);
    await sleep(1500);

    const clicked = await clickByText(page, 'Stake', 'button');
    if (clicked) {
      await sleep(5000);
      log.stepEnd(true, `Stake ${amount} DΦHM sukses diproses`);
      return true;
    }
  } catch (err) {
    log.stepEnd(false, err.message);
  }
  return false;
}

export async function executeRandomUnstake(page, stepNum, totalSteps) {
  const amount = randomFloat(CONFIG.ranges.unstakeMin, CONFIG.ranges.unstakeMax, 3);
  log.stepBox(stepNum, totalSteps, 'UNSTAKE sDΦHM', `${amount} sDΦHM`);

  await page.goto(`${CONFIG.appUrl}/app/stake`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(3000);

  await clickByText(page, 'Unstake', 'button');
  await sleep(1500);

  try {
    await setFirstInputValue(page, amount);
    await sleep(1500);

    const clicked = await clickByText(page, 'Unstake', 'button');
    if (clicked) {
      await sleep(5000);
      log.stepEnd(true, `Unstake ${amount} sDΦHM sukses diproses`);
      return true;
    }
  } catch (err) {
    log.stepEnd(false, err.message);
  }
  log.stepEnd(false, 'Terkunci (menunggu saldo sDΦHM)');
  return false;
}

export async function checkLeaderboardAndStreak(page) {
  log.info('Menyinkronkan Poin & Status Streak...');
  await page.goto(`${CONFIG.appUrl}/app/leaderboard`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(4000);

  const data = await page.evaluate(() => {
    const body = document.body.innerText;
    const ptsMatch = body.match(/(\d+[\d,.]*)\s*(?:pts|points)/i);
    return {
      points: ptsMatch ? ptsMatch[0] : '0 pts',
    };
  });

  return data.points;
}
