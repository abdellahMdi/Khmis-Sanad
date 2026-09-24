# Frontend — Khmis Sanad

SPA React (Vite) de Khmis Sanad. Backend Laravel séparé.

## Décisions

- **Images produit** : l’API n’a pas d’upload multipart. Le formulaire artisan saisit des **URLs** (`product_img.url`).
- **Recherche catalogue** : `LIKE` backend, debounce 350 ms sur `?q=`.
- **Tunnel de commande** : **une page** (récap groupé par boutique + adresse). `POST /api/orders` peut renvoyer **plusieurs commandes** (une par coopérative).
- **Fiche produit** : route `/produits/:id` où `:id` est le **slug** API (`GET /api/products/{slug}`).
- **Admin coopératives** : liste paginée via `GET /api/admin/shops`.

## Auth Sanctum

Axios `withCredentials: true`. `GET /sanctum/csrf-cookie` avant POST. Aucun Bearer en localStorage. Au boot : `GET /api/user`.

`VITE_API_URL` = origine du backend (sans `/api`), ex. `http://localhost:8000`.

## Install sans Docker

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Backend : `http://localhost:8000` (CORS + `SANCTUM_STATEFUL_DOMAINS` déjà prévus pour `:5173`).

```bash
npm test
```

## Docker

À la racine du repo :

```bash
docker compose up --build
```

Frontend : `http://localhost:5173` (`VITE_API_URL=http://localhost:8000`).
