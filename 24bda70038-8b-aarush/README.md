# Experiment: Banking API Implementation (with Winston Logging)

## Objective
To build a secure and highly observable Banking API from scratch using Node.js, Express, and MongoDB. The experiment focuses on integrating production-grade logging via **Winston**, implementing modular routing, establishing authentication, and deploying the resultant API as a serverless function on **Vercel**.

## Technologies Used
- **Node.js & Express.js** (Backend Framework)
- **MongoDB & Mongoose** (Database & Data Modeling)
- **Winston** (Production-Grade Observability)
- **JWT & Argon2** (Authentication Session & Secure Password Hashing)
- **Rate-Limiter-Flexible** (Endpoint Security & Throttling)

## Step-by-Step Implementation

### Step 1: Project Initialization
Initialized the repository using `pnpm` and installed the experimental dependencies:
```bash
pnpm add express mongoose jsonwebtoken argon2 cors dotenv winston rate-limiter-flexible http-errors http-status-codes
```

### Step 2: Environment Configuration
Secured application configuration using `.env` variables containing:
- MongoDB Atlas cloud connection URI (`MONGO_URI`)
- JWT Authentication Secrets (`JWT_SECRET`, `JWT_REFRESH_SECRET`)
- Environment-specific triggers (`LOG_LEVEL`, `NODE_ENV`)

### Step 3: Global Winston Logging Setup (`config/logger.js`)
Centralized logging architecture to intercept application output optimally:
- Configured the local environment to automatically map application stack traces to `logs/error.log` and success events to `logs/combined.log`.
- Conditionally disabled file transports within the Vercel production environment (as Vercel utilizes a read-only filesystem) and streamlined all logs cleanly through the Vercel Cloud Console.

### Step 4: Middleware Integration
- **Request Logging (`middleware/logger.middleware.js`):** Stripped out standard `console.log` statements. Captured all HTTP requests and measured response durations using `res.on('finish')`.
- **Master Error Handling (`middleware/error.middleware.js`):** Intercepted global unhandled routes, 4xx, and 5xx errors, feeding them intelligently into the Winston Error transport.
- **Rate Limiting (`middleware/ratelimit.middleware.js`):** Established memory-based rate limiting to prevent repetitive unauthorized API polling.

### Step 5: Vercel Serverless Deployment
Modifications were made strictly to guarantee Vercel Serverless execution:
- Generated a `vercel.json` routing engine to handle serverless endpoints.
- Exported the Express `app` instance within `index.js` instead of utilizing standard TCP `.listen()`.
- Altered `config/db.js` process terminations so Serverless Instances throw safely handled exceptions instead of crashing the internal runner via `process.exit()`.

## Live Output & Verification

The deployed API is accessible online. Verifications can be executed via Postman or Thunder Client.

**Base Verification Route:**
An HTTP `GET` request to the Root Domain (`/`) successfully returns:
```json
{
  "message": "Server is running successfully with Winston logging!"
}
```

**Experimental API Endpoints:**
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Stores a user into MongoDB and hashes the password via Argon2. |
| `POST` | `/api/auth/login` | Validates credentials and initializes a finite JWT Session Token. |

## Conclusion
The experiment effectively demonstrated the vast superiority of integrating **Winston** over standard Node.js logging libraries. Application metrics became highly explicit and manageable. Furthermore, bridging a traditional Express pipeline into a modern Serverless edge architecture (Vercel) was accomplished gracefully without sacrificing any observability pipelines.
