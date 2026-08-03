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
- **Landing** (`/`, `/trading`, `/about`) — marketing site with its own nav/footer, ported from a separate Astro project (`NovaFiLanding`); see "Landing page" below

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
| framer-motion | 12.x | Animations on the landing page only (`src/components/landing/*`) |

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
│   │   ├── NetworkGuard.tsx  ← Auto-switches to BSC right after connect if on the wrong chain
│   │   ├── Footer.tsx
│   │   ├── Router.tsx        ← All client route definitions
│   │   ├── landing/          ← Marketing-site components (Navbar, Footer, Hero, CTASection, etc.)
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
│   ├── lib/
│   │   └── landing/          ← motion.ts (framer-motion variants), markets.ts (mock market data)
│   ├── services/
│   │   ├── coingecko.service.ts
│   │   └── pg.api.service.ts ← Calls to the backend's /api/pg endpoints
│   ├── utils/
│   │   ├── txErrors.ts       ← Chain guard + tx error taxonomy for swap/liquidity signing
│   │   ├── blockchain.ts
│   │   └── formatters.ts
│   ├── views/                ← SwapView, LiquidityView, OverviewView, CoinDetailsView, NFTView, BlogView, NotFound
│   │   └── landing/          ← LandingHomeView ("/"), LandingTradingView ("/trading"), LandingAboutView ("/about")
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
- Wallet list: **Recommended** → WalletConnect (QR/mobile). **More wallets** → OKX, Binance, Coinbase, Trust, `injectedWallet` ("Browser Wallet"). No `metaMaskWallet` connector (breaks the CRA build via `@metamask/sdk`'s analytics module) — MetaMask itself still works fine, detected via EIP-6963 (see below).
- Real extensions that announce via EIP-6963 (MetaMask, OKX, Rabby, etc.) are auto-detected independently of the `wallets` list above and merged into the modal by RainbowKit. `injectedWallet` is kept as an explicit fallback for extensions that only expose `window.ethereum` without an EIP-6963 announcement — otherwise those wouldn't appear anywhere in the modal. Trade-off: this tile always renders regardless of whether any extension is installed, and clicking it with nothing injected fails with no fallback (no QR, no install link).
- `src/hooks/useWallet.ts` bridges wagmi state into the same `{ account, provider, chainId }` shape the old ethers v5 contract code expects.
- Network mismatch is handled as a separate step after connecting (never combined into the connect handshake itself — see the wagmi bug note below):
  - `src/components/NetworkGuard.tsx`, mounted once in `App.tsx`, watches `useAccount()` and automatically calls `switchChain(BSC_CHAIN_ID)` the moment a wallet connects on the wrong chain — no need to find/click a button first. Guarded by a ref so it only attempts once per wrong `chainId` (doesn't spam the wallet if the user rejects).
  - `isWrongNetwork` (from `useWallet`) still drives a "Wrong network" button in `Header.tsx`/`SwapView.tsx`/`LiquidityView.tsx` as the manual fallback/retry if the automatic prompt was dismissed or missed.
  - The wallet's own switch-network confirmation popup (`wallet_switchEthereumChain`) can never be skipped — that's a security control enforced by the wallet software itself, not something a dapp can bypass.

---

## Landing page

The marketing site (`/`, `/trading`, `/about`) was ported into this repo from a separate Astro project (`~/Downloads/NovaFiLanding`). That project used Astro only as a thin page shell (3 `.astro` files + 1 `.astro` layout); all actual UI was already plain React (`src/components/react/*.tsx`), so the port kept the same component code and rewired only the Astro-specific seams:

- **Routing.** `src/components/Router.tsx` now has two sibling route groups, each with its own layout:
  - `LandingLayout` (`src/components/Router.tsx`) — wraps `/`, `/trading`, `/about` with `landing/Navbar` + `landing/Footer`. Scoped to a wrapper `<div className="bg-nova-bg text-nova-text">`, not `<body>`, so the landing's dark theme doesn't leak into the dApp routes.
  - `Layout` — unchanged, wraps `/swap`, `/liquidity`, `/overview`, `/coins`, `/nft`, `/blog` with the wallet-connect `Header`.
  - The old `<Route path="/" element={<Navigate to="/swap" />} />` was removed — `/` now serves the landing home page instead of redirecting into the dApp.
- **Navigation.** All internal links (Navbar, Footer, CTASection, Hero, MarketsTable) were converted from plain `<a href>`/Astro's `currentPath` prop to `react-router-dom`'s `<Link>`/`useLocation()`, so navigating between landing pages and into the dApp stays client-side (no full reload). Where a link needed both a `framer-motion` hover animation and router navigation, it's wrapped as `const MotionLink = m(Link)` (see `Hero.tsx`, `CTASection.tsx`).
- **"Launch the app" targets.** The landing's original placeholder copy pointed several CTAs at itself or elsewhere (Navbar's "Launch App" → `/trading`; the trading page's own "Open an Account" CTA → `/trading`, i.e. itself). These were repointed to `/swap` — the actual dApp entry point — since that's what "launch app" / "start trading" / "open an account" should mean once wired into a real product. **Note:** the copy on these CTAs ("Open an Account", "No credit card required") still reads like a custodial/CeFi signup flow; it doesn't quite match novaFi's actual non-custodial connect-wallet model. Routing is wired correctly, but the wording may be worth revisiting.
- **Images.** Astro's `import img from "./x.png"` yields an `{ src, width, height }` object (`ImageMetadata`); CRA/webpack's plain `import img from "./x.png"` yields a `string` URL directly. `src/lib/landing/markets.ts` and every component that read `.icon.src` / `CRYPTO_LOGOS.X.src` were updated to use the value directly (no `.src`). The landing's own `crypto-icons` were **not** copied — they were byte-identical to novaFi's existing `src/assets/crypto-icons/*.png`, which were already typed as plain strings, so `lib/landing/markets.ts` just imports from there. The landing's logo files (`logo-full.png`, `logo-full-transparent.png`, `logo-icon.png` — a different brand asset than novaFi's existing `src/assets/logo/*`) were copied to `src/assets/landing/` and are now imported normally instead of referenced via the old Astro `public/`-relative absolute paths (`/logo-full.png`).
- **Styling.** The landing used Tailwind v4's CSS-first config (`@import "tailwindcss"` + `@theme` in `global.css`). novaFi is on Tailwind v3 with a JS config. The `nova-*` color palette and the `marquee`/`float`/`gradient-x`/`flash-up`/`flash-down` keyframes were ported into `tailwind.config.js`'s `theme.extend`; the `text-gradient-nova`/`bg-gradient-nova`/`bg-gradient-nova-animated` utilities (which need `background-clip: text`, not expressible as a simple Tailwind `backgroundImage` token) were added as hand-written classes under a new `@layer utilities` block in `src/App.css`. The "Space Grotesk" variable font is loaded via a Google Fonts `<link>` in `public/index.html`, matching how Inter/Poppins are already loaded there, rather than adding the `@fontsource-variable` npm package the original project used.
- **Dependency added:** `framer-motion` (used only by `src/components/landing/*`).
- **Per-page `<title>`/meta description.** Astro's `<Layout title="..." description="...">` props (set per-page in `index.astro`/`trading.astro`/`about.astro`) had no CRA/SPA equivalent and were silently dropped in the initial port — every route shared the single static `<title>novaFi</title>` in `public/index.html`. Fixed by adding `react-helmet-async`: `HelmetProvider` wraps the app in `src/index.tsx`, and each landing view (`LandingHomeView`/`LandingTradingView`/`LandingAboutView`) renders a `<Helmet>` with the same title/description Astro used (e.g. `"Home | novaFi"`). Only the 3 landing routes have this — the dApp views (`/swap`, `/liquidity`, etc.) still rely on the static title, unchanged from before this integration.
- **Newsletter form fix.** `landing/Footer.tsx`'s newsletter form was a static placeholder (`action="#" method="post"`, no handler) — harmless on the original multi-page Astro site, but inside this SPA a real click would trigger a full browser form submission, forcing a full-page reload and wiping all React state. Fixed with an `onSubmit` handler that calls `preventDefault()` and shows an inline "you're on the list!" confirmation. There is still no real newsletter backend — this only stops the accidental page reload; wiring an actual subscribe endpoint is a separate task.

## Known issues — fixed this session

- **`invalid border=0` crash on any WalletConnect/QR wallet.** Root cause: `cuer@0.0.3` (RainbowKit dependency) hardcodes `border: 0` when calling `encodeQR`; the resolved `qr@0.6.0` added a validation that rejects `border <= 0`. Fixed by pinning `"qr": "0.5.5"` via `overrides` in `package.json` (last version without that validation).
- **Browser wallet connect hangs forever ("Connecting…" with no error).** Root cause: `RainbowKitProvider`'s `initialChain={bsc}` forced every `connectAsync` call to request `chainId: 56` regardless of the wallet's current chain. When the wallet wasn't already on BSC, this hit an open, unfixed wagmi v2 bug ([wevm/wagmi#4118](https://github.com/wevm/wagmi/issues/4118)) where the implicit chain-switch-during-connect never resolves. Fixed by removing `initialChain` and adding `mainnet` to `chains` in `wagmi.ts`, so the initial connect matches the wallet's real chain and the BSC switch happens as a separate, explicit step via the existing "Wrong network" flow.
- **Production build fails when `CI=true`** (GitHub Actions, Vercel, Netlify default). Root cause: `ox` (a `viem` dependency) does `await import('node:worker_threads')` with a variable specifier inside an `isNode`-guarded branch that's dead code in the browser bundle; webpack can't prove that statically and emits "Critical dependency: the request of a dependency is an expression", which CRA treats as a hard error under `CI=true`. Fixed with a scoped `config.ignoreWarnings` entry in `config-overrides.js` (matches only that module + message, doesn't suppress other warnings).
- **`ChunkLoadError` on lazy-loaded chunks** (e.g. the "Need the official WalletConnect modal?" link in the QR screen, which lazy-loads `@reown/appkit-ui` on click). Root cause: any code-split chunk 404s once the chunk hashes the already-loaded `bundle.js` references no longer match what the server has — after a new deploy, or a local dev-server restart while a tab was already open. Mitigated with a global `unhandledrejection` handler in `public/index.html` that detects `ChunkLoadError` (by `error.name` or the "Loading chunk ... failed" message) and reloads the page once, throttled to at most once per 10s so a genuinely persistent failure doesn't reload-loop. Doesn't fix the underlying cause (inherent to code-splitting) — just means the user never has to see it.

## Known issues — open (see chat for full audit report)

- **`backend/.env` is committed to git** (commit `3de6f6780`), including the real `JWT_SECRET`. Needs: rotate the secret, add `.env`/`backend/.env` to `.gitignore`, `git rm --cached` them, and consider rewriting history if the remote is/was public.
- **`backend/database.sqlite-shm` / `-wal`, and `backend/database.sqlite` itself, are all tracked in git.** The `.shm`/`-wal` are SQLite WAL runtime artifacts, not source — they churn on every server run. The main `.sqlite` file is worse: it holds real row data (users, favorites, transactions, blog), so every commit that touches it snapshots live app data (and password hashes) into git history. Root cause: the repo's root `.gitignore` only lists `node_modules/`, `dist/`, `.cache/`, `build/` — nothing under `backend/` is excluded at all. Fix: add `backend/*.sqlite*` and `backend/.env` to `.gitignore`, then `git rm --cached` them.
- **~40 unused backend dependencies** (mysql, mysql2, pg, bitcoinjs-lib, tronweb, xrpl, stripe, socket.io, node-cron, sharp, crypto-js, form-data, adm-zip, nodemailer, uuid, tiny-secp256k1...) from a legacy withdrawal/staking/custody system that's no longer mounted in `app.js`. `npm audit` on the backend reports 33 vulnerabilities (4 critical) entirely inside this unused subtree. Same for the ~13 legacy route/controller/model files under `routes/`, `controllers/`, `models/` not named `*.pg.*` — none are reachable from `app.js`, only from each other. Cross-platform note: several of these (`tiny-secp256k1`, `bitcoinjs-lib`'s deps, `sharp`) are native modules requiring build tools (Python + a C++ toolchain) to compile from source if no prebuilt binary matches the target platform/Node ABI — on a Windows machine without those tools, `npm install` in `backend/` can fail on packages that aren't even used, since npm installs everything in `package.json` regardless of reachability. Another reason to prune this subtree.
- No rate limiting on `/api/pg/auth/login` or `/register` (brute-force hardening gap).
- `err.message` is returned directly to the client on 500 responses across the `*.pg.controller.js` files — minor internal-detail leakage.
- **Minor/cosmetic:** `backend/app.js` line 10 (`dotenv.config({ path: `${stage}.env` })`) always fails silently with `ENOENT` (there's no `production.env`/`development.env` file, only `.env`) — dead, misleading code. Not a functional bug: `auth.pg.controller.js` independently runs its own `dotenv.config({ path: path.join(__dirname, '../.env') })` at require-time, which resolves correctly and populates `process.env.JWT_SECRET` before `app.js`'s broken call even runs. Verified end-to-end (see below) that the real secret from `backend/.env` is what's actually in effect. Worth removing the redundant line in `app.js` during a cleanup pass, but nothing to fix urgently.

---

## Verified this session — API connectivity & Linux/Windows portability

**API ↔ server connectivity (live end-to-end test, not just code review):** started the backend (`node app.js`, port 1357) and the frontend dev server (`npm run client`, port 2588) together on this Linux machine and exercised the exact endpoints `src/services/pg.api.service.ts` calls: CORS preflight from the `2588` origin, `POST /auth/register`, `POST /auth/login`, `GET /auth/me` with and without a bearer token (200 vs 401 as expected), and `POST /favorites`. All round-tripped correctly through `REACT_APP_API_URL` (defaults to `http://localhost:1357`, matching the backend port). `cors()` is wide open (`Access-Control-Allow-Origin: *`), and the frontend never sends `credentials: "include"`, so there's no origin/credentials mismatch. No connectivity issues found. Test data was cleaned up and the tracked `backend/database.sqlite*` files (dirtied by the test run) were restored with `git checkout --` afterward.

**Linux vs. Windows portability:**
- All npm scripts already use `cross-env` (for `PORT=2588`) and `concurrently` (for running frontend+backend together) instead of raw shell syntax — both cross-platform-safe. No `.sh` scripts anywhere that would require bash/WSL on Windows.
- All filesystem paths in backend code (`db/index.js`, `db/init.js`, `config.js`, `auth.pg.controller.js`) use `path.join(__dirname, ...)`, never hardcoded `/`-concatenated or Windows-style paths.
- Programmatically checked every relative `import`/`require` in `src/` and `backend/` against the actual on-disk filenames (case-sensitive comparison): zero mismatches. This matters because Windows/macOS filesystems are case-insensitive by default and will silently resolve a wrong-case import that then hard-fails on Linux (e.g. CI, or a teammate's Linux machine) — confirmed this repo has none of that class of bug.
- The only native (compiled) dependency in the *live* code path is `better-sqlite3`, which ships prebuilt binaries for win32/linux/darwin — installs cleanly on both OSes without a C++ toolchain. The live auth/crypto code uses pure-JS `bcryptjs` and `jsonwebtoken` (not native `bcrypt`), so no native-module build step is needed there either.
- The only real cross-platform risk found is the unused legacy dependency subtree mentioned above (native modules that could break `npm install` on a Windows machine lacking build tools) — same fix as the security recommendation: remove them.

---

## Testing checklist for wallet changes

After touching `src/config/wagmi.ts` or `src/index.tsx`:
1. `npx tsc --noEmit`
2. `npm run client`, open the connect modal, verify the wallet list matches what's configured
3. Connect with an injected/extension wallet (verify no hang, and that "Wrong network" appears correctly if not on BSC)
4. Connect via WalletConnect QR (verify the QR renders without the `cuer`/`qr` border crash)
5. `CI=true npx react-app-rewired build` — must exit 0
