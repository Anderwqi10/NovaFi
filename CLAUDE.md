# novaFi — CLAUDE.md

Reference document for Claude Code. Update this file with every significant change to the project.

All code, comments, and documentation in this repository must be in English (see "Language convention" below).

---

## Project Overview

novaFi is a DeFi (Decentralized Finance) platform on BNB Smart Chain (BSC) offering:

- **Swap** — token swaps via PancakeSwap Router V2
- **Liquidity** — add/remove liquidity positions in PancakeSwap pools, view own positions
- **Overview** — market table with real-time prices from CoinGecko
- **Coin Details** — historical price charts per coin, favorites/watchlist (requires login)
- **NFTs** — gallery and collections browser
- **Blog** — posts with categories (public read, backed by local SQLite)

There is no prediction game, MySQL auth, or web3-react wallet system in the current codebase — all of that was removed in a prior cleanup pass. The wallet layer is wagmi v2 + RainbowKit v2; the account/favorites/transactions layer is a separate, lightweight JWT+SQLite system (`/api/pg/*`), unrelated to the wallet connection.

---

## Tech Stack

### Frontend
| Technology | Version | Notes |
|---|---|---|
| React | 18.3 | TypeScript 5.9 |
| react-router-dom | 6.30 | Client-side routing (`src/components/Router.tsx`) |
| Tailwind CSS | 3.4 | Utility classes, no CSS modules |
| recharts | 3.9 | Area/line charts |
| ethers.js | 5.8 | Blockchain interaction (bridged from wagmi, see `useWallet`) |
| wagmi | 2.19 | Wallet connection state, chains, transports |
| viem | 2.55 | Low-level EVM client (wagmi dependency) |
| @rainbow-me/rainbowkit | 2.2 | Connect-wallet modal UI |
| @tanstack/react-query | 5.101 | Data fetching/caching (wagmi dependency) |
| react-app-rewired | 2.2 | Webpack overrides (Node.js polyfills, warning suppression) |

### Backend
| Technology | Version | Notes |
|---|---|---|
| Node.js + Express | 4.19 | REST API, only `/api/pg/*` is mounted (`backend/app.js`) |
| better-sqlite3 | 12.x | Synchronous SQLite, file: `backend/database.sqlite` |
| jsonwebtoken | 9.x | JWT authentication |
| bcryptjs | 3.x | Password hashing (cost 12) |

**Important:** `backend/package.json` lists ~40 more dependencies (mysql, mysql2, pg, bitcoinjs-lib, tronweb, xrpl, stripe, socket.io, node-cron, sharp, etc.) inherited from a legacy withdrawal/staking/custody system. None of them are required by any file reachable from `app.js` — see "Known issues" below.

---

## Ports

| Service | Port |
|---|---|
| Frontend (React) | **2588** |
| Backend (Express) | **1357** |

Run both with: `npm start` (uses `concurrently`). Frontend only: `npm run client`.

---

## Folder Structure

```
novaFi/
├── src/
│   ├── assets/               ← Logos, images
│   ├── components/
│   │   ├── auth/AuthModal.tsx ← Login/register modal for the JWT+SQLite account system
│   │   ├── Header.tsx        ← Nav + wallet connect/account button (RainbowKit modals)
│   │   ├── Footer.tsx
│   │   ├── Router.tsx        ← All client route definitions
│   ├── config/
│   │   ├── wagmi.ts          ← Chains, transports, wallet connector list
│   │   └── rainbowkitTheme.ts← Connect-modal theme matched to the app's visual identity
│   ├── constants/
│   │   ├── contracts.ts      ← PANCAKE_ROUTER_V2, WBNB, BSC_CHAIN_ID
│   │   └── tokens.ts         ← Swap/liquidity token list with metadata
│   ├── hooks/
│   │   ├── useWallet.ts      ← wagmi → ethers v5 bridge, single source of truth for wallet state
│   │   ├── useSwitchChain.tsx
│   │   ├── useInterval.ts
│   │   └── useLiveData.ts
│   ├── services/
│   │   ├── coingecko.service.ts
│   │   └── pg.api.service.ts ← Calls to the backend's /api/pg endpoints
│   ├── utils/
│   │   ├── txErrors.ts       ← Chain guard + tx error taxonomy for swap/liquidity signing
│   │   ├── blockchain.ts
│   │   └── formatters.ts
│   ├── views/                ← SwapView, LiquidityView, OverviewView, CoinDetailsView, NFTView, BlogView, NotFound
│   ├── index.tsx             ← WagmiProvider + QueryClientProvider + RainbowKitProvider setup
│   └── App.tsx
├── backend/
│   ├── app.js                ← Entry point; mounts ONLY /api/pg (see routes/pg.routes.js)
│   ├── db/
│   │   ├── index.js          ← better-sqlite3 connection (WAL mode)
│   │   ├── init.js           ← Schema + blog seed data
│   │   └── schema.sql
│   ├── routes/pg.routes.js   ← The only live route file: auth, transactions, favorites, blog
│   ├── controllers/*.pg.controller.js ← The only live controllers
│   ├── middleware/pg.auth.middleware.js ← JWT bearer-token guard (req.pg_user_id)
│   └── (everything else under routes/, controllers/, models/ not named *.pg.* or pg.routes.js
│        is legacy/unreachable — see "Known issues")
├── config-overrides.js       ← webpack polyfills + targeted warning suppression
└── tsconfig.json
```

---

## Language convention

All code, comments, JSDoc, and documentation (`CLAUDE.md`, `README.md`) must be written in **English**. This applies going forward to every file in the repo, regardless of the language used in chat with the assistant.

---

## Wallet connection architecture

- `src/config/wagmi.ts` builds the wagmi config via RainbowKit's `getDefaultConfig`.
- Chains: `[bsc, mainnet]`. `mainnet` is included only as a "landing chain" so the initial connect handshake can match whatever chain the wallet is already on, without forcing an implicit switch (see "Known issues — fixed" below). The app is still functionally BSC-only.
- Wallet list: **Recommended** → WalletConnect (QR/mobile). **More wallets** → OKX, Binance, Coinbase, Trust. No `metaMaskWallet` connector (breaks the CRA build via `@metamask/sdk`'s analytics module) and no generic `injectedWallet` ("Browser Wallet") entry — real extensions (MetaMask, OKX, Rabby, etc.) are still auto-detected via EIP-6963, independently of this list, and merged into the modal by RainbowKit.
- `src/hooks/useWallet.ts` bridges wagmi state into the same `{ account, provider, chainId }` shape the old ethers v5 contract code expects.
- Network mismatch is handled as a separate, explicit step after connecting: `isWrongNetwork` (from `useWallet`) drives a "Wrong network" button in `Header.tsx` that opens RainbowKit's chain-switch modal. Connect and chain-switch are intentionally **not** combined into one handshake — see the wagmi bug note below.

---

## Known issues — fixed this session

- **`invalid border=0` crash on any WalletConnect/QR wallet.** Root cause: `cuer@0.0.3` (RainbowKit dependency) hardcodes `border: 0` when calling `encodeQR`; the resolved `qr@0.6.0` added a validation that rejects `border <= 0`. Fixed by pinning `"qr": "0.5.5"` via `overrides` in `package.json` (last version without that validation).
- **Browser wallet connect hangs forever ("Connecting…" with no error).** Root cause: `RainbowKitProvider`'s `initialChain={bsc}` forced every `connectAsync` call to request `chainId: 56` regardless of the wallet's current chain. When the wallet wasn't already on BSC, this hit an open, unfixed wagmi v2 bug ([wevm/wagmi#4118](https://github.com/wevm/wagmi/issues/4118)) where the implicit chain-switch-during-connect never resolves. Fixed by removing `initialChain` and adding `mainnet` to `chains` in `wagmi.ts`, so the initial connect matches the wallet's real chain and the BSC switch happens as a separate, explicit step via the existing "Wrong network" flow.
- **Production build fails when `CI=true`** (GitHub Actions, Vercel, Netlify default). Root cause: `ox` (a `viem` dependency) does `await import('node:worker_threads')` with a variable specifier inside an `isNode`-guarded branch that's dead code in the browser bundle; webpack can't prove that statically and emits "Critical dependency: the request of a dependency is an expression", which CRA treats as a hard error under `CI=true`. Fixed with a scoped `config.ignoreWarnings` entry in `config-overrides.js` (matches only that module + message, doesn't suppress other warnings).

## Known issues — open (see chat for full audit report)

- **`backend/.env` is committed to git** (commit `3de6f6780`), including the real `JWT_SECRET`. Needs: rotate the secret, add `.env`/`backend/.env` to `.gitignore`, `git rm --cached` them, and consider rewriting history if the remote is/was public.
- **`backend/database.sqlite-shm` / `-wal` are tracked in git.** These are SQLite WAL runtime artifacts, not source — they churn on every server run and can contain uncommitted row data. Should be untracked and gitignored.
- **~40 unused backend dependencies** (mysql, mysql2, pg, bitcoinjs-lib, tronweb, xrpl, stripe, socket.io, node-cron, sharp, crypto-js, form-data, adm-zip, nodemailer, uuid...) from a legacy withdrawal/staking/custody system that's no longer mounted in `app.js`. `npm audit` on the backend reports 33 vulnerabilities (4 critical) entirely inside this unused subtree. Same for the ~13 legacy route/controller/model files under `routes/`, `controllers/`, `models/` not named `*.pg.*` — none are reachable from `app.js`, only from each other.
- No rate limiting on `/api/pg/auth/login` or `/register` (brute-force hardening gap).
- `err.message` is returned directly to the client on 500 responses across the `*.pg.controller.js` files — minor internal-detail leakage.

---

## Testing checklist for wallet changes

After touching `src/config/wagmi.ts` or `src/index.tsx`:
1. `npx tsc --noEmit`
2. `npm run client`, open the connect modal, verify the wallet list matches what's configured
3. Connect with an injected/extension wallet (verify no hang, and that "Wrong network" appears correctly if not on BSC)
4. Connect via WalletConnect QR (verify the QR renders without the `cuer`/`qr` border crash)
5. `CI=true npx react-app-rewired build` — must exit 0
