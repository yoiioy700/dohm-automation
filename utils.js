export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const C = {
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
  bgDark: '\x1b[40m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
};

function getTime() {
  return new Date().toLocaleTimeString('id-ID', { hour12: false });
}

export const log = {
  info: (msg) => console.log(`  ${C.dim}${getTime()}${C.reset}  ${C.brightCyan}ℹ INFO${C.reset}    ${msg}`),
  success: (msg) => console.log(`  ${C.dim}${getTime()}${C.reset}  ${C.brightGreen}✔ SUCCESS${C.reset} ${msg}`),
  warn: (msg) => console.log(`  ${C.dim}${getTime()}${C.reset}  ${C.brightYellow}⚠ WARNING${C.reset} ${msg}`),
  error: (msg) => console.log(`  ${C.dim}${getTime()}${C.reset}  ${C.brightRed}✖ ERROR${C.reset}   ${msg}`),
  faucet: (msg) => console.log(`  ${C.dim}${getTime()}${C.reset}  ${C.brightBlue}🚰 FAUCET${C.reset}  ${msg}`),
  random: (msg) => console.log(`  ${C.dim}${getTime()}${C.reset}  ${C.brightMagenta}🎲 PLAN${C.reset}    ${msg}`),

  banner: () => {
    console.clear();
    console.log(`
${C.brightCyan}  ██████╗  ██████╗ ██╗  ██╗███╗   ███╗    ${C.brightMagenta}███████╗██╗███╗   ██╗ █████╗ ███╗   ██╗ ██████╗███████╗
${C.brightCyan}  ██╔══██╗██╔═══██╗██║  ██║████╗ ████║    ${C.brightMagenta}██╔════╝██║████╗  ██║██╔══██╗████╗  ██║██╔════╝██╔════╝
${C.brightCyan}  ██║  ██║██║   ██║███████║██╔████╔██║    ${C.brightMagenta}█████╗  ██║██╔██╗ ██║███████║██╔██╗ ██║██║     █████╗  
${C.brightCyan}  ██║  ██║██║   ██║██╔══██║██║╚██╔╝██║    ${C.brightMagenta}██╔══╝  ██║██║╚██╗██║██╔══██║██║╚██╗██║██║     ██╔══╝  
${C.brightCyan}  ██████╔╝╚██████╔╝██║  ██║██║ ╚═╝ ██║    ${C.brightMagenta}██║     ██║██║ ╚████║██║  ██║██║ ╚████║╚██████╗███████╗
${C.brightCyan}  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝    ${C.brightMagenta}╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝${C.reset}
${C.dim}  ──────────────────────────────────────────────────────────────────────────────────────────${C.reset}
${C.brightWhite}   ⚡ Bitcoin Reserve Protocol • Multi-Account • Randomized TXs • Daily Streak Bot v2.5${C.reset}
${C.dim}  ──────────────────────────────────────────────────────────────────────────────────────────${C.reset}`);
  },

  accountsTable: (accounts) => {
    console.log(`\n  ${C.bold}👥 DAFTAR AKUN TERKONFIGURASI (${accounts.length} Akun):${C.reset}`);
    console.log(`  ${C.dim}┌─────┬──────────────────────────┬─────────────────────────────────────────────────┐${C.reset}`);
    console.log(`  ${C.dim}│${C.reset} ${C.bold}No  ${C.reset}${C.dim}│${C.reset} ${C.bold}Nama Akun                ${C.reset}${C.dim}│${C.reset} ${C.bold}Seed Phrase Preview                             ${C.reset}${C.dim}│${C.reset}`);
    console.log(`  ${C.dim}├─────┼──────────────────────────┼─────────────────────────────────────────────────┤${C.reset}`);
    accounts.forEach((acc, i) => {
      const no = String(i + 1).padEnd(3);
      const name = (acc.name || `Akun ${i + 1}`).padEnd(24).slice(0, 24);
      const preview = (acc.seedPhrase ? acc.seedPhrase.slice(0, 43) + '...' : 'N/A').padEnd(47);
      console.log(`  ${C.dim}│${C.reset} ${C.brightYellow}${no}${C.reset} ${C.dim}│${C.reset} ${C.brightCyan}${name}${C.reset} ${C.dim}│${C.reset} ${C.dim}${preview}${C.reset} ${C.dim}│${C.reset}`);
    });
    console.log(`  ${C.dim}└─────┴──────────────────────────┴─────────────────────────────────────────────────┘${C.reset}`);
  },

  accountCard: (current, total, name, address = null) => {
    console.log(`\n  ${C.brightCyan}╔════════════════════════════════════════════════════════════════════════════════════════╗${C.reset}`);
    console.log(`  ${C.brightCyan}║${C.reset} ${C.bold}👤 AKUN AKTIF [${current}/${total}]:${C.reset} ${C.brightYellow}${C.bold}${name.padEnd(61)}${C.reset} ${C.brightCyan}║${C.reset}`);
    if (address) {
      console.log(`  ${C.brightCyan}║${C.reset} ${C.dim}🔑 Address     :${C.reset} ${C.brightGreen}${address.padEnd(66)}${C.reset} ${C.brightCyan}║${C.reset}`);
    }
    console.log(`  ${C.brightCyan}╚════════════════════════════════════════════════════════════════════════════════════════╝${C.reset}`);
  },

  stepBox: (stepNum, totalSteps, title, detail = '') => {
    console.log(`\n  ${C.brightMagenta}╭─── ⚡ [Aksi ${stepNum}/${totalSteps}] ${C.bold}${C.brightWhite}${title}${C.reset}`);
    if (detail) {
      console.log(`  ${C.brightMagenta}│${C.reset}   ${C.dim}├─ Nominal  :${C.reset} ${C.brightYellow}${detail}${C.reset}`);
    }
  },

  stepEnd: (success, message) => {
    const badge = success
      ? `${C.brightGreen}✔ SUKSES (+1 Poin)${C.reset}`
      : `${C.brightYellow}⚠ DILEWATI${C.reset}`;
    console.log(`  ${C.brightMagenta}│${C.reset}   ${C.dim}└─ Status   :${C.reset} ${badge} ${C.dim}— ${message}${C.reset}`);
    console.log(`  ${C.brightMagenta}╰────────────────────────────────────────────────────────────────────────────────────────${C.reset}`);
  },

  cycleSummaryTable: (results) => {
    console.log(`\n  ${C.brightGreen}╔════════════════════════════════════════════════════════════════════════════════════════╗${C.reset}`);
    console.log(`  ${C.brightGreen}║${C.reset}                          ${C.bold}📊 RINGKASAN SIKLUS TRANSAKSI${C.reset}                                  ${C.brightGreen}║${C.reset}`);
    console.log(`  ${C.brightGreen}╠═════╦══════════════════════════╦═══════════════╦══════════════════╦════════════════════╣${C.reset}`);
    console.log(`  ${C.brightGreen}║${C.reset} ${C.bold}No  ${C.reset}${C.brightGreen}║${C.reset} ${C.bold}Nama Akun                ${C.reset}${C.brightGreen}║${C.reset} ${C.bold}Poin Akun     ${C.reset}${C.brightGreen}║${C.reset} ${C.bold}Transaksi Sukses ${C.reset}${C.brightGreen}║${C.reset} ${C.bold}Status             ${C.reset}${C.brightGreen}║${C.reset}`);
    console.log(`  ${C.brightGreen}╠═════╬══════════════════════════╬═══════════════╬══════════════════╬════════════════════╣${C.reset}`);

    results.forEach((r, i) => {
      const no = String(i + 1).padEnd(3);
      const name = (r.name || `Akun ${i + 1}`).padEnd(24).slice(0, 24);
      const pts = (r.points || '0 pts').padEnd(13);
      const tx = `${r.successTx}/${r.totalTx} Sukses`.padEnd(16);
      const status = r.successTx > 0 ? `${C.brightGreen}Active 🌟${C.reset} ` : `${C.brightYellow}Waiting ⏳${C.reset}`;
      console.log(`  ${C.brightGreen}║${C.reset} ${no} ${C.brightGreen}║${C.reset} ${C.brightWhite}${name}${C.reset} ${C.brightGreen}║${C.reset} ${C.brightYellow}${pts}${C.reset} ${C.brightGreen}║${C.reset} ${C.cyan}${tx}${C.reset} ${C.brightGreen}║${C.reset} ${status}          ${C.brightGreen}║${C.reset}`);
    });

    console.log(`  ${C.brightGreen}╚═════╩══════════════════════════╩═══════════════╩══════════════════╩════════════════════╝${C.reset}`);
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

export async function animatedDelay(seconds, label = 'Jeda Waktu') {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let frameIdx = 0;
  const start = Date.now();
  const totalMs = seconds * 1000;

  while (Date.now() - start < totalMs) {
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, Math.ceil((totalMs - elapsed) / 1000));
    const percent = Math.min(100, Math.floor((elapsed / totalMs) * 100));
    const barWidth = 16;
    const filled = Math.floor((percent / 100) * barWidth);
    const bar = '█'.repeat(filled) + '░'.repeat(barWidth - filled);

    process.stdout.write(
      `\r  ${C.dim}${getTime()}${C.reset}  ${C.brightMagenta}${frames[frameIdx]}${C.reset} ${label}: [${C.brightCyan}${bar}${C.reset}] ${C.brightYellow}${remaining}s${C.reset} (${percent}%) `
    );
    frameIdx = (frameIdx + 1) % frames.length;
    await sleep(100);
  }
  process.stdout.write(
    `\r  ${C.dim}${getTime()}${C.reset}  ${C.brightGreen}✔${C.reset} ${label}: [${C.brightGreen}${'█'.repeat(16)}${C.reset}] ${C.brightGreen}Selesai!${C.reset}                     \n`
  );
}

export async function randomDelay(minSec = 5, maxSec = 15, label = 'Jeda Alami') {
  const waitTime = randomInt(minSec, maxSec);
  await animatedDelay(waitTime, label);
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
