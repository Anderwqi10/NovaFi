# novaFi — CLAUDE.md

Reference document for Claude Code. Update this file with every significant change to the project.

---

## Project Overview

novaFi is a DeFi (Decentralized Finance) platform that provides:
- **Swap** — token swaps on BSC (Binance Smart Chain) via PancakeSwap Router V2
- **Liquidity** — add/remove positions in PancakeSwap pools
- **Overview** — market table with real-time prices from CoinGecko
- **Coin Details** — historical price charts per coin
- **NFTs** — gallery and collections browser
- **Blog** — posts with categories, events and podcasts

---

## Tech Stack

### Frontend
| Technology | Version | Notes |
|---|---|---|
| React | 18.3 | With TypeScript 4.9 |
| react-router-dom | 6.26 | Client-side routing |
| Tailwind CSS | 3.4 | Utility classes, no CSS modules |
| recharts | 3.9 | Area/line charts |
| ethers.js | 5.7 | Blockchain interaction (`@ethersproject` packages) |
| @web3-react/core | 8.x beta | Wallet connection |
| react-app-rewired | 2.2 | Webpack overrides (Node.js polyfills) |

### Backend
| Technology | Version | Notes |
|---|---|---|
| Node.js + Express | 4.19 | REST API |
| better-sqlite3 | 12.x | Synchronous SQLite, file: `backend/database.sqlite` |
| jsonwebtoken | 9.x | JWT authentication |
| bcryptjs | 3.x | Password hashing |

---

## Ports

| Service | Port |
|---|---|
| Frontend (React) | **2588** |
| Backend (Express) | **1357** |

Run both with: `npm start` (uses `concurrently`)

---

## Folder Structure

```
novaFi/
├── .env.example             ← Frontend env template (REACT_APP_API_URL)
├── src/
│   ├── assets/              ← All media files (see Assets section)
│   ├── common/              ← Generic shared components (AnimatedNumber, RangeSlider)
│   ├── components/
│   │   ├── auth/            ← AuthModal (JWT login/register), ConnectWallet (Web3 wallets)
│   │   ├── WalletComponents/← Legacy wallet system (NOT currently in use)
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── Router.tsx       ← All client route definitions
│   ├── connectors/          ← Web3React connectors (metaMask, coinbaseWallet, walletConnect)
│   ├── constants/
│   │   ├── contracts.ts     ← Blockchain addresses (PANCAKE_ROUTER_V2, WBNB, BSC_CHAIN_ID)
│   │   ├── tokens.ts        ← DeFi token list with metadata
│   │   ├── networks.ts      ← Network configuration
│   │   └── common.ts        ← General constants
│   ├── contexts/            ← MetmaskContextProvider
│   ├── contract/            ← JSON ABIs (legacy prediction game — only used by MetmaskContextProvider)
│   ├── hooks/               ← Custom hooks (see Hooks section)
│   ├── services/            ← coingecko.service.ts, pg.api.service.ts
│   ├── UI/                  ← Base reusable components (Button, CustomModal, MotionButton)
│   ├── utils/               ← Helpers (blockchain, formatters)
│   └── views/               ← Main page components (see Routes section)
├── backend/
│   ├── app.js               ← Server entry point (mounts /api/pg only, SQLite)
│   ├── controllers/         ← Active: *.pg.controller.js (auth, blog, favorites, transactions)
│   │                           The rest are LEGACY MySQL files, no longer mounted
│   ├── db/                  ← SQLite init and SQL schema
│   ├── middleware/          ← pg.auth.middleware.js (JWT). Rest are legacy
│   ├── models/              ← LEGACY MySQL models — not used by anything
│   ├── routes/              ← Active: pg.routes.js. Rest are legacy, not mounted
│   └── database.sqlite      ← SQLite database file (do NOT commit to git)
└── public/                  ← Static assets served directly (favicon, etc.)
```

---

## Client Routes (`src/components/Router.tsx`)

| Route | Component | Access |
|---|---|---|
| `/` | Redirect → `/swap` | Public |
| `/swap` | `SwapView` | Public |
| `/liquidity` | `LiquidityView` | Public |
| `/overview` | `OverviewView` | Public |
| `/coins` | `CoinDetailsView` | Public |
| `/nft` | `NFTView` | Public |
| `/blog` | `BlogView` | Public |

All view components are loaded with `React.lazy()` + `Suspense`.

---

## Design System (Tailwind)

### Color Palette
| Role | Value |
|---|---|
| Global background | `#03030f` |
| Card / panel | `#0c0c24` |
| Input / deep background | `#080818` |
| Standard border | `border-indigo-900/40` |
| Active border | `border-indigo-700/50` |
| Primary gradient | `from-cyan-500 to-violet-600` |
| Primary text | `text-slate-100` |
| Secondary text | `text-slate-400` |
| Muted text | `text-slate-500` / `text-slate-600` |
| Positive / green | `text-emerald-400` |
| Negative / red | `text-red-400` |

### Recurring Component Patterns

**Standard card:**
```tsx
<div className="rounded-2xl border border-indigo-900/40 bg-[#0c0c24] p-6">
```

**Active tab / inactive tab:**
```tsx
// Active
"bg-indigo-950 border border-indigo-700/50 text-white"
// Inactive
"text-slate-500 hover:text-slate-300"
```

**Primary gradient button:**
```tsx
"bg-gradient-to-r from-cyan-500 to-violet-600 text-white hover:opacity-90 shadow-lg shadow-cyan-500/15"
```

**Form input:**
```tsx
<input className="bg-[#0c0c24] border border-indigo-900/40 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 w-full" />
```

**Table with gradient:**
```tsx
// Container
style={{ background: "linear-gradient(160deg, #0f0f2e 0%, #0c0c24 40%, #080818 100%)" }}
// Header row
style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.06), rgba(99,102,241,0.08), rgba(124,58,237,0.06))" }}
// Column headers
style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.12), rgba(6,182,212,0.06))" }}
// Odd rows
style={i % 2 === 1 ? { background: "rgba(99,102,241,0.03)" } : {}}
// Row hover
onMouseEnter/onMouseLeave → "linear-gradient(90deg, rgba(6,182,212,0.07), rgba(99,102,241,0.07))"
```

---

## Assets (`src/assets/`)

All media files live under `src/assets/` organized by category. Always import with webpack — never use raw string paths like `src="/file.png"`.

```
src/assets/
├── logo/              → logoNovaFi.png (navbar: logo + name), logo.png (icon only: footer)
├── crypto-icons/      → bnb.png, busd.png, usdt.png, eth.png, bitcoin.png, pancakeswap.png
│                         index.ts  ← CRYPTO_LOGOS map, import here to add new icons
├── icons/             → UI SVGs: back, loader, verified, Setting, copy,
│                         down, DownSide, UpSide, Claim, GoogleButton,
│                         pointer, RewardWheel, Table
├── banners/           → banner1.png, banner2.svg,
│                         stranger-profile-banner1.svg, stranger-profile-banner2.svg
├── profile/           → default-profile.png, profile-stats-up.svg,
│                         profile-stats-down.svg, stranger-profile-picture.svg
├── animations/        → calculating.gif, Tick.gif
├── social/            → twitter.svg, discord.svg, telegram.svg,
│                         linkedin.svg, fb.svg, instagram.svg
└── wallets/           → Metamask.svg, WalletConnect.svg, Coinbase.svg, Phantom.svg
```

```
public/
├── logoFN.ico             → app favicon (referenced in index.html)
├── apple-touch-icon.png   → 180×180 icon for iOS/PWA
├── index.html
├── manifest.json
└── robots.txt
```

**Important rule:** Always import assets via webpack to prevent them disappearing on route change:
```ts
import logo from "../assets/logo/logoNovaFi.png"; // ✅ correct
// src="/logoNovaFi.png"  ← ❌ avoid raw string paths
```

### Crypto token logos (`src/assets/crypto-icons/index.ts`)
Local icons take priority over CoinGecko URLs. To add a new icon:
1. Drop the PNG (64×64px recommended) into `src/assets/crypto-icons/`
2. Add an import and entry in `index.ts`
```ts
import link from "./link.png";
export const CRYPTO_LOGOS: Record<string, string> = {
  // existing entries...
  LINK: link,
};
```
Tokens without a local icon fall back to `token.logoUrl` (CoinGecko) automatically.
USDC and LINK currently use CoinGecko fallback.

Token logo URLs use domain `coin-images.coingecko.com` (updated from deprecated `assets.coingecko.com`).

---

## Blockchain / DeFi

### Constants (`src/constants/contracts.ts`)
```ts
PANCAKE_ROUTER_V2 = "0x10ED43C718714eb63d5aA57B78B54704E256024E"
WBNB             = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
BSC_CHAIN_ID     = 56
```

### Supported Tokens (`src/constants/tokens.ts`)
BNB (native), BUSD, USDT, USDC, ETH (BEP-20), BTCB, CAKE, LINK

### Liquidity Pools (PancakeSwap V2)
| Pair | Address |
|---|---|
| BNB/BUSD | `0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16` |
| BNB/USDT | `0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE` |
| BNB/ETH  | `0x74E4716E431f45807DCF19f284c7aA99F18a4fbc` |
| BNB/BTCB | `0x61EB789d75A95CAa3fF50ed7E47b96c132fEc082` |
| BNB/CAKE | `0x0eD7e52944161450477ee417DE9Cd3a859b14fD0` |
| USDT/BUSD| `0x7EFaEf62fDdCCa950418312c6C91Aef321375A00` |

### Swap Flow
1. Quote via `getAmountsOut` on the router (read-only BSC RPC, debounced 350ms); CoinGecko prices are only a fallback
2. Route always built with `buildPath()`: BNB→token `[WBNB, t]`, token→BNB `[t, WBNB]`, token→token `[a, WBNB, b]`
3. Price impact = trade quote vs 1/1000-size baseline quote; button blocks at >15%
4. Verify `chainId === 56` (BSC mainnet)
5. If input token is ERC-20: check `allowance` → approve `MaxUint256` if needed
6. Fresh `getAmountsOut` right before sending; `amountOutMin` = quote minus slippage (basis points)
7. Call Router: `swapExactETHForTokens` / `swapExactTokensForETH` / `swapExactTokensForTokens`
8. On confirmation, record via `pgCreateTransaction` if `pg_token` session exists
9. Slippage stored in `localStorage` under key `novaFi_slippage` (default `0.5%`)

### ABIs (inline, human-readable format)
ABIs are defined inline in each view file to avoid separate JSON files:
```ts
const ROUTER_ABI = [
  "function swapExactETHForTokens(...) external payable returns (...)",
  ...
];
```

---

## Key Services & Hooks

### `src/services/coingecko.service.ts`
- `fetchTopCoins(limit)` — top coins by market cap
- `fetchGlobal()` — global market data
- `fetchCoinChart(coinId, days)` — historical price data
- `fetchCoinVolumeChart(coinId, days)` — historical volume data (same endpoint/cache as chart)
- `fetchCoinDetail(coinId)` — full coin detail
- `fetchTokenPrices(ids[])` — multiple prices via `/simple/price`
- Internal 30-second cache (`cachedFetch`)

### `src/services/pg.api.service.ts`
- Base URL from `REACT_APP_API_URL` env var (fallback `http://localhost:1357`)
- Auth: `pgRegister`, `pgLogin`, `pgMe` — JWT stored as `pg_token` in localStorage
- Blog: `pgGetBlogPosts(limit, offset, category)`, `pgGetBlogPost(id)`
- Transactions: `pgGetTransactions`, `pgCreateTransaction`
- Favorites: `pgGetFavorites`, `pgAddFavorite`, `pgRemoveFavorite`

### `src/hooks/useLiveData.ts`
Auto-refreshes market data every 30 seconds.

### `src/hooks/useTokenBalance.ts`
Fetches token balance for the connected wallet. Handles native BNB and ERC-20 tokens.
Auto-refreshes every 15 seconds.

### `src/hooks/useSwitchChain.tsx`
Prompts the wallet to switch to the specified network (BSC = chain 56).

---

## Backend — Main Endpoints

All active endpoints are under `/api/pg` (`backend/routes/pg.routes.js`):

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/pg/auth/register` | — | Create account |
| `POST` | `/api/pg/auth/login` | — | Login, returns JWT |
| `GET` | `/api/pg/auth/me` | JWT | Current user |
| `GET` | `/api/pg/blog` | — | Posts (`?limit&offset&category`) |
| `GET` | `/api/pg/blog/:id` | — | Single post |
| `GET/POST` | `/api/pg/transactions` | JWT | Swap history / record swap |
| `GET/POST/DELETE` | `/api/pg/favorites` | JWT | Coin watchlist |

The old `/api/*` MySQL routes are no longer mounted in `app.js`.

### Database
- Engine: **SQLite** (file: `backend/database.sqlite`)
- Driver: **better-sqlite3** (synchronous operations)
- Schema: `backend/db/schema.sql`
- Initialize: `npm run db:init` from the backend folder

### Environment Variables
File: `backend/.env` (do not commit — see `backend/.env.example`)

---

## Development Notes

### WalletComponents (legacy)
The `src/components/WalletComponents/` folder is an old wallet system that is **not in use**. `ConnectModal.tsx` and `ChainSelector.tsx` have broken imports (`coinbase_Logo.png`, `ethereum_Logo.png`, `svg/bsc_Logo.svg`) referencing files that do not exist. Do not delete until confirmed they will not be resumed.

### Lazy Loading Pattern
```tsx
const SwapView = lazy(() => import("../views/SwapView"));
// Wrapped in <Suspense fallback={<PageLoader />}>
```

### TypeScript
Always verify with `npx tsc --noEmit` before considering a change complete. The project has no automated tests.

### Environment variables
- Frontend: root `.env` (see `.env.example`) — `REACT_APP_API_URL` for the backend base URL
- Backend: `backend/.env` (see `backend/.env.example`) — JWT secret, etc.

---

## Changelog

### Full visual redesign
- **Palette**: background `#03030f`, cards `#0c0c24`, inputs `#080818`, borders `indigo-900/40`
- **Primary gradient**: `from-cyan-500 to-violet-600`
- **Redesigned components**: `Header`, `Footer`, `OverviewView`, `CoinDetailsView`, `BlogView`, `NFTView`, `SwapView`, `LiquidityView`

### Logo
- Copied from `public/` to `src/assets/logo/` and imported via webpack
- Navbar size: `h-20 w-20`
- Reason: prevents logo disappearing on tab switch in certain browsers/machines

### Footer
- Removed "Stay Updated" newsletter section
- Grid changed to `grid-cols-1 sm:grid-cols-3`

### Table gradients (OverviewView, LiquidityView)
- Container, header and rows use `linear-gradient` via inline `style`
- Row hover handled with `onMouseEnter/onMouseLeave`

### Swap (`src/views/SwapView.tsx`)
- Token selector with searchable modal
- Real-time prices via CoinGecko (`fetchTokenPrices`)
- Configurable slippage (0.1% / 0.5% / 1.0% / custom), persisted in `localStorage`
- Real swap execution on BSC mainnet via PancakeSwap Router V2
- Automatic ERC-20 approval flow
- Transaction states: `approving → pending → success/error`
- Notification with BscScan link

### Liquidity (`src/views/LiquidityView.tsx`) — new file
- 3 tabs: **Pools** | **Add Liquidity** | **My Positions**
- Pools tab: table with TVL, 24H volume, APR for 6 curated pairs
- Add Liquidity: automatic ratio calculation from CoinGecko prices, real tx via Router
- My Positions: scans LP balances across all 6 pairs, remove modal with % slider

### Asset reorganization
- All media files moved to `src/assets/` with category-based subfolders
- Removed old folders: `src/assets/images/`, `src/assets/wallet/`
- 12 source files updated with new import paths
- `Profile.tsx`: `/banner*.png` string paths converted to webpack imports
- Design reference images: `imagenes de disign/` → `src/assets/design-references/`

### Cron job disabled
- `userBUSDDepositCheck` commented out in `backend/routes/routes.js`
- Reason: ran every minute making unnecessary BSC mainnet calls

### CLAUDE.md created
- English-language reference document added at project root
- Covers stack, routes, design system, assets, blockchain constants, hooks, backend, and changelog

### NFTView improvements
- Follow/Following buttons are now interactive (toggle state via `useState`)
- Category filter pills redesigned to `rounded-full` with active gradient
- NFTs/Collections toggle uses subtle gradient when active
- "Place a bid" button has glow effect on hover and lightning bolt icon
- Follow button shows `+ Follow` (gradient) / `Following` (hover turns red for unfollow)
- "See All" link replaced with chevron icon that animates on hover
- Seller list now shows rank number (#1–8) before each avatar

### Header — logo sizing fix
- Logo `Link` container: `h-full py-1` to stay within navbar bounds
- Image: `h-full w-auto max-h-14` — respects navbar height (64px) without overflow
- Prevents logo from rendering outside navbar boundaries on any screen size

### LiquidityView — token logo resilience
- `TokenLogo` component: `onError` now shows a colored placeholder with token initials instead of hiding the image
- `TOKEN_COLORS` map added for fallback background colors per symbol

### Crypto icon logo system
- New folder `src/assets/crypto-icons/` for locally-stored token icons
- `index.ts` exports `CRYPTO_LOGOS` map (symbol → webpack-imported image)
- `SwapView` and `LiquidityView` use `CRYPTO_LOGOS[symbol] ?? token.logoUrl` — local first, CoinGecko fallback
- Local icons: BNB, BUSD, USDT, ETH, BTCB (`bitcoin.png`), CAKE (`pancakeswap.png`)
- CoinGecko fallback: USDC, LINK
- Token logo URLs updated from deprecated `assets.coingecko.com` → `coin-images.coingecko.com`

### Asset cleanup — old design removed
- Deleted `src/assets/misc/` (7 Lumanagi branding files)
- Deleted `src/assets/design-references/` (5 design reference images)
- Deleted from `public/`: `logoNovaFy.png`, `logo192.png`, `logo512.png`, `lumanagi-coin 1.png`, `Polygon 1.svg`, `Polygon 2.png`, `menu-bar.svg`, `banner1.png`, `banner2.svg`, `default-profile.png`
- `public/` now contains only: `favicon.jpeg`, `index.html`, `manifest.json`, `robots.txt`

### Favicon
- Replaced generic PNG favicon with custom `favicon.jpeg`
- `index.html` updated: `type="image/jpeg"`, both `rel="icon"` and `rel="apple-touch-icon"` point to `favicon.jpeg`
- `theme-color` meta updated to `#03030f` (matches app background)
- Final iteration: `public/logoFN.ico` is the favicon (`image/x-icon`), `apple-touch-icon.png` (180×180) generated from it; `manifest.json` references both

### Prediction view removed
- `/prediction` route and `Dashboard` import removed from `Router.tsx` (file `Dashboard.tsx` kept but orphaned)
- README views table updated: removed `/prediction`, added `/liquidity`; README logo now points to `public/apple-touch-icon.png`

### Header — logo robustness fix
- Logo `<img>` now uses fixed `h-11` instead of inheriting `h-full` from the Link — the height chain was fragile and could collapse on other machines/browsers (logo disappeared on route change for a collaborator)

### SwapView — real AMM integration (production-ready)
- `getAmountsOut` added to `ROUTER_ABI`; quotes now come from the PancakeSwap V2 router via a public BSC RPC (`bscProvider`), debounced 350ms, with CoinGecko price fallback (`quoteSource: "amm" | "estimate"`)
- `buildPath()` routes every swap: BNB→token `[WBNB, t]`, token→BNB `[t, WBNB]`, token→token `[a, WBNB, b]` (direct ERC20 pairs often don't exist)
- `executeSwap` re-quotes fresh before sending; `amountOutMin` derived from the on-chain quote in basis points (no float precision loss)
- **Price impact**: computed by comparing the trade quote vs a 1/1000-size baseline quote; shown color-coded in the rate panel, warning at ≥5%, button blocks trades at >15% ("Price impact too high")
- "To" field shows ≈USD value; "No liquidity for this pair" button state when quoting fails entirely
- Flip sides (`handleSwapSides`) clears stale `toAmount` so the skeleton shows until the fresh quote arrives
- Confirmed swaps are recorded in the backend via `pgCreateTransaction` (`POST /api/pg/transactions`) when a `pg_token` session exists

### API base URL configurable
- `pg.api.service.ts`: `BASE` now reads `process.env.REACT_APP_API_URL` (falls back to `http://localhost:1357`); root `.env.example` added

### Full audit fixes (all views)
- **LiquidityView — Remove Liquidity slippage bug**: `amountAMin/amountBMin` were hardcoded `0` (sandwich-attack exposure). Now computed from pair `getReserves()` + `totalSupply()` with the user's slippage applied in basis points
- **LiquidityView — real TVL**: fake hardcoded `tvl/vol24h/apr` removed from `POOLS`. `PoolsTab` reads `getReserves()` via a read-only BSC provider and shows live TVL (reserves × CoinGecko prices) + a "Pooled Tokens" column with real reserves
- **NFTView — all controls functional**: search wired (NFTs + collections), per-NFT categories that actually filter, Collections view (floor/volume/items cards), functional bid modal with min-bid validation, live per-second countdown (`useNow`), See All expands sellers, sellers deduplicated
- **OverviewView**: search wired to the tokens table (with empty state), "Tokens" tab shows top 50, dead "Pools" tab removed (duplicated /liquidity), "Total Liquidity" renamed to "Global Market Cap" (what it actually shows), volume bar chart now uses real BTC volume data via new `fetchCoinVolumeChart()` in coingecko.service (same endpoint, shared cache)
- **BlogView**: Load More pagination via backend `offset`, server-side `?category=` filtering, post-detail modal using previously-unused `GET /api/pg/blog/:id` (`pgGetBlogPost` added to service), dead "View all" links removed, misleading "create posts" copy fixed
- **CoinDetailsView**: `alert()` calls replaced — unauthenticated favorite click opens the shared AuthModal in place; errors show as an auto-dismissing toast
- **Shared AuthModal**: extracted from BlogView to `src/components/auth/AuthModal.tsx`, used by Blog and Coins

### Legacy code removal
- **Frontend dead code deleted**: `views/Dashboard.tsx`, `components/{Leaderboard,Timer,WinnerCardComponent,Spinner}.tsx`, `components/card/`, `components/winner/`
- **Legacy MySQL auth system deleted** (backend MySQL is not installed; the flow was dead and unlinked from the UI): `GoogleLogin/GoogleRedirect` views, `components/profile/`, `components/auth/{Login,Register,ForgotPassword,ChangePassword,ResetPassword}.tsx`, `components/helper/{PrivateRoutes,PublicRoutes}.tsx`, `hooks/useAuth.ts`, `services/{auth,axios,common}.service.ts`, `contexts/AuthContext.tsx`. Routes removed from `Router.tsx`; `AuthContextProvider` removed from `App.tsx`. The working JWT+SQLite auth (`pg_token`) is now the single auth system
- **backend/app.js rewritten minimal**: only mounts `/api/pg` (SQLite). Removed MySQL pool, socket.io ticket chat, `/test` private-key endpoint, node-cron, crypto-js, and the legacy `/api/` routes mount. NOTE: legacy backend files (`models/`, most `controllers/`, most `routes/`, `config.js`) still exist on disk but are no longer required by anything — user declined deleting them
- **index.html**: removed unused CDN tags (Font Awesome, Heroicons, Lucide) — zero usages in src/
- Verified: `tsc --noEmit` clean, backend loads (`node -e "require('./app.js')"`), production build (`react-app-rewired build`) succeeds

---

## Useful Commands

```bash
# Run everything (frontend + backend)
npm start

# Frontend only
npm run client

# Backend only
npm run server

# Production build
npm run build

# TypeScript type check (no emit)
npx tsc --noEmit

# Initialize SQLite database
cd backend && npm run db:init
```
