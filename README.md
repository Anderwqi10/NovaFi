![](/public/favicon.ico)

[![Styled With Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)

# LMNG 2026

Plataforma DeFi de trading, staking y predicción descentralizada. Incluye datos de criptomonedas en tiempo real, swap de tokens, NFTs y blog integrado con base de datos PostgreSQL.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript + Tailwind CSS |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL |
| Datos crypto | CoinGecko API (tiempo real, sin API key) |
| Wallets | Web3-React v8 (MetaMask, WalletConnect, Coinbase) |
| Auth | JWT + bcryptjs |
| Gráficos | Recharts |

---

## Requisitos previos

- Node.js v20 o superior
- npm
- PostgreSQL instalado y corriendo

---

## Instalación

```bash
# 1. Instalar dependencias del frontend
npm install

# 2. Instalar dependencias del backend
cd backend && npm install && cd ..
```

---

## Configuración

El backend usa un archivo `.env` que **no se sube a GitHub**. Ya está creado en `backend/.env` con los valores por defecto:

```
JWT_SECRET=...
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=postgres
PG_DATABASE=lmng2026
```

Edita `backend/.env` si tu PostgreSQL tiene usuario/contraseña diferentes.

---

## Inicializar la base de datos

Solo hace falta hacerlo una vez:

```bash
# Crear la base de datos
sudo -u postgres psql -c "CREATE DATABASE lmng2026;"

# Crear las tablas e insertar datos de ejemplo
cd backend && npm run db:init && cd ..
```

Esto crea 4 tablas: `users`, `transactions`, `favorites`, `blog_posts` — e inserta 6 posts de blog de muestra.

---

## Correr el proyecto

```bash
# Frontend + Backend juntos
npm start

# Solo frontend (puerto 2588)
npm run client

# Solo backend (puerto 1357)
npm run server
```

| Servicio | URL |
|---|---|
| Frontend | http://localhost:2588 |
| Backend API | http://localhost:1357 |

---

## Bajar el proyecto

```bash
# Ctrl+C en la terminal donde corre

# O matar los procesos por puerto
kill $(lsof -t -i:2588)   # frontend
kill $(lsof -t -i:1357)   # backend
```

---

## Vistas del frontend

| Ruta | Vista |
|---|---|
| `/swap` | Swap de tokens con gráfico BNB en tiempo real |
| `/overview` | Mercado global + top 10 monedas con sparklines |
| `/coins` | Detalles de BTC/ETH/XMR/LTC con historial de precios |
| `/nft` | Galería de NFTs |
| `/blog` | Blog con posts de la BD + login/registro |
| `/prediction` | Dashboard de predicción (vista original) |

---

## API endpoints (PostgreSQL)

Todos bajo `/api/pg/...`

### Auth
```
POST /api/pg/auth/register    { email, password, username }
POST /api/pg/auth/login       { email, password }
GET  /api/pg/auth/me          [requiere token]
```

### Transacciones
```
GET  /api/pg/transactions     [requiere token]
POST /api/pg/transactions     { type, coin_id, coin_symbol, amount_usd, amount_coin }
```

### Favoritos
```
GET    /api/pg/favorites           [requiere token]
POST   /api/pg/favorites           { coin_id, coin_name, coin_symbol }
DELETE /api/pg/favorites/:coinId   [requiere token]
```

### Blog
```
GET /api/pg/blog         ?limit=10&offset=0&category=DeFi
GET /api/pg/blog/:id
```

---

## Estructura del proyecto

```
lmng2026/
├── src/
│   ├── views/          # Vistas principales (Swap, Overview, Coins, NFT, Blog)
│   ├── components/     # Header, Footer, Router, ConnectWallet...
│   ├── hooks/          # useLiveData, useAuth, useContract...
│   └── services/       # coingecko.service.ts, pg.api.service.ts
├── backend/
│   ├── app.js          # Entrada del servidor Express
│   ├── db/             # Conexión PostgreSQL + schema.sql + init.js
│   ├── controllers/    # auth, transactions, favorites, blog (PG) + legacy
│   ├── middleware/      # JWT auth (PG) + legacy
│   └── routes/         # pg.routes.js + rutas legacy
└── public/
```

---

## Notas de seguridad

- `backend/.env` está en `.gitignore` — nunca se sube al repositorio
- Las contraseñas se hashean con bcrypt (12 rounds)
- JWT tiene expiración de 7 días
- Las rutas protegidas requieren `Authorization: Bearer <token>`
