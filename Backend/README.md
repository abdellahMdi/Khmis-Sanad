# Backend — Khmis Sanad (API Laravel)

API REST découplée de Khmis Sanad, marketplace multi-vendeurs pour les coopératives et artisans marocains. Frontend React séparé : ce dossier ne contient que l’API.

## Stack

- Laravel 12 / PHP 8.3–8.5 (cahier : Laravel 13 ; le lock actuel reste en 12, compatible PHP 8.5)
- Eloquent + MySQL
- Sanctum (auth SPA cookie, pas de Bearer)
- Middlewares `role:admin|artisan|client` (équivalent Laratrust, voir écarts)
- Notifications email en queue (`NewOrderNotification`)
- Tests PHPUnit + Pint
- Docker Compose (API + MySQL + frontend) / GitHub Actions

## Décisions métier

- **Commande multi-boutiques** : `POST /api/orders` **scinde** le panier en **une commande (`commands`) par coopérative**. Le schéma n’a pas de `shop_id` sur `commands` ; les lignes (`command_lignes` → `products.coop_id`) portent la boutique. Une commande par boutique permet l’email artisan US 3.3 et un `whatsapp_number` unique.
- **WhatsApp** : pas de colonne dédiée. `whatsapp_number` est le `users.telephone` **du propriétaire de la boutique** (artisan), normalisé (ex. `06…` → `2126…`). Le frontend construit `https://wa.me/{whatsapp_number}?text=...`.
- **Invités** : hors scope v1. `paniers.user_id` est NOT NULL UNIQUE → panier et commande uniquement `role:client`.
- **Paiement** : aucune passerelle. La commande est une **réservation / mise en relation** ; le paiement se fait hors plateforme via WhatsApp.
- **Boutique** = table `cooperatives`. `terroir` API ↔ colonne `hq_location`.

## Écarts schéma ↔ US

| Besoin | Décision |
|---|---|
| `GET /api/products/{slug}` | Colonne additive `products.slug` (UNIQUE). |
| Notifications Laravel | Colonne additive `notifications.data` (JSON). IDs entiers conservés (pas d’UUID Laravel). |
| Sanctum SPA + queue + cache | Tables infra **hors domaine** : `sessions`, `jobs`, `job_batches`, `failed_jobs`, `cache`, `cache_locks`. |
| Laratrust | **Non installé** : sa table `roles` (name/display_name + pivots permissions) **entre en conflit** avec `roles(id, label)` + `users.role_id`. Middleware `role:…` identique au contrat d’API. |
| Sous-catégories | Absentes du schéma. `GET /api/categories` renvoie `children: []`. |
| `updated_at` Laravel | Non ajouté. Timestamps uniquement sur `users.created_at`, `commands.created_at`, `notifications.created_at`. |
| Mot de passe | Colonne `mot_de_passe` (pas `password`). Le JSON d’auth utilise toujours `password`. |

## Schéma / migrations

Le schéma vit uniquement dans `database/migrations/` : **un fichier = une table**, préfixe `2026_01_01_0000NN`, numérotés dans l’ordre des clés étrangères (`roles` → `users` → … → `avis` → `notifications`, puis les tables d’infra `sessions`, `cache`, `jobs`). Aucun dump `.sql` n’est maintenu. Pour repartir de zéro : `php artisan migrate:fresh --seed`.

## Auth SPA

1. `GET /sanctum/csrf-cookie` (credentials)
2. `POST /api/login` ou `POST /api/register`
3. Requêtes suivantes avec cookies + header `X-XSRF-TOKEN`

`GET /api/user` → utilisateur + `role` (`admin` \| `artisan` \| `client`) + boutique si artisan.

Inscription artisan : `role=artisan` + `shop_name` → coopérative `status=pending`.

## Install local (sans Docker)

PHP 8.5 (Herd) : `composer install --ignore-platform-reqs` car le lock Laravel 12 pinne encore des packages `php <= 8.4`. Le CI utilise PHP 8.4.

```bash
cd backend
cp .env.example .env
composer install --ignore-platform-reqs
php artisan key:generate
# Ajuster DB_* dans .env
php artisan migrate --seed
php artisan serve
php artisan queue:work
```

Comptes démo (mot de passe `Password123`) :

| Email | Rôle |
|---|---|
| admin@terroir.ma | admin |
| targanine@terroir.ma | artisan (boutique approuvée) |
| taliouine@terroir.ma | artisan (boutique approuvée) |
| pending@terroir.ma | artisan (boutique pending) |
| client@terroir.ma | client |

## Install Docker

The Compose file is at the repository root. Follow **Getting started with Docker** in the root `README.md`.

API: `http://localhost:8000`. Frontend: `http://localhost:5173`. Database from the host: `127.0.0.1:3307`, database `marketplace`, user `marketplace`, password `secret`.

## Tests / lint

```bash
cd backend
vendor/bin/pint
php artisan test
```

## Documentation API

- OpenAPI : `backend/docs/openapi.yaml`
- Postman : `backend/docs/postman_collection.json`
