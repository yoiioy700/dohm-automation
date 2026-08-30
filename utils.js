export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const log = {
  info: (msg) => console.log(`\x1b[36m[INFO ${new Date().toISOString().slice(11, 19)}]\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS ${new Date().toISOString().slice(11, 19)}]\x1b[0m ${msg}`),
  warn: (msg) => console.log(`\x1b[33m[WARN ${new Date().toISOString().slice(11, 19)}]\x1b[0m ${msg}`),
  error: (msg) => console.log(`\x1b[31m[ERROR ${new Date().toISOString().slice(11, 19)}]\x1b[0m ${msg}`),
  step: (stepNum, title) => console.log(`\n\x1b[35m=== [Aksi #${stepNum}] ${title} ===\x1b[0m`),
  random: (msg) => console.log(`\x1b[34m[RANDOM 🎲]\x1b[0m ${msg}`),
};

export function randomFloat(min, max, decimals = 4) {
  const rand = Math.random() * (max - min) + min;
  return parseFloat(rand.toFixed(decimals));
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function randomDelay(minSec = 5, maxSec = 15) {
  const waitTime = randomInt(minSec, maxSec);
  log.random(`Menunggu jeda acak selama ${waitTime} detik...`);
  await sleep(waitTime * 1000);
}

export async function clickByText(page, text, tag = 'button', maxWaitMs = 5000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    try {
      const clicked = await page.evaluate((t, tag) => {
        const elements = Array.from(document.querySelectorAll(tag));
        const found = elements.find((el) => el.innerText && el.innerText.trim().toLowerCase().includes(t.toLowerCase()));
        if (found && !found.disabled) {
          found.click();
          return true;
        }
        return false;
      }, text, tag);

      if (clicked) return true;
    } catch (e) {}
    await sleep(500);
  }
  return false;
}

export async function setFirstInputValue(page, value) {
  await page.evaluate((val) => {
    const inputs = Array.from(document.querySelectorAll('input[type="number"], input[inputmode="decimal"], input[type="text"]'));
    if (inputs.length > 0) {
      const target = inputs[0];
      const proto = Object.getPrototypeOf(target);
      const set = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
      if (set) {
        set.call(target, String(val));
      } else {
        target.value = String(val);
      }
      target.dispatchEvent(new Event('input', { bubbles: true }));
      target.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, value);
}
