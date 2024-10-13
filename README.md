# Authenticator

## Description
  - This is a Node.js server where user & password session based authentication is implemented
  - The connected storage is a simple json file for the sake of development simplicity (DON'T use it in prod! It lack DB features like performace, ACID compliance, etc...)
    - Different storages can be connected by implementing the `AbstractStorage` class
  - Once the usesr registerd and logged in its session id is stored in a cookie on client side
  - Additionally we can CSRF protect endpoints as well (description in the Usage session)

## Requirements
 - Node.js v22.9+

## Setup
  - Run `npm install`

## Usage
#### Run Server
  - Run dev server with `npm run start:dev` (dev server with watch mode)
  - Build produciton code with `npm run build`
  - Start prod server with `npm run`

#### Config
  - The server configurable through the `config/config.json`
  - Default configs in `src/config.ts:defaultConfig`

#### Token Verification on Endpoints
  - The `verifySessionToken` middleware verifies the loggined in user's session id (cookie)
  - The `verifySessionAndCsrfTokens` middleware verifies the loggined in user's session id (cookie) and CSRF token

#### CSRF (optional)
  - On top of the session id cookie the server also supports csrf protection
    - Logged in users can request their csrf token on `/csrf` endpoint, **each request returns a new refreshed csrf token!**
    - CSRF protected endpoints accept an `X-CSRF-Token` HTTP header where the token is provided

## Examples
#### User Login
  - Register a new user
  ```
  POST /register
  {
    "user": "Doe John",
    "password": "super secure password"
  }
  ```
  - Login the registered user (this will set the user's session id cookie in the browser)
  ```
  POST /login
  {
    "user": "Doe John",
    "password": "super secure password"
  }
  ```
  - Now the logged in user is allowed to enter any routes
  - Log out (this will delete the user's session id cookie in the browser)
  ```
  GET /logout
  ```