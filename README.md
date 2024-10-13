# Authenticator

## Description
  - This is a Node.js server where user & password session based authentication is implemented
  - The connected storage is a simple json file for the sake of development simplicity (DO NOT use it in prod! It lacks database features such as performance, ACID compliance, etc...)
    - Different storages types can be connected by implementing the `AbstractStorage` class
  - Once the user is registered and logged in, their session id is stored in a cookie on the client side
  - Optionally we can also protect endpoints against CSRF attacks as well

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
  - The server configurable through `config/config.json` file
  - Default configs are described by `src/config.ts:defaultConfig`

#### Token Verification on Endpoints
  - The `verifySessionToken` middleware verifies the logged in in user's session id (cookie)
  - The `verifySessionAndCsrfTokens` middleware verifies the logged in in user's session id (cookie) and CSRF token

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
  - Login the registered user (set the user session id cookie in the browser)
  ```
  POST /login
  {
    "user": "Doe John",
    "password": "super secure password"
  }
  ```
  - Now the logged in user is allowed to enter any routes
  - Log out (deletes the user session id cookie from the browser)
  ```
  GET /logout
  ```

#### CSRF Protect Endpoints (Optional)
  - The logged in user requests it's csrf token (each request refreshes the token)
  ```
  GET /csrf
  ``` 
  - CSRF protected request include a `X-CSRF-Token` HTTP header to send the csrf token
  - The `/protectedCsrfRoute` endpoint is csrf protected (to try this feature)