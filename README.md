# DOHM Finance Testnet - Multi-Account & Randomized Bot 🎲👥

Bot otomasi pintar untuk testnet [DOHM Finance](https://testnet.dohm.finance) yang mendukung **Multi-Account (Banyak Wallet)**, **Transaksi Acak (Randomized Actions & Amounts)**, serta **Jeda Waktu Alami (*Human-like Delay*)** untuk memaksimalkan poin dan menjaga *Daily Streak*.

---

## 🔒 Keamanan & Multi-Account Setup
Semua file rahasia (seperti `.env` dan `accounts.json`) **sudah di-ignore oleh `.gitignore`** sehingga **aman dan tidak akan pernah ter-push ke GitHub**.

### Cara Menyiapkan Banyak Akun di VPS / Komputer:
1. Salin `accounts.example.json` menjadi `accounts.json`:
   ```bash
   cp accounts.example.json accounts.json
   ```
2. Buka dan isi file `accounts.json` dengan daftar wallet Anda:
   ```json
   [
     {
       "name": "Wallet Utama",
       "seedPhrase": "kata1 kata2 kata3 kata4 kata5 kata6 kata7 kata8 kata9 kata10 kata11 kata12",
       "password": "Password123!"
     },
     {
       "name": "Wallet Kedua",
       "seedPhrase": "seed phrase kedua anda disini ...",
       "password": "Password123!"
     }
   ]
   ```
3. Salin `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```

---

## 🚀 Cara Menjalankan

Buka terminal di folder project:
```bash
cd ~/dohm-automation
```

### 1. Jalankan Sekali Saja (Single Test Run)
```bash
node --max-old-space-size=256 index.js --once
```

### 2. Tentukan Jumlah Transaksi Tertentu per Akun (Contoh: 5 Transaksi)
```bash
node --max-old-space-size=256 index.js --tx 5
```

### 3. Jalankan Mode Otomatis 24 Jam (Loop Harian)
```bash
node --max-old-space-size=256 index.js
```

### 4. Menjalankan di VPS 24/7 Menggunakan PM2
```bash
pm2 start index.js --name "dohm-bot" --node-args="--max-old-space-size=256"
pm2 save
```

---

## ⚙️ Kustomisasi ([`.env`](.env))
```env
# Mode Tampilan (true = berjalan di background / tanpa jendela GUI)
HEADLESS="true"

# Siklus Pengulangan Harian (Jam)
INTERVAL_HOURS="24"

# Jumlah Transaksi Acak per Akun
MIN_TX_PER_RUN="3"
MAX_TX_PER_RUN="7"

# Jeda Acak Antar Transaksi & Antar Akun (Detik)
MIN_DELAY_SECONDS="5"
MAX_DELAY_SECONDS="15"
ACCOUNT_DELAY_MIN="10"
ACCOUNT_DELAY_MAX="30"

# Rentang Nominal Acak Tiap Aksi
SWAP_MIN="0.0002"
SWAP_MAX="0.002"
BOND_MIN="0.0005"
BOND_MAX="0.003"
STAKE_MIN="0.05"
STAKE_MAX="0.3"
UNSTAKE_MIN="0.01"
UNSTAKE_MAX="0.05"
```
