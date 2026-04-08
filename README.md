# Educase Backend (Simple)

This is a simple backend app.

## We use
- Node.js
- Express
- MySQL
- JWT token auth

## Files
- app.js -> app setup
- server.js -> main startup file
- config/db.js -> MySQL connection
- controllers -> auth and school logic
- routes -> auth and school routes

## Run project
1. Install packages
   npm install
2. Start server
   npm run dev

Server runs on:
- http://localhost:5000

## Auth endpoints
- POST /api/v1/auth/register
- POST /api/v1/auth/login

## School endpoints (token required)
- POST /api/schools
- GET /api/schools
- PUT /api/schools/:id
- DELETE /api/schools/:id

## Token use
After login, send header:
Authorization: Bearer <token>

## Basic request examples
Register body:
{
  "name": "Tejas",
  "email": "tejas@mail.com",
  "password": "123456"
}

Create school body:
{
  "name": "ABC School",
  "address": "Main Road",
  "latitude": 12.9716,
  "longitude": 77.5946
}
