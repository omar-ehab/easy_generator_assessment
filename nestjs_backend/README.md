# Easy Generator Assessment

A scalable and efficient API built with NestJS using Fastify as the HTTP server and MongoDB as the database. The project uses Mongoose as the ODM and features authentication based on JWT access tokens with a refresh token mechanism.

## Features

- **NestJS** framework with **Fastify** for high performance
- **MongoDB** as the database, managed with **Mongoose** ODM
- **Authentication** using **JWT** (access & refresh tokens)

## Installation & Setup

Follow these steps to set up and run the project:

### 1. Clone the Repository

```bash
git clone https://github.com/omar-ehab/easy_generator_assessment.git
cd nestjs-fastify-mongo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

1. Copy the `.env.example` file and rename it to `.env` in the root directory:

   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and fill in the required values (e.g., MongoDB connection URI, JWT secret, etc.).

### 4. Start the Application

#### Development Mode

```bash
npm run start:dev
```

#### Production Mode

```bash
npm run build
npm run start:prod
```

### 5. API Documentation

Once the server is running, you can access the API documentation (if Swagger is enabled) at:

```
http://localhost:8000/docs
```

## Authentication Flow

- Users authenticate using JWT access tokens.
- A refresh token mechanism is implemented to issue new access tokens without requiring a login.

