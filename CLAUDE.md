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
- **Prediction** — BNB/USD price prediction game

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
| node-cron | 3.x | Scheduled tasks |
| socket.io | 4.7 | Real-time chat (support tickets) |
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
├── src/
│   ├── assets/              ← All media files (see Assets section)
│   ├── common/              ← Generic shared components (AnimatedNumber, RangeSlider)
│   ├── components/
│   │   ├── auth/            ← Login, Register, ConnectWallet, ForgotPassword, ResetPassword, ChangePassword
│   │   ├── card/            ← Live, Next, Prev (prediction game cards)
│   │   ├── helper/          ← PrivateRoutes, PublicRoutes
│   │   ├── profile/         ← Profile, EditProfile
│   │   ├── WalletComponents/← Legacy wallet system (NOT currently in use)
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Router.tsx       ← All client route definitions
│   │   ├── Spinner.tsx      ← Prize roulette wheel
│   │   └── Timer.tsx
│   ├── connectors/          ← Web3React connectors (metaMask, coinbaseWallet, walletConnect)
│   ├── constants/
│   │   ├── contracts.ts     ← Blockchain addresses (PANCAKE_ROUTER_V2, WBNB, BSC_CHAIN_ID)
│   │   ├── tokens.ts        ← DeFi token list with metadata
│   │   ├── networks.ts      ← Network configuration
│   │   └── common.ts        ← General game constants
│   ├── contexts/            ← AuthContext, MetmaskContextProvider
│   ├── contract/            ← JSON ABIs and contract functions (prediction game)
│   ├── hooks/               ← Custom hooks (see Hooks section)
│   ├── services/            ← External API calls and backend requests
│   ├── UI/                  ← Base reusable components (Button, CustomModal, MotionButton)
│   ├── utils/               ← Helpers (blockchain, formatters)
│   └── views/               ← Main page components (see Routes section)
├── backend/
│   ├── app.js               ← Server entry point
│   ├── config.js            ← Environment variable configuration
│   ├── controllers/         ← Business logic per domain
│   ├── db/                  ← SQLite init and SQL schema
│   ├── middleware/          ← JWT auth, validators, error handling
│   ├── models/              ← Data models (user, wallet, staking, etc.)
│   ├── routes/              ← REST endpoint definitions
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
| `/prediction` | `Dashboard` | Public |
| `/reset-password` | `ResetPassword` | Public only (unauthenticated) |
| `/google/login` | `GoogleLogin` | Private (requires auth) |
| `/profile` | `Profile` | Private |
| `/edit-profile` | `EditProfile` | Private |
| `/google/redirect` | `GoogleRedirect` | Public |

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
├── favicon.jpeg       → app favicon (custom image, referenced in index.html)
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
1. Verify `chainId === 56` (BSC mainnet)
2. If input token is ERC-20: check `allowance` → approve `MaxUint256` if needed
3. Call Router: `swapExactETHForTokens` / `swapExactTokensForETH` / `swapExactTokensForTokens`
4. Slippage stored in `localStorage` under key `novaFi_slippage` (default `0.5%`)

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
- `fetchCoinDetail(coinId)` — full coin detail
- `fetchTokenPrices(ids[])` — multiple prices via `/simple/price`
- Internal 30-second cache (`cachedFetch`)

### `src/hooks/useLiveData.ts`
Auto-refreshes market data every 30 seconds.

### `src/hooks/useTokenBalance.ts`
Fetches token balance for the connected wallet. Handles native BNB and ERC-20 tokens.
Auto-refreshes every 15 seconds.

### `src/hooks/useSwitchChain.tsx`
Prompts the wallet to switch to the specified network (BSC = chain 56).

### `src/hooks/useAuth.ts`
User authentication with the project's own backend.

---

## Backend — Main Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/pg/*` | Blog/PostgreSQL routes (`pg.routes.js`) |
| `POST` | `/api/auth/*` | Login, register, Google OAuth |
| `GET/POST` | `/api/users/*` | User profile |
| `GET/POST` | `/api/wallets/*` | User wallets |
| `GET/POST` | `/api/staking/*` | Staking |
| `GET/POST` | `/api/transactions/*` | Transaction history |
| `GET/POST` | `/api/withdrawals/*` | Withdrawal requests |

### Database
- Engine: **SQLite** (file: `backend/database.sqlite`)
- Driver: **better-sqlite3** (synchronous operations)
- Schema: `backend/db/schema.sql`
- Initialize: `npm run db:init` from the backend folder

### Environment Variables
File: `backend/.env` (do not commit — see `backend/.env.example`)

---

## Cron Jobs (`backend/routes/routes.js`)

| Job | Schedule | Status |
|---|---|---|
| `userBUSDDepositCheck` | `* * * * *` (every minute) | **DISABLED** — was hitting BSC mainnet unnecessarily |

> If re-enabled, confirm it is actually needed before deploying.

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

### Images in Profile.tsx
Profile images (banner1, banner2, default-profile) are now imported via webpack:
```tsx
import banner1 from "../../assets/banners/banner1.png";
// In JSX: src={banner1}
```
Previously used raw string paths (`src="/banner1.png"`) that depended on `public/`.

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
