# NestJS Demo Application

A comprehensive NestJS application demonstrating REST API development with TypeORM, PostgreSQL, and JWT authentication.

## Features

- **REST API** for Customer management (CRUD operations)
- **JWT Authentication** with register/login endpoints
- **TypeORM** integration with PostgreSQL
- **Validation** using class-validator
- **Unit Tests** for services and controllers
- **End-to-End Tests** for API endpoints
- **Swagger/OpenAPI** documentation at `/api`
- **Docker** support for database

## Tech Stack

- NestJS 10
- TypeORM
- PostgreSQL (Northwind database)
- JWT (JSON Web Tokens)
- Passport.js
- Jest (Testing)
- TypeScript

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Docker (for PostgreSQL)
- Running PostgreSQL container named `postgres-infra` with `northwind` database

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=YourStrong@Passw0rd
DB_DATABASE=northwind

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1h

PORT=3000
```

### Port Configuration

The application uses the `PORT` environment variable to determine which port to use. If the specified port is already in use, the application will automatically find and use the next available port.

**Default behavior:**
- Tries to use port 3000 (or the value in `PORT` environment variable)
- If occupied, automatically tries 3001, 3002, 3003, etc.
- Displays a warning message showing which port was actually used

**Examples:**
```bash
# Use default port (3000)
npm run start:dev

# Use custom port
PORT=8080 npm run start:dev

# If port is occupied, it will use the next available port
PORT=3000 npm run start:dev  # Will use 3001 if 3000 is busy
```

## Database Setup

The application connects to the Northwind database running in a Docker container.

### Setting up the Northwind Database

1. **Clone the database samples repository:**
   ```bash
   git clone https://github.com/harryho/db-samples.git
   cd db-samples
   ```

2. **Follow the repository's README** to create the PostgreSQL container with the Northwind database. The setup will create a container named `postgres-infra` with the `northwind` database.

3. **Verify the container is running:**
   ```bash
   docker ps | grep postgres-infra
   ```

4. **If the container is stopped, start it:**
   ```bash
   docker start postgres-infra
   ```


### Users Table Setup

For authentication, you need to create a users table. Run the provided setup script:

```bash
./setup-db.sh
```

This will create the users table with the following structure:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR UNIQUE NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The application will start on the port specified in the `PORT` environment variable (default: 3000). If that port is occupied, it will automatically select the next available port and display the actual URL.

## Swagger API Documentation

Interactive API documentation is available via Swagger UI.

**Default URL**: `http://localhost:3000/api` (or the actual port displayed on startup)

The Swagger interface provides:
- Complete API endpoint documentation
- Request/response schemas
- Try-it-out functionality for testing endpoints
- JWT authentication support (click "Authorize" button and enter your token)

## Testing the API

### Option 1: Using REST Client (Recommended for Development)

A `local-test.http` file is provided for testing all API endpoints using the [REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) for VS Code.

**Features:**
- Pre-configured requests for all endpoints
- Automatic token extraction from login response
- Automatic customer ID extraction for CRUD operations
- Variables for base URL and authentication token
- Complete workflow testing (register → login → CRUD)

**Usage:**
1. Install the REST Client extension in VS Code
2. Open `local-test.http`
3. Click "Send Request" on the Login endpoint to get a token
4. All subsequent requests will automatically use the extracted token
5. Test the complete CRUD workflow without manual token copying

### Option 2: Using Swagger UI

Visit `http://localhost:3000/api` for interactive API testing in your browser.

### Option 3: Using curl

See the API Endpoints section below for curl examples.

## API Endpoints

### Authentication

#### Register
```bash
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Customers (Protected Routes)

All customer endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

#### Get All Customers
```bash
GET /customers
Authorization: Bearer <token>

Response:
[
  {
    "customerId": "ALFKI",
    "companyName": "Alfreds Futterkiste",
    "contactName": "Maria Anders",
    "city": "Berlin",
    "country": "Germany",
    ...
  }
]
```

#### Get Customer by ID
```bash
GET /customers/:id
Authorization: Bearer <token>

Response:
{
  "customerId": "ALFKI",
  "companyName": "Alfreds Futterkiste",
  "contactName": "Maria Anders",
  ...
}
```

#### Create Customer
```bash
POST /customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": "NEWCO",
  "companyName": "New Company Ltd",
  "contactName": "John Doe",
  "city": "New York",
  "country": "USA"
}
```

#### Update Customer
```bash
PATCH /customers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "companyName": "Updated Company Name",
  "city": "Los Angeles"
}
```

#### Delete Customer
```bash
DELETE /customers/:id
Authorization: Bearer <token>
```

## Testing

```bash
# Unit tests
npm test

# Unit tests with coverage
npm run test:cov

# E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

## Project Structure

```
nestjs-demo/
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.spec.ts
│   │   └── auth.service.spec.ts
│   ├── customers/
│   │   ├── dto/
│   │   │   ├── create-customer.dto.ts
│   │   │   └── update-customer.dto.ts
│   │   ├── entities/
│   │   │   └── customer.entity.ts
│   │   ├── customers.controller.ts
│   │   ├── customers.module.ts
│   │   ├── customers.service.ts
│   │   ├── customers.controller.spec.ts
│   │   └── customers.service.spec.ts
│   ├── users/
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .env
├── .gitignore
├── jest.config.js
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

## Key Implementation Details

### Database Connection
TypeORM is configured in `app.module.ts` to connect to the PostgreSQL database using environment variables. The connection uses the existing Northwind schema without synchronization to prevent accidental schema changes.

### Authentication
JWT authentication is implemented using Passport.js with the JWT strategy. The `JwtAuthGuard` protects customer endpoints, requiring a valid token for access. Passwords are hashed using bcrypt before storage.

### Validation
All DTOs use class-validator decorators to ensure data integrity. The global ValidationPipe automatically validates incoming requests and transforms them to the appropriate types.

### Testing
- **Unit tests** use Jest with mocked dependencies to test services and controllers in isolation
- **E2E tests** use supertest to test the full application flow including database interactions

## Development Notes

- The application uses TypeORM entities that map to the existing Northwind database schema
- JWT tokens expire after 1 hour (configurable via `JWT_EXPIRES_IN`)
- All customer endpoints are protected and require authentication
- The users table is managed separately for authentication purposes

