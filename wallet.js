import { log, sleep, clickByText } from './utils.js';
import { CONFIG } from './config.js';

export async function connectOrRestoreWallet(page, account) {
  log.info(`Menghubungkan ke DOHM testnet...`);
  await page.goto(`${CONFIG.appUrl}/app/link`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
  await sleep(3000);

  // Check if wallet is already connected
  const isConnected = await page.evaluate(() => {
    const text = document.body.innerText;
    return text.includes('bcrt') || (text.includes('Regtest') && !text.includes('Connect wallet'));
  });

  if (isConnected) {
    const address = await page.evaluate(() => {
      const match = document.body.innerText.match(/bcrt1[a-zA-Z0-9]{30,}/);
      return match ? match[0] : 'Connected (Regtest)';
    });
    log.success(`Wallet aktif: \x1b[32m${address}\x1b[0m`);
    return { success: true, address };
  }

  log.info(`Memulihkan wallet dari Seed Phrase...`);

  // Click Connect wallet button or Create testnet wallet
  let btnClicked = await clickByText(page, 'Connect wallet', 'button', 3000);
  if (!btnClicked) {
    btnClicked = await clickByText(page, 'Create testnet wallet', 'button', 3000);
  }
  await sleep(2000);

  // Click "Restore from recovery phrase"
  await clickByText(page, 'Restore from recovery phrase', 'button', 4000);
  await sleep(2000);

  // Fill in recovery phrase & password using React-compatible input event
  await page.evaluate((seed, pwd) => {
    function setNativeValue(element, value) {
      const proto = Object.getPrototypeOf(element);
      const set = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
      if (set) {
        set.call(element, value);
      } else {
        element.value = value;
      }
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const textareas = Array.from(document.querySelectorAll('textarea, input[type="text"]'));
    const seedInput = textareas.find((el) =>
      el.placeholder?.toLowerCase().includes('recovery') || el.ariaLabel?.toLowerCase().includes('recovery')
    ) || textareas[0];

    if (seedInput) {
      setNativeValue(seedInput, seed);
    }

    const pwdInputs = Array.from(document.querySelectorAll('input[type="password"], input[placeholder*="password" i]'));
    if (pwdInputs.length > 0) {
      setNativeValue(pwdInputs[0], pwd);
    }
  }, account.seedPhrase, account.password || 'DohmTestnet2026!');

  await sleep(1500);

  // Click Restore button
  const restoreSubmitted = await clickByText(page, 'Restore', 'button', 3000);
  if (restoreSubmitted) {
    log.info(`Menunggu konfirmasi restore...`);
    await sleep(4000);

    const address = await page.evaluate(() => {
      const match = document.body.innerText.match(/bcrt1[a-zA-Z0-9]{30,}/);
      return match ? match[0] : 'bcrt1q... (Regtest)';
    });

    log.success(`Wallet berhasil dipulihkan: \x1b[32m${address}\x1b[0m`);
    return { success: true, address };
  }

  log.error(`Gagal melakukan restore wallet.`);
  return { success: false, address: null };
}
