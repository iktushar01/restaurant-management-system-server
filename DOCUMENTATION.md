# DineFlow — Server Product Documentation

DineFlow Server is the REST API backend for the DineFlow restaurant management system. It handles authentication, restaurant operations, orders, floor plans, inventory, finance, HR, banking, and reporting.

**Base URL (development):** `http://localhost:5000`  
**API prefix:** `/api/v1`

---

## Table of Contents

1. [Architecture](#architecture)
2. [Getting Started](#getting-started)
3. [Environment Variables](#environment-variables)
4. [Database Setup](#database-setup)
5. [Authentication](#authentication)
6. [API Conventions](#api-conventions)
7. [Core Restaurant APIs](#core-restaurant-apis)
8. [Dine & Floor Plan APIs](#dine--floor-plan-apis)
9. [Order APIs](#order-apis)
10. [Inventory APIs](#inventory-apis)
11. [Finance APIs](#finance-apis)
12. [HR APIs](#hr-apis)
13. [Bank APIs](#bank-apis)
14. [Due & Report APIs](#due--report-apis)
15. [Data Models](#data-models)
16. [Business Rules](#business-rules)
17. [Seeding](#seeding)
18. [Deployment](#deployment)
19. [Troubleshooting](#troubleshooting)

---

## Architecture

```
Client (React/Vite)
        │  HTTPS + cookies
        ▼
Express 5 App (src/app.ts)
        ├── /api/auth          → Better Auth
        └── /api/v1/*          → REST modules
                ├── auth, users
                ├── foods, food-categories
                ├── dine-locations, dine-tables, dine/floor-plan
                ├── waiters, work-periods, orders
                ├── property, currencies
                ├── inventory (incl. events)
                ├── finance, bank, hr, due, reports, dashboard
                ▼
        Prisma ORM → PostgreSQL
```

**Stack:** Node.js, Express 5, TypeScript, Prisma 7, PostgreSQL, Better Auth, Zod validation, JWT access/refresh tokens, Cloudinary (uploads), Nodemailer (email).

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Install

```bash
cd restaurant-management-system-server
npm install
```

### Environment

Create a `.env` file in the server root. All variables listed in [Environment Variables](#environment-variables) are **required** at startup.

### Database migrate & seed

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### Run development server

```bash
npm run dev
```

Server starts at **http://localhost:5000**. Health check: `GET /` returns `DineFlow Server is running`.

### Production build

```bash
npm run build
npm run start
```

---

## Environment Variables

| Variable | Example | Purpose |
|----------|---------|---------|
| `PORT` | `5000` | HTTP port |
| `NODE_ENV` | `development` | Environment mode |
| `DATABASE_URL` | `postgresql://...` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | random string | Better Auth encryption |
| `BETTER_AUTH_URL` | `http://localhost:5000` | Auth server URL |
| `FRONTEND_URL` | `http://localhost:5173` | CORS allowed origin |
| `ACCESS_TOKEN_SECRET` | random string | JWT access token |
| `REFRESH_TOKEN_SECRET` | random string | JWT refresh token |
| `ACCESS_TOKEN_EXPIRES_IN` | `15m` | Access token TTL |
| `REFRESH_TOKEN_EXPIRES_IN` | `7d` | Refresh token TTL |
| `BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN` | `7d` | Session TTL |
| `BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE` | `1d` | Session refresh age |
| `EMAIL_HOST` | `smtp.gmail.com` | SMTP host |
| `EMAIL_PORT` | `587` | SMTP port |
| `EMAIL_SECURE` | `false` | TLS |
| `EMAIL_USER` | email | SMTP user |
| `EMAIL_PASSWORD` | app password | SMTP password |
| `EMAIL_FROM` | `"DineFlow <...>"` | From address |
| `EXPIRE_OTP_TIME` | `10m` | OTP expiry |
| `GOOGLE_CLIENT_ID` | ... | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | ... | Google OAuth |
| `GOOGLE_CALLBACK_URL` | ... | OAuth callback |
| `CLOUDINARY_CLOUD_NAME` | ... | Image uploads |
| `CLOUDINARY_API_KEY` | ... | Image uploads |
| `CLOUDINARY_API_SECRET` | ... | Image uploads |
| `IMGBB_API_KEY` | ... | Alternate image host |
| `SUPER_ADMIN_EMAIL` | `admin@example.com` | Seed super admin |
| `SUPER_ADMIN_PASSWORD` | `...` | Seed super admin |

> `FRONTEND_URL` must match the client origin for cookie-based auth and CORS.

---

## Database Setup

Prisma schemas live in `prisma/schema/`:

| File | Models |
|------|--------|
| `restaurant.prisma` | Property, WorkPeriod, FoodCategory, Food, DineLocation, DineTable, Waiter, Order, OrderItem |
| `inventory.prisma` | Categories, items, stock, purchases, vendors, events |
| `finance.prisma` | Income/expense heads and entries |
| `bank.prisma` | Banks, branches, accounts, transactions |
| `hr.prisma` | Designations, employees, payroll |
| `due.prisma` | Due records |
| `auth.prisma` | Auth sessions, accounts |
| `admin.prisma` | Admin users |
| `enums.prisma` | Shared enums |

Commands:

```bash
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Apply migrations (dev)
npm run db:seed       # Seed sample data
```

---

## Authentication

### Endpoints — `/api/v1/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | Public | Register user (with optional image) |
| POST | `/login` | Public | Email/password login |
| POST | `/refresh-token` | Public | Refresh JWT |
| POST | `/verify-email` | Public | Email verification OTP |
| POST | `/forget-password` | Public | Request reset |
| POST | `/reset-password` | Public | Reset with token |
| GET | `/login/google` | Public | Google OAuth redirect |
| GET | `/google/success` | Public | OAuth success |
| GET | `/oauth/code` | Public | Exchange OAuth code |
| GET | `/me` | Required | Current user profile |
| PATCH | `/me` | Required | Update profile |
| POST | `/change-password` | Required | Change password |
| POST | `/logout` | Required | Logout |

Better Auth is also mounted at `/api/auth`.

### Roles

```
STAFF | WAITER | MANAGER | CASHIER | ADMIN | SUPER_ADMIN
```

Most restaurant routes accept **all roles** via `checkAuth(...ALL_ROLES)`.

### Login request

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your-password"
}
```

Response sets HTTP-only cookies for access and refresh tokens. The client sends `credentials: "include"` on subsequent requests.

---

## API Conventions

### Response shape

Successful responses typically follow:

```json
{
  "success": true,
  "message": "...",
  "data": { }
}
```

Paginated list responses include `meta`:

```json
{
  "data": [],
  "meta": { "page": 1, "limit": 10, "total": 50, "totalPages": 5 }
}
```

### Errors

Validation and business errors return appropriate HTTP status codes with a `message` field.

### Auth header

Cookie-based auth is primary. Protected routes use the `checkAuth` middleware.

---

## Core Restaurant APIs

### Property — `/api/v1/property`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Get property (restaurant) info |
| PATCH | `/` | Update property (incl. `vatPercent`, `serviceChargePercent`) |

### Work Periods — `/api/v1/work-periods`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List periods (`?page=&limit=`) |
| GET | `/active` | Get currently open period |
| GET | `/:id` | Get period by ID |
| POST | `/open` | Open period — body: `{ "openingCash": 0 }` |
| PATCH | `/:id/close` | Close period — body: `{ "closingCash": 0 }` |

**Rules:**
- Only one `OPEN` period allowed at a time.
- Closing sets `endDate` and `status: CLOSED`.

### Food Categories — `/api/v1/food-categories`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Paginated list |
| GET | `/all` | All categories (no pagination) |
| GET | `/:id` | By ID |
| POST | `/` | Create |
| PATCH | `/:id` | Update |
| DELETE | `/:id` | Soft delete |

### Foods — `/api/v1/foods`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Paginated list |
| GET | `/all` | All foods |
| GET | `/:id` | By ID |
| POST | `/` | Create |
| PATCH | `/:id` | Update |
| DELETE | `/:id` | Soft delete |

### Waiters — `/api/v1/waiters`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Paginated list |
| GET | `/all` | All waiters (for dropdowns) |
| GET | `/:id` | By ID |
| POST | `/` | Create |
| PATCH | `/:id` | Update |
| DELETE | `/:id` | Soft delete |

### Currencies — `/api/v1/currencies`

CRUD for currency configuration.

### Dashboard — `/api/v1/dashboard`

Dashboard summary metrics for the client home screen.

---

## Dine & Floor Plan APIs

### Dine Locations — `/api/v1/dine-locations`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Paginated list |
| GET | `/all` | All locations |
| GET | `/:id` | By ID |
| POST | `/` | Create — `{ "name", "type?" }` |
| PATCH | `/:id` | Update (incl. `positionX`, `positionY`, `width`, `height` for floor plan) |
| DELETE | `/:id` | Soft delete |

### Dine Tables — `/api/v1/dine-tables`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Paginated list |
| GET | `/all` | All tables |
| GET | `/:id` | By ID |
| POST | `/` | Create — `{ "locationId", "tableNo", "capacity" }` |
| PATCH | `/:id` | Update (incl. `positionX`, `positionY`) |
| PATCH | `/:id/status` | Update status — `{ "status": "AVAILABLE" \| "OCCUPIED" \| "RESERVED" }` |
| DELETE | `/:id` | Soft delete |

### Floor Plan — `/api/v1/dine/floor-plan`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Full floor plan payload |
| POST | `/reset` | Clear saved positions; revert to auto-layout |

#### GET `/` response structure

```json
{
  "data": {
    "canvas": { "width": 1400, "height": 900, "gridSize": 10 },
    "locations": [
      {
        "id": "uuid",
        "name": "Central",
        "type": "Indoor",
        "positionX": 40,
        "positionY": 40,
        "width": 300,
        "height": 220,
        "hasSavedPosition": true
      }
    ],
    "tables": [
      {
        "id": "uuid",
        "tableNo": "A1",
        "capacity": 4,
        "locationId": "uuid",
        "locationName": "Central",
        "status": "Vacant",
        "statusRaw": "AVAILABLE",
        "positionX": 60,
        "positionY": 90,
        "hasSavedPosition": false
      }
    ]
  }
}
```

**Auto-layout:** When `positionX`/`positionY` are null, the server computes default grid positions from zone index and table index within the zone.

**Client save flow:** On drag end, the client PATCHes `dine-locations/:id` or `dine-tables/:id` with new coordinates.

---

## Order APIs

### Orders — `/api/v1/orders`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/current` | Active orders (not COMPLETED/CANCELLED) |
| GET | `/` | Paginated list (`?status=&page=&limit=`) |
| GET | `/:id` | Order detail |
| POST | `/` | Create order |
| PATCH | `/:id/status` | Update status |
| PATCH | `/:id/cancel` | Cancel order |

#### Create order body

```json
{
  "orderType": "DINE_IN",
  "tableId": "uuid",
  "tableIds": ["uuid", "uuid"],
  "waiterId": "uuid",
  "persons": 4,
  "notes": "No spice",
  "items": [
    {
      "foodId": "uuid",
      "quantity": 2,
      "sideDish": "Extra Sauce",
      "sideDishQty": 1,
      "note": "Mild",
      "price": 395
    }
  ]
}
```

**`orderType` values:** `DINE_IN`, `TAKEAWAY`, `DELIVERY`

**On create:**
1. Validates waiter and table(s).
2. Computes `subtotal` and `total` from item prices × quantities.
3. Links to active work period (creates one if none open).
4. For `DINE_IN` with a primary table → sets table status to `OCCUPIED`.
5. Multiple tables → appends `Tables: A1, A2` to notes.

#### Update status body

```json
{ "status": "PREPARING" }
```

**Status enum:** `PENDING`, `PREPARING`, `READY`, `SERVED`, `COMPLETED`, `CANCELLED`

Completing or cancelling an order can release the table back to `AVAILABLE` (see `order.service.ts`).

---

## Inventory APIs

Base path: `/api/v1/inventory`

### Master data

| Resource | Path prefix |
|----------|-------------|
| Categories | `/categories` |
| Sub-categories | `/sub-categories` |
| Brands | `/brands` |
| Units | `/units` |
| Vendors | `/vendors` |
| Stock locations | `/stock-locations` |
| Items | `/items` |

Standard CRUD: `GET`, `POST`, `GET /:id`, `PATCH /:id`, `DELETE /:id`  
Items also: `GET /items/all`

### Stock operations

| Method | Path | Description |
|--------|------|-------------|
| GET | `/stock` | Stock by location |
| POST | `/stock/in` | Stock in |
| POST | `/stock/out` | Stock out |
| POST | `/stock/move` | Move between locations |

### Purchases & payments

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/purchases` | Purchase records |
| GET/POST | `/vendor-payments` | Vendor payments |
| GET | `/vendors/due-purchases` | Vendors with outstanding dues |

### Events

| Method | Path | Description |
|--------|------|-------------|
| GET | `/events` | List events |
| GET | `/events/today` | Today's events |
| GET/POST/PATCH/DELETE | `/events/:id` | CRUD |

---

## Finance APIs

Base path: `/api/v1/finance`

| Resource | Paths |
|----------|-------|
| Income heads | `/income-heads` |
| Income entries | `/income-entries` |
| Expense heads | `/expense-heads` |
| Expense entries | `/expense-entries` |

Each supports list (paginated), create, get by ID, update, delete.

---

## HR APIs

Base path: `/api/v1/hr`

| Resource | Path |
|----------|------|
| Designations | `/designations` |
| Earning heads | `/earning-heads` |
| Deduction heads | `/deduction-heads` |
| Employees | `/employees` |
| Employee earnings | `/employees/:employeeId/earnings` |
| Employee deductions | `/employees/:employeeId/deductions` |
| Basic salary | `/employees/:employeeId/basic-salary` |
| Salary payments | `/employees/:employeeId/salary-payments` |
| Salary payable report | `/salary-payable` |
| Grand salary payable | `/grand-salary-payable` |

---

## Bank APIs

Base path: `/api/v1/bank`

Hierarchical structure:

```
/banks → /branches → /accounts → /transactions
```

Plus bank statements endpoints.

---

## Due & Report APIs

| Module | Base path |
|--------|-----------|
| Due | `/api/v1/due` |
| Reports | `/api/v1/reports` |

---

## Data Models

### Key enums

```typescript
// DineTableStatus
AVAILABLE | OCCUPIED | RESERVED

// OrderStatus
PENDING | PREPARING | READY | SERVED | COMPLETED | CANCELLED

// OrderType
DINE_IN | TAKEAWAY | DELIVERY

// WorkPeriodStatus
OPEN | CLOSED

// Availability (food)
AVAILABLE | UNAVAILABLE
```

### Entity relationships

```
WorkPeriod 1──* Order
DineLocation 1──* DineTable
DineTable 1──* Order (optional)
Waiter 1──* Order
FoodCategory 1──* Food
Food 1──* OrderItem
Order 1──* OrderItem
Property (singleton-style restaurant config)
```

### Soft deletes

`Food`, `FoodCategory`, `DineLocation`, `DineTable`, and `Waiter` use `isDeleted` / `deletedAt` instead of hard deletes.

---

## Business Rules

### Work period

1. Opening a period when one is already `OPEN` → `400 Bad Request`.
2. Orders always attach to the active period; if none exists at order time, one is created automatically with `openingCash: 0`.
3. Closing records `closingCash` and sets `status: CLOSED`.

### Dine-in tables

1. Creating a dine-in order marks the primary table `OCCUPIED`.
2. Floor plan GET merges DB positions with computed defaults for unsaved layouts.
3. Reset floor plan nulls all `positionX`, `positionY`, `width`, `height` on locations and `positionX`, `positionY` on tables.

### Orders

1. `waiterId` is required and must reference a non-deleted waiter.
2. `items` array must have at least one entry.
3. `price` on each item is stored at order time (snapshot pricing).
4. Multi-table selection: primary `tableId` is first of `tableIds`; all table numbers stored in notes.

### Property charges

`vatPercent` and `serviceChargePercent` on Property are used for billing configuration (client Charges page).

---

## Seeding

```bash
npm run db:seed
```

The seed script (`prisma/seed.ts`) creates:

- **Food categories** (10 Thai categories) and **sample foods** (15 items) if none exist
- **Property** — "DineFlow Restaurant"
- **Dine locations** — Central, Terrace, Bar Area, Private Room
- **Tables** — sample tables per zone (e.g. KABIN 1, A2–A4, B1–B2)
- **Waiters**, inventory, events, finance, bank, HR, and due sample data (separate seed functions)

On server startup, `seedSuperAdmin()` creates the super admin from `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD`.

---

## Deployment

### CORS

Allowed origins are configured in `src/app.ts`:

```typescript
origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL, "http://localhost:3000", "http://localhost:5173", "http://localhost:5000"]
```

Add your production client URL to `FRONTEND_URL`.

### Vercel

The server exports the Express app; `bootstrap()` is skipped when `VERCEL=1`. Use `PORT` from the platform.

### Railway / Docker

Set `DATABASE_URL` and all required env vars. Run migrations before first deploy:

```bash
npx prisma migrate deploy
npm run db:seed   # optional, first environment only
```

### Client connection

Point the client `VITE_API_URL` to your deployed server URL.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Server won't start — env error | Ensure every variable in `src/config/env.ts` `requiredEnvVariables` is set |
| `401` on API calls | Login first; check cookies; verify `FRONTEND_URL` CORS |
| Prisma client missing | Run `npm run db:generate` |
| Migration drift | Run `npm run db:migrate` |
| No seed data | Run `npm run db:seed` |
| Cannot open work period | Close existing open period first |
| Floor plan shows defaults only | Positions are null in DB until client saves drag positions |
| Order table not found | Table may be soft-deleted; verify UUID |

---

## API Route Index

Full mount table from `src/app/routes/index.ts`:

| Prefix | Module |
|--------|--------|
| `/api/v1/auth` | Authentication |
| `/api/v1/users` | Users |
| `/api/v1/food-categories` | Menu categories |
| `/api/v1/foods` | Menu items |
| `/api/v1/property` | Restaurant property |
| `/api/v1/dine-locations` | Dining zones |
| `/api/v1/dine-tables` | Tables |
| `/api/v1/dine/floor-plan` | Floor plan layout |
| `/api/v1/waiters` | Waiters |
| `/api/v1/work-periods` | Work periods |
| `/api/v1/orders` | Orders |
| `/api/v1/dashboard` | Dashboard |
| `/api/v1/inventory` | Inventory & events |
| `/api/v1/finance` | Income & expense |
| `/api/v1/currencies` | Currencies |
| `/api/v1/hr` | HR & payroll |
| `/api/v1/bank` | Banking |
| `/api/v1/due` | Dues |
| `/api/v1/reports` | Reports |

For end-user workflows and UI steps, see **restaurant-management-system-client/DOCUMENTATION.md**.
