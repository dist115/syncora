# Syncora

Introducing **Syncora** Your ultimate cloud storage solution! Say farewell to clunky, disjointed storage systems. With Syncora, powered by a blend of cutting-edge tools including `NextJs 14`,`Cloudflare R2` `Postgres`,`Drizzle ORM`,`Tailwind CSS`, and `Lucia` uploading, organizing and accessing files becomes a breeze anytime, anywhere!
Syncora is Ideal for solo entrepreneurs, creatives, and teams, Syncora ensures seamless project collaboration, client file sharing, and data protection.If you are statring a SaaS business for cloud storage then Syncora has you covered with a user friendly interface.


# Key Features

- Build with Next js 14.2.3 (App Router) RizzUI, HeadlessUI, React Icons, TypeScript & TailwindCSS
- Authentication and Authorization with Lucia Auth
- Integrated Lucia auth for Login with magic link
- TypeScript Based React Components with Atomic architecture
- Beautifully crafted dashboard widgets
- A mobile friendly controlled table component for display any kind of large amount of data with -pagination, filtering and sorting options
- Charts are built on top of Recharts package with limitless customization
- File Storage Subscription with Stripe
- Ready made Account settings form page
- Search and Filters files
- Light and Dark mode support
- Well optimized and clean code
- Easy to Customize with CSS Variables


# Requirements

Before you begin, ensure that your computer has the following software installed.
- `nodejs` (20.9.0 or later) https://nodejs.org/en (recommended)
- `pnpm` Node package manager https://pnpm.io/ (recommended)
- `Visual Studio Code`  https://code.visualstudio.com/ (recommended)
- `Docker` https://www.docker.com/products/docker-desktop/

Component Mental Model : https://atomicdesign.bradfrost.com/chapter-2/

# Installation
```bash
NODE_ENV=
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_UPLOAD_URL=

SITE_URL=
DATABASE_URL=

# Email 
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=


# Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/login/google/callback

# Stripe
PAYMENTS_SECRET_KEY=

# File Upload
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
BUCKET_NAME=
AWS_REGION=
UPLOAD_URL=

#Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOKS_SECRET=

NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
NEXT_PUBLIC_APP_NAME=

# Toogle Teams
NEXT_PUBLIC_ENABLE_TEAMS=true

# Clouflare R2 file upload

NEXT_PUBLIC_CLOUDFLARE_URL=
CLOUDFLARE_ENDPOINT=
CLOUDFLARE_ACCESS_KEY_ID=
CLOUDFLARE_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

## Installation Scripts
Run these following commands in the root directory of your project. 

| Command    | Description |
| --------   | ------- |
| `docker-compose up -d`   | The command is used to start and run the entire multi-container application defined in a `docker-compose.yml` file in detached mode, meaning it runs in the background |
| `pnpm install`| It will install all the necessary dependencies into the `node_modules` folder.    |
|`pnpm db:push && pnpm db:seed` | It pushes database schemas and populate some important table like `permission` and `Roles` . |
|`pnpm dev` | It launches the project locally, initiates the development server, and monitors any changes in your code. You can access the development server at `http://localhost:3000` |
| `pnpm stripe:listen` | The `stripe:listen` runs and monitors stripe webhook process on the project locally |

## Check your `package.json` file for available scripts:
```bash
"scripts": {
    "dev": "next dev",
    "build": "pnpm db:migrate && pnpm db:seed && next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "dev:email": "email dev --dir src/email-templates --port 3001",
    "test:e2e": "playwright test",
    "db:ui": "drizzle-kit studio",
    "db:push": "drizzle-kit push:pg --config=drizzle.config.ts",
    "db:generate": "drizzle-kit generate:pg --config=drizzle.config.ts",
    "db:drop": "drizzle-kit drop --config=drizzle.config.ts",
    "db:check": "drizzle-kit check:pg --config=drizzle.config.ts",
    "db:clean": "node -r @swc-node/register ./src/db/clean.ts",
    "db:seed": "node -r @swc-node/register ./src/db/seed.ts",
    "db:migrate": "node -r @swc-node/register ./src/db/migrate.ts",
    "stripe:listen": "stripe listen --forward-to localhost:3000/api/stripe/webhook"
  }

```

### Here are some additional commands that you can use
| Command    | Description |
| --------   | ------- |
| `pnpm lint`   | It is used for `linting` your code |
| `pnpm format`   | This command will format your code with `prettier` according to prettier configuration defined in `prettier.config.js` |
|`pnpm build`| This command orchestrates the construction of the project, creating any necessary build files and optimizing the application for deployment.|
|`pnpm start`| This command launches the locally built application in production mode, providing a ready-to-deploy version of the project |
|`pnpm db:ui`|The command emulates database client for inspecting your database tables in the browser|
|`pnpm db:generate`|The command is used for generating database table based on `drizzle ORM schema`|
|`pnpm db:seed`|This command is used to populate some important table like `permission` and `Roles` |
|`pnpm db:drop`|This command is used for dropping your database|
|`pnpm db:check`|This command will check for all collisions and inconsistencies of your migrations.|
|`pnpm db:clean`|The command cleans all your data from database table|
|`pnpm dev:email`|Check and test your email configuration by using this command|


