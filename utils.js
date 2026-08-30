export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',

  // Colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Bright Colors
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',

  // Backgrounds
  bgCyan: '\x1b[46m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
};

function getTime() {
  return new Date().toLocaleTimeString('id-ID', { hour12: false });
}

export const log = {
  info: (msg) => {
    console.log(` ${C.dim}${getTime()}${C.reset} ${C.cyan}ℹ INFO${C.reset}   ${msg}`);
  },
  success: (msg) => {
    console.log(` ${C.dim}${getTime()}${C.reset} ${C.brightGreen}✔ OK${C.reset}     ${msg}`);
  },
  warn: (msg) => {
    console.log(` ${C.dim}${getTime()}${C.reset} ${C.brightYellow}⚠ WARN${C.reset}   ${msg}`);
  },
  error: (msg) => {
    console.log(` ${C.dim}${getTime()}${C.reset} ${C.brightRed}✖ FAIL${C.reset}   ${msg}`);
  },
  random: (msg) => {
    console.log(` ${C.dim}${getTime()}${C.reset} ${C.magenta}🎲 RANDOM${C.reset} ${msg}`);
  },
  faucet: (msg) => {
    console.log(` ${C.dim}${getTime()}${C.reset} ${C.blue}🚰 FAUCET${C.reset} ${msg}`);
  },
  tx: (msg) => {
    console.log(` ${C.dim}${getTime()}${C.reset} ${C.brightCyan}⚡ TX${C.reset}     ${msg}`);
  },

  banner: () => {
    console.log(`
${C.brightCyan}╔══════════════════════════════════════════════════════════════════════╗
║${C.brightWhite}${C.bold}              ✨ DOHM FINANCE TESTNET AUTO-BOT v2.0                  ${C.reset}${C.brightCyan}║
║${C.dim}     ⚡ Multi-Account • Randomized TXs • Human Delay • Streak Keeper   ${C.reset}${C.brightCyan}║
╚══════════════════════════════════════════════════════════════════════╝${C.reset}`);
  },

  accountHeader: (current, total, name, address = null) => {
    console.log(`\n${C.brightCyan}╭──────────────────────────────────────────────────────────────────────╮${C.reset}`);
    console.log(`${C.brightCyan}│${C.reset} ${C.bold}👤 AKUN [${current}/${total}]:${C.reset} ${C.brightYellow}${name}${C.reset}`.padEnd(79) + `${C.brightCyan}│${C.reset}`);
    if (address) {
      console.log(`${C.brightCyan}│${C.reset} ${C.dim}🔑 Address :${C.reset} ${C.green}${address}${C.reset}`.padEnd(79) + `${C.brightCyan}│${C.reset}`);
    }
    console.log(`${C.brightCyan}╰──────────────────────────────────────────────────────────────────────╯${C.reset}`);
  },

  stepBox: (stepNum, totalSteps, title, detail = '') => {
    console.log(`\n${C.brightMagenta}┌─ [Aksi ${stepNum}/${totalSteps}] ${C.bold}${title}${C.reset}`);
    if (detail) {
      console.log(`${C.brightMagenta}│${C.reset}  ${C.dim}├─ Detail  :${C.reset} ${detail}`);
    }
  },

  stepEnd: (success, message) => {
    const icon = success ? `${C.green}✔ BERHASIL${C.reset}` : `${C.yellow}⚠ DILEWATI${C.reset}`;
    console.log(`${C.brightMagenta}│${C.reset}  ${C.dim}└─ Status  :${C.reset} ${icon} ${C.dim}(${message})${C.reset}`);
    console.log(`${C.brightMagenta}└─────────────────────────────────────────────────────────────────────${C.reset}`);
  },

  summaryCard: (name, points, successTx, totalTx) => {
    console.log(`\n${C.brightGreen}╭────────────────────── 📊 Ringkasan Akun ─────────────────────────────╮${C.reset}`);
    console.log(`${C.brightGreen}│${C.reset}  👤 Nama Akun       : ${C.bold}${name}${C.reset}`.padEnd(80) + `${C.brightGreen}│${C.reset}`);
    console.log(`${C.brightGreen}│${C.reset}  🏆 Poin Terdata    : ${C.brightYellow}${points || '0 Pts'}${C.reset}`.padEnd(80) + `${C.brightGreen}│${C.reset}`);
    console.log(`${C.brightGreen}│${C.reset}  ⚡ Transaksi Sukses: ${C.cyan}${successTx} / ${totalTx} Aksi${C.reset}`.padEnd(80) + `${C.brightGreen}│${C.reset}`);
    console.log(`${C.brightGreen}│${C.reset}  ⏱️ Waktu Selesai   : ${C.dim}${getTime()}${C.reset}`.padEnd(80) + `${C.brightGreen}│${C.reset}`);
    console.log(`${C.brightGreen}╰──────────────────────────────────────────────────────────────────────╯${C.reset}`);
  },
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

export async function randomDelay(minSec = 5, maxSec = 15, label = 'Jeda alami') {
  const waitTime = randomInt(minSec, maxSec);
  process.stdout.write(` ${C.dim}${getTime()}${C.reset} ${C.magenta}⏳ ${label}:${C.reset} Menunggu ${waitTime} detik... `);
  await sleep(waitTime * 1000);
  process.stdout.write(`${C.green}Lanjut!${C.reset}\n`);
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
