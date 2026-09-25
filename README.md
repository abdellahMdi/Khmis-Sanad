# Khmis Sanad — Moroccan Artisan Marketplace

Khmis Sanad is a multi-vendor marketplace for Moroccan cooperatives and artisans. Clients browse a catalog of terroir products (argan oil, saffron, honey, spices), order them, and review what they bought. Artisans manage their own shop and products. Admins approve cooperatives and moderate reviews.

The project is split in two independent applications:

| Part | Stack | Folder | Dev URL |
|---|---|---|---|
| API | Laravel 12 (PHP 8.2+), MySQL, Sanctum | `backend/` | http://localhost:8000 |
| SPA | React 19, Vite, Redux Toolkit, Tailwind | `frontend/` | http://localhost:5173 |

There is no payment gateway. An order is a **reservation**: the buyer is put in touch with the artisan, and payment happens off-platform over WhatsApp.

---

## Table of contents

1. [What the app does](#1-what-the-app-does)
2. [Architecture](#2-architecture)
3. [Getting started with Docker](#3-getting-started-with-docker)
4. [Getting started without Docker](#4-getting-started-without-docker)
5. [Environment variables](#5-environment-variables)
6. [Demo accounts](#6-demo-accounts)
7. [Database](#7-database)
8. [API reference](#8-api-reference)
9. [Frontend](#9-frontend)
10. [Design system](#10-design-system)
11. [Tests, linting and CI](#11-tests-linting-and-ci)
12. [Project structure](#12-project-structure)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. What the app does

There are three roles, stored in the `roles` table and attached to a user through `users.role_id`.

### Client

- Browse the public catalog with search, category filter and price range.
- Open a product page with images, price, discounted price, and approved reviews.
- Add products to a cart (one cart per user, enforced by a unique `paniers.user_id`).
- Check out with a delivery address. The cart is **split by cooperative**: buying from two shops creates two orders, each with its own artisan and WhatsApp contact.
- See order history and per-order detail, with a `wa.me` link to the artisan.
- Review a product, but only after actually buying it, and only once per product. New reviews are `pending` until an admin approves them.

### Artisan (cooperative owner)

- Registers with `role=artisan` and a shop name. The cooperative starts with `status=pending` and stays invisible in the public catalog.
- Uploads a proof document (PDF or image, max 5 MB) so an admin can approve the shop.
- Edits the shop profile: name, bio, terroir (`hq_location`).
- Full CRUD on their own products, including image URLs, stock, price and discounted price.
- Sees incoming orders that contain their products, and gets an email + in-app notification for each new order.
- A shop with `status=blocked` keeps read access but loses all write access (`artisan.not_blocked` middleware).

### Admin

- Lists all cooperatives, approves them (only if a proof document exists) or blocks them.
- Moderates pending reviews: approve or delete.
- Lists all users with their role and shop status.

---

## 2. Architecture

```
┌───────────────────────────┐        cookies + X-XSRF-TOKEN        ┌──────────────────────────┐
│  React SPA (Vite :5173)   │ ───────────────────────────────────► │  Laravel API (:8000)     │
│  Redux Toolkit + RTK Query│ ◄─────────────────────────────────── │  Sanctum SPA auth        │
│  Axios (withCredentials)  │            JSON resources            │  Policies + role mw      │
└───────────────────────────┘                                      └───────────┬──────────────┘
                                                                               │ Eloquent
                                                                   ┌───────────▼──────────────┐
                                                                   │  MySQL 8 (marketplace)   │
                                                                   └──────────────────────────┘
```

**Authentication is cookie-based, not token-based.** There is no Bearer token in `localStorage`. The flow is:

1. The SPA calls `GET /sanctum/csrf-cookie` to receive the `XSRF-TOKEN` cookie.
2. It posts to `/api/login` or `/api/register` with `withCredentials: true`.
3. Laravel sets a session cookie; every later request sends the session cookie plus the `X-XSRF-TOKEN` header.
4. On boot the SPA calls `GET /api/user` to restore the session.

This requires `SANCTUM_STATEFUL_DOMAINS` to contain the SPA origin and `CORS_ALLOWED_ORIGINS` to allow it with credentials. Both default to `localhost:5173`.

Note that the password column is `mot_de_passe`, not `password`. `User::getAuthPassword()` maps it, so the JSON payloads still use `password`.

---

## 3. Getting started with Docker

Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) and leave it running. You do not need PHP, Composer, Node, or MySQL on your computer.

Three containers start together:

| Service | What it is | Address on your PC |
|---|---|---|
| `db` | MySQL 8 | `127.0.0.1:3307` (user `marketplace`, password `secret`, database `marketplace`) |
| `app` | Laravel API | http://localhost:8000 |
| `web` | React site, built from `frontend/Dockerfile` (Node 22) | http://localhost:5173 |

Port **3307** is used on purpose. XAMPP already uses 3306, and the API inside Docker still talks to MySQL on 3306.

### First time

From the project folder:

```bash
copy Backend\.env.example Backend\.env
copy frontend\.env.example frontend\.env
```

On macOS or Linux, use `cp` instead of `copy`.

Build the images and start only the database:

```bash
docker compose build
docker compose up -d db
```

Install the API and create its tables. `--no-deps` means “do not also start the website”.

```bash
docker compose run --rm --no-deps app composer install
docker compose run --rm --no-deps app php artisan key:generate
docker compose run --rm --no-deps app php artisan migrate
docker compose run --rm --no-deps app php artisan storage:link
```

Skip `key:generate` if `Backend/.env` already has an `APP_KEY`.

The site cannot register anyone until the three roles exist. Run this once:

```bash
docker compose exec db mysql -umarketplace -psecret marketplace -e "INSERT INTO roles (label) SELECT 'admin' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE label='admin'); INSERT INTO roles (label) SELECT 'artisan' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE label='artisan'); INSERT INTO roles (label) SELECT 'client' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE label='client');"
```

Install the frontend packages:

```bash
docker compose run --rm --no-deps web npm install
```

### Every time you want to work

```bash
docker compose up
```

Wait until the logs show the API and Vite are ready, then open **http://localhost:5173**.

Stop with `Ctrl+C`, or:

```bash
docker compose down
```

`docker compose down -v` also deletes the database. The next start needs `php artisan migrate` again, and the roles command again.

### What the containers already set for you

`docker-compose.yml` points the API at the `db` container (`DB_HOST=db`). Emails are written to `Backend/storage/logs/laravel.log`. Jobs run immediately (`QUEUE_CONNECTION=sync`), so you do not start a queue worker.

Your `Backend` and `frontend` folders are mounted into the containers. Saving a file updates the running app. PHP packages live in a Docker volume named `app_vendor`, and npm packages live in `web_node_modules`. After you add a package, run `composer install` or `npm install` with the same `docker compose run` commands as above.

`RoleSeeder` and `DemoSeeder` are not in the repository, so the catalog starts empty. When those files exist:

```bash
docker compose exec app php artisan db:seed
```

---

## 4. Getting started without Docker

### Prerequisites

- PHP 8.2+ with the `pdo_mysql`, `mbstring`, `intl` and `zip` extensions
- Composer 2
- Node.js 22 and npm
- A MySQL 8 server (XAMPP, Laragon, Herd…)

### Backend

```bash
cd backend
cp .env.example .env          # Windows: copy .env.example .env
composer install
php artisan key:generate
```

Create an empty database, then set `DB_DATABASE`, `DB_USERNAME` and `DB_PASSWORD` in `.env`. Then:

```bash
php artisan migrate --seed
php artisan storage:link      # needed so uploaded shop proofs are reachable
php artisan serve             # http://127.0.0.1:8000
```

On PHP 8.5 the Laravel 12 lock file still pins some packages to `php <= 8.4`, so use `composer install --ignore-platform-reqs`.

If you set `QUEUE_CONNECTION=database`, also run a worker in a separate terminal, otherwise order notifications stay queued:

```bash
php artisan queue:work
```

### Frontend

```bash
cd frontend
cp .env.example .env          # Windows: copy .env.example .env
npm install
npm run dev                   # http://localhost:5173
```

---

## 5. Environment variables

### `backend/.env`

| Variable | Default | Why it matters |
|---|---|---|
| `APP_KEY` | — | Required. Generate with `php artisan key:generate`. |
| `APP_URL` | `http://localhost:8000` | Used in mail links and Sanctum defaults. |
| `DB_CONNECTION` | `mysql` | `sqlite` is used by the test suite only. |
| `DB_HOST` / `DB_PORT` | `127.0.0.1` / `3306` | `db` / `3306` under Docker. |
| `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` | `marketplace` / `marketplace` / `secret` | Must match your MySQL server. |
| `SANCTUM_STATEFUL_DOMAINS` | `localhost:5173,localhost:8000` | The SPA origin must be listed or login silently fails. |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Comma-separated origins allowed to send credentials. |
| `SESSION_DRIVER` | `file` | `database` also works (the `sessions` table exists). |
| `QUEUE_CONNECTION` | `database` | Use `sync` if you do not want to run a worker. |
| `MAIL_MAILER` | `smtp` | Use `log` locally to write emails to the log file. |
| `FILESYSTEM_DISK` | `local` | Shop proofs are written to the `public` disk. |

### `frontend/.env`

| Variable | Default | Why it matters |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | API origin **without** the `/api` suffix. |

---

## 6. Demo accounts

Created by `DemoSeeder`. Every account uses the password **`Password123`**.

| Email | Role | Notes |
|---|---|---|
| `admin@terroir.ma` | admin | Approves shops, moderates reviews |
| `client@terroir.ma` | client | Has one approved and one pending review |
| `targanine@terroir.ma` | artisan | Coopérative Targanine — approved |
| `taliouine@terroir.ma` | artisan | Coopérative Taliouine — approved |
| `pending@terroir.ma` | artisan | Rucher de l'Atlas — pending, invisible in the catalog |

The seeder also creates four categories (Huiles, Épices, Miels, Produits du terroir) and five products spread across the two approved shops.

---

## 7. Database

The schema lives entirely in `backend/database/migrations/`. There is **one migration file per table**, and each file creates exactly one table — no SQL dump, no combined migration. Files are numbered so foreign keys are always created after their target table.

| # | Migration file | Table | Purpose |
|---|---|---|---|
| 01 | `..._create_roles_table.php` | `roles` | `admin`, `artisan`, `client` |
| 02 | `..._create_users_table.php` | `users` | Accounts; password stored in `mot_de_passe`; FK → `roles` |
| 03 | `..._create_categories_table.php` | `categories` | Product categories |
| 04 | `..._create_cooperatives_table.php` | `cooperatives` | Shops; `status` pending/approved/blocked, `proof_path`; FK → `users` (unique, one shop per artisan) |
| 05 | `..._create_products_table.php` | `products` | `prix`, `prix_remise`, `stock`, unique `slug`; FK → `cooperatives`, `categories` |
| 06 | `..._create_product_img_table.php` | `product_img` | Image URLs with display `order`; FK → `products` |
| 07 | `..._create_paniers_table.php` | `paniers` | One cart per user (unique `user_id`) |
| 08 | `..._create_panier_items_table.php` | `panier_items` | Cart lines; FK → `paniers`, `products` |
| 09 | `..._create_commands_table.php` | `commands` | Orders; `total`, `statut`, `adresse_livraison`; FK → `users` (`SET NULL`) |
| 10 | `..._create_command_lignes_table.php` | `command_lignes` | Order lines with frozen `prix_unitaire`; FK → `commands`, `products` |
| 11 | `..._create_avis_table.php` | `avis` | Reviews; `note` 1–5 (CHECK on MySQL), `status`, unique `(user_id, product_id)` |
| 12 | `..._create_notifications_table.php` | `notifications` | In-app notifications with JSON `data`; integer PK, not Laravel's UUID |
| 13 | `..._create_sessions_table.php` | `sessions` | Session driver storage |
| 14–15 | `..._create_cache_table.php`, `..._create_cache_locks_table.php` | `cache`, `cache_locks` | Database cache driver |
| 16–18 | `..._create_jobs_table.php`, `..._create_job_batches_table.php`, `..._create_failed_jobs_table.php` | `jobs`, `job_batches`, `failed_jobs` | Database queue driver |

All files share the `2026_01_01_0000NN` prefix. Run `php artisan migrate:fresh --seed` to rebuild from scratch.

### Relationship overview

```
roles 1───* users 1───1 cooperatives 1───* products *───1 categories
                │                              │
                │                              ├──* product_img
                ├──1 paniers ──* panier_items ─┤
                ├──* commands ─* command_lignes┤
                ├──* avis ─────────────────────┘
                └──* notifications
```

### Deliberate schema choices

- **Orders have no `shop_id`.** A shop is reached through `command_lignes → products.coop_id`. Because checkout creates one order per cooperative, every order still maps to exactly one shop.
- **WhatsApp has no dedicated column.** The number is the shop owner's `users.telephone`, normalized by `App\Support\WhatsApp` (`06…` becomes `2126…`).
- **Guest checkout is out of scope.** `paniers.user_id` is `NOT NULL UNIQUE`, so carts and orders require a logged-in client.
- **Laratrust is not installed.** Its `roles` table would conflict with `roles(id, label)` + `users.role_id`. The `role:` middleware provides the same guarantees.
- **Timestamps are minimal.** Only `users.created_at`, `commands.created_at` and `notifications.created_at` exist; the models set `UPDATED_AT = null` accordingly.

---

## 8. API reference

Every route below is prefixed with `/api`. `GET /sanctum/csrf-cookie` (outside `/api`) must be called once before the first write request.

### Public

| Method | Path | Description |
|---|---|---|
| POST | `/register` | Register a client, or an artisan with `role=artisan` + `shop_name`. Logs the user in. |
| POST | `/login` | Email + password, opens a session. |
| GET | `/products` | Paginated catalog. Query: `q`, `category`, `min_price`, `max_price`, `per_page` (default 12). Only products of approved shops. |
| GET | `/products/{slug}` | Product detail with approved reviews and a `meta.viewer` block (`has_purchased`, `has_reviewed`, `can_review`). |
| GET | `/categories` | All categories. |

### Authenticated (`auth:sanctum`)

| Method | Path | Description |
|---|---|---|
| GET | `/user` | Current user with role and cooperative. |
| POST | `/logout` | Invalidates the session. |

### Client (`role:client`)

| Method | Path | Description |
|---|---|---|
| GET | `/cart` | Cart with items and products. |
| POST | `/cart/items` | Add `product_id` + `quantite`. Checks stock and shop approval. |
| PATCH | `/cart/items/{item}` | Change quantity. |
| DELETE | `/cart/items/{item}` | Remove a line. |
| POST | `/orders` | Checkout with `adresse_livraison`. Splits by shop, decrements stock, notifies artisans, clears the cart. Returns one order per shop. |
| GET | `/orders` | Order history. |
| GET | `/orders/{command}` | Order detail with `whatsapp_number`. |
| POST | `/reviews` | Create a review. 422 if the product was not purchased or is already reviewed. |

### Artisan (`role:artisan`)

| Method | Path | Blocked shop | Description |
|---|---|---|---|
| GET | `/shop` | allowed | Own cooperative. |
| POST | `/shop/proof` | allowed | Upload proof (pdf/jpg/jpeg/png, max 5 MB). |
| PUT | `/shop` | denied | Update name, bio, terroir. |
| GET | `/shop/products` | denied | Own products, paginated. |
| GET | `/shop/products/{product}` | denied | One own product. |
| POST | `/shop/products` | denied | Create a product with image URLs. |
| PUT | `/shop/products/{product}` | denied | Update a product. `prix_remise` must stay below `prix`. |
| DELETE | `/shop/products/{product}` | denied | Delete a product. |
| GET | `/shop/orders` | denied | Orders containing this shop's products. |


## 9. Frontend

A single-page app. Admin and artisan areas are lazy-loaded so a client never downloads dashboard code.

| Path | Page | Access |
|---|---|---|
| `/` | Home: hero, categories, featured products | public |
| `/produits` | Catalog with filters | public |
| `/produits/:id` | Product detail and reviews (`:id` is the slug) | public |
| `/login`, `/register` | Auth forms | guests only |
| `/panier` | Cart | client |
| `/commande` | Checkout | client |
| `/commandes`, `/commandes/:id` | Order history and detail | client |
| `/artisan/boutique` | Shop profile and proof upload | artisan |
| `/artisan/produits` | Product list, create, edit | artisan |
| `/artisan/commandes` | Incoming orders | artisan |
| `/admin/cooperatives` | Approve / block shops | admin |
| `/admin/avis` | Moderate reviews | admin |
| `/admin/utilisateurs` | User list | admin |
| `/403`, `*` | Forbidden and 404 | public |

`ProtectedRoute` redirects anonymous visitors to `/login` (remembering where they came from) and wrong-role users to `/403`. `GuestRoute` pushes signed-in users away from the auth pages.

## 10. Design system

Brand tokens are defined in `frontend/tailwind.config.js` and derived from the cooperative's logo.

| Token | Hex | Used for |
|---|---|---|
| `brand-primary` | `#1F6B3A` | Section titles, primary actions, links |
| `brand-accent` | `#D0121A` | Active nav state, highlights, theme color |
| `brand-bg` | `#F5F2EB` | Page background |
| `brand-text` | `#2C221E` | Body copy |
| `brand-gold` | `#E2B880` | Card borders, dividers, selection |

Extended shades (`terracotta`, `safran`, `zellige`, `olive`, `henne`, `sable`, `encre`) are available for badges and accents. Typography is Source Sans 3, loaded from Google Fonts.

Reusable utility classes in `src/index.css`: `.nav-link`, `.input-field`, `.card-panel`, `.section-title`.

Logos live in `frontend/public/myassets/`: `headerimg.png` in the header, `biglogo.png` on home and auth pages, `botomimag.png` inverted on the black footer, `vite.svg` as favicon.

---
### Frontend

```bash
cd frontend
npm test                # Vitest + Testing Library
npm run lint            # ESLint
npm run build           # production bundle
```

Covered: login validation and submission, add-to-cart and review submission on the product page, checkout confirmation, and route guard behavior.

### Continuous integration

`.github/workflows/ci.yml` runs on every push and pull request: the frontend job installs, lints, tests and builds; the backend job installs on PHP 8.4, runs Pint and the test suite.

---

## 12. Project structure

```
khmis-sanad/
├── docker-compose.yml           # db + app + web, local development only
├── .github/workflows/ci.yml
├── backend/
│   ├── Dockerfile               # PHP 8.4 CLI + Composer
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/ # Public, client, artisan and Admin/ controllers
│   │   │   ├── Middleware/      # RoleMiddleware, EnsureArtisanNotBlocked
│   │   │   ├── Requests/        # Form requests grouped by domain
│   │   │   └── Resources/       # JSON output shapes
│   │   ├── Models/              # User, Role, Cooperative, Product, Panier, Command, Avis…
│   │   ├── Notifications/       # NewOrderNotification + integer-PK database channel
│   │   ├── Policies/            # Ownership rules
│   │   └── Support/WhatsApp.php # Phone number normalization
│   ├── database/
│   │   ├── migrations/          # One file per table
│   │   ├── factories/           # Test factories
│   │   └── seeders/             # RoleSeeder, DemoSeeder
│   ├── docs/                    # openapi.yaml, postman_collection.json
│   ├── routes/api.php
│   └── tests/Feature/
└── frontend/
    ├── Dockerfile               # Node 22, Vite dev server
    ├── public/myassets/         # Logos and favicon
    └── src/
        ├── api/                 # Axios client + RTK Query endpoints
        ├── components/          # Header, Footer, ProductCard, ReviewForm, Button…
        ├── hooks/               # useProductFilters
        ├── layouts/             # RootLayout, ArtisanLayout, AdminLayout
        ├── pages/               # Public pages + artisan/ + admin/
        ├── routes/              # ProtectedRoute, GuestRoute
        ├── store/               # Redux store and auth slice
        └── utils/format.js      # MAD formatting, WhatsApp links, error messages
```

---

## 13. Troubleshooting

**Login returns 419 or CSRF mismatch.** The SPA origin is missing from `SANCTUM_STATEFUL_DOMAINS`, or `CORS_ALLOWED_ORIGINS` does not list it. Both must include `localhost:5173` exactly as the browser sees it. Then clear cookies and `php artisan config:clear`.

**Login returns 401 with correct credentials.** Passwords live in `mot_de_passe`. If you inserted a user manually, hash the value with bcrypt.

**A product does not show in the catalog.** Its cooperative is probably `pending` or `blocked`. Approve it from `/admin/cooperatives` — which itself requires the artisan to have uploaded a proof document first.

**A new review does not appear on the product page.** That is expected: reviews are created with `status=pending` and only become public after an admin approves them in `/admin/avis`.

**Order emails never arrive.** With `QUEUE_CONNECTION=database` you must run `php artisan queue:work`. Set `QUEUE_CONNECTION=sync` to send in-process, and `MAIL_MAILER=log` to write them to `storage/logs/laravel.log`.

**Uploaded proof documents return 404.** Run `php artisan storage:link`.

**`composer install` fails on PHP 8.5.** Use `composer install --ignore-platform-reqs`; the Laravel 12 lock file still pins some packages to PHP 8.4.

**Port 5173 or 8000 is already in use.** Stop the other process, or change the published port in `docker-compose.yml` and keep `VITE_API_URL` in sync.

---

Component-level notes live in [`backend/README.md`](backend/README.md) and [`frontend/README.md`](frontend/README.md).
