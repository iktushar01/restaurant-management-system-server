# Express Prisma Auth Server...

Express Prisma Auth Server is the developer-friendly backend for Starter. It powers authentication and admin workflows through a modular Express + Prisma API.

## Features

- Better Auth based auth system with email/password and Google login
- JWT access and refresh token flow
- Prisma-powered PostgreSQL data layer
- Modular route structure for auth, users, and admins
- Cloudinary-based media upload pipeline
- OTP email verification and password reset flow
- TypeScript-first codebase with validation and reusable utilities

## Technologies Used

- Node.js
- Express 5
- TypeScript
- Prisma
- PostgreSQL
- Better Auth
- Zod
- Cloudinary
- Nodemailer
- JWT
- Vercel

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Create your environment file

Copy `.env.example` to `.env` and update the values.

Required variables include:

```env
PORT=5000
DATABASE_URL=your_database_url
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
EMAIL_FROM="Acadex <your_email@gmail.com>"
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SUPER_ADMIN_EMAIL=your_super_admin_email
SUPER_ADMIN_PASSWORD=your_super_admin_password
```

### 3. Start the development server

```bash
npm run dev
```

The API will run at [http://localhost:5000](http://localhost:5000).

### 4. Build the server

```bash
npm run build
```

### 5. Run the server

```bash
npm run start
```

## Deploy on Render

### Step 1 — PostgreSQL

Create a **PostgreSQL** database on Render (or use Neon). Copy the **External Database URL**.

### Step 2 — Environment variables

In your Web Service → **Environment**, add **every** variable from `.env.example`.  
**`DATABASE_URL` is required** — without it, `prisma migrate deploy` fails with:

`The datasource.url property is required in your Prisma config file`

Minimum production values:

| Variable | Example |
|----------|---------|
| `DATABASE_URL` | `postgresql://...` (from Render Postgres or Neon) |
| `NODE_ENV` | `production` |
| `BETTER_AUTH_URL` | `https://restaurant-management-system-server-2ns0.onrender.com` |
| `FRONTEND_URL` | Your Vercel client URL (not `localhost:5173`) |
| `BETTER_AUTH_SECRET` | Long random string |
| `ACCESS_TOKEN_SECRET` | Long random string |
| `REFRESH_TOKEN_SECRET` | Long random string |
| … | All other vars from `.env.example` |

Copy the rest from your local `.env` (secrets, email, Cloudinary, etc.).

### Step 3 — Render service settings

| Setting | Value |
|---------|--------|
| **Root Directory** | *(leave completely empty)* |
| **Build Command** | `npm install` |
| **Pre-Deploy Command** | `npm run db:deploy` |
| **Start Command** | `npm start` |

Do **not** use:
- `npm install && npx prisma migrate deploy` as Build Command (migrations belong in Pre-Deploy)
- `node src/server.ts` as Start Command

**You must add `DATABASE_URL` in Environment before deploy.** Without it, Pre-Deploy migrations and the running app will fail.

### Step 4 — Redeploy

Save environment variables, then trigger **Manual Deploy**. Migrations run in Pre-Deploy; the app starts with `tsx src/server.ts`.

> **Note:** `src/app.ts` was renamed to `src/expressApp.ts` to avoid a naming conflict with the `src/app/` folder (`ERR_UNSUPPORTED_DIR_IMPORT`).

## API Modules

- `/api/v1/auth`
- `/api/v1/users`
- `/api/v1/admins`
