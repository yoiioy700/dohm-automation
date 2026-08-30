import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

function getExecutablePath() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  const defaultPaths = [
    // Windows paths
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    // Linux VPS paths
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/snap/bin/chromium',
  ];
  for (const p of defaultPaths) {
    if (fs.existsSync(p)) return p;
  }
  return process.platform === 'win32'
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : '/usr/bin/chromium-browser';
}

export function loadAccounts() {
  const accountsFile = path.resolve(process.cwd(), 'accounts.json');
  if (fs.existsSync(accountsFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(accountsFile, 'utf8'));
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.error('[WARN] Failed to parse accounts.json, falling back to .env');
    }
  }

  // Fallback to single account from .env if available
  if (process.env.SEED_PHRASE) {
    return [
      {
        name: 'Default Wallet',
        seedPhrase: process.env.SEED_PHRASE,
        password: process.env.PASSWORD || 'DohmTestnet2026!',
      },
    ];
  }

  return [];
}

export const CONFIG = {
  appUrl: process.env.APP_URL || 'https://testnet.dohm.finance',
  headless: process.env.HEADLESS === 'true' || process.env.HEADLESS === undefined || process.platform !== 'win32',
  executablePath: getExecutablePath(),
  intervalHours: parseInt(process.env.INTERVAL_HOURS || '24', 10),

  // Multi-Account Delays
  accountDelayMin: parseInt(process.env.ACCOUNT_DELAY_MIN || '10', 10),
  accountDelayMax: parseInt(process.env.ACCOUNT_DELAY_MAX || '30', 10),

  // Randomization Settings
  minTxPerRun: parseInt(process.env.MIN_TX_PER_RUN || '3', 10),
  maxTxPerRun: parseInt(process.env.MAX_TX_PER_RUN || '7', 10),
  minDelaySec: parseInt(process.env.MIN_DELAY_SECONDS || '5', 10),
  maxDelaySec: parseInt(process.env.MAX_DELAY_SECONDS || '15', 10),

  // Amount ranges for transactions
  ranges: {
    swapMin: parseFloat(process.env.SWAP_MIN || '0.0002'),
    swapMax: parseFloat(process.env.SWAP_MAX || '0.002'),
    bondMin: parseFloat(process.env.BOND_MIN || '0.0005'),
    bondMax: parseFloat(process.env.BOND_MAX || '0.003'),
    stakeMin: parseFloat(process.env.STAKE_MIN || '0.05'),
    stakeMax: parseFloat(process.env.STAKE_MAX || '0.3'),
    unstakeMin: parseFloat(process.env.UNSTAKE_MIN || '0.01'),
    unstakeMax: parseFloat(process.env.UNSTAKE_MAX || '0.05'),
  },
};
