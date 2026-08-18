# Omni-customer-account-service
# Omni Customer & Account Service

Owns 3 TMF resource families, per the API Gateway's routing table (port 3002):

| TMF spec | Path prefix | Module |
|---|---|---|
| TMF629 Customer Management | `/tmf-api/customerManagement/v4/*` | `src/modules/customer` |
| TMF632 Party Management | `/tmf-api/partyManagement/v4/*` | `src/modules/party` |
| TMF666 Account Management | `/tmf-api/accountManagement/v4/*` | `src/modules/account` |

## Scope

**23 endpoints**, officially assigned in `Omni-Channel-API-Mapping-By-Service.xlsx`
("Customer and Account Management" sheet). Full list + status + duplicate
flags live in [`API_TRACKER.md`](./API_TRACKER.md) — update that file as you
implement each one, don't track progress anywhere else.

Important: scope is pulled from **9 different original Postman folders**
(Account, AccountOMNI, VAS, BBVAS, ISP SOA, ISP Direct, PEO, NewCon, PEOVAS,
Dashboard) — not just Account/AccountOMNI. Profile and contact-update
operations were scattered across the legacy system by whichever feature
needed them at the time; this service consolidates them by TMF resource
type instead.

## Open questions before/while building (see API_TRACKER.md for detail)

- Are `GetAccountDetailRequest` + its ChatBot/V2/V3 variants genuinely
  different behavior, or copy-paste duplicates to collapse into one route?
- Two `getprofile` calls hit slightly different IPs (`.129` vs `.114`) —
  confirm that's not a typo in the source collection before merging them.
- Cross-service dependencies: `PEOProfile`, `UpdateContact` (from BBVAS),
  etc. imply this service needs data other services own (PEO subscriptions,
  broadband service records). Confirm whether that's a live call through
  the gateway to those services, or reference data replicated into this
  service's own Mongo.

## Running locally (standalone, without the gateway)

```bash
cp .env.example .env
npm install
npm run dev
```

Service listens on `PORT` from `.env` (default 3002). You can hit it directly
during development, e.g.:

```
GET http://localhost:3002/tmf-api/customerManagement/v4/customer
```

## Running behind the gateway

The gateway forwards the **original full path** unchanged (it does not
strip `/tmf-api/...`), so no path rewriting is needed here — routes are
already mounted at the full path in `src/app.js`.

## Auth

JWT verification is deferred (team-wide decision). `src/common/middleware/auth.js`
is a passthrough stub already wired into every route. When JWT is ready,
only that one file needs to change.

## Project structure

```
src/
  modules/            one folder per TMF resource family
    customer/
      customer.routes.js       Express router, mounted at full TMF path
      customer.controller.js   HTTP layer only - thin, delegates to service
      customer.service.js      business logic + DB access
      customer.model.js        Mongoose schema
    party/            (same shape)
    account/          (same shape)
  common/
    middleware/       auth (stub), error handling, request logging
    utils/            tmfResponse.js - wraps Mongoose docs into {id, href, @type, ...}
    config/           db.js - Mongo connection
  app.js              mounts modules at their full gateway paths
  server.js           starts the HTTP server
```

## Adding a new endpoint

1. Add the field(s) to the relevant `*.model.js` if needed.
2. Add a function to `*.service.js` (DB access / business logic).
3. Add a controller function in `*.controller.js` (HTTP request/response only).
4. Add the route in `*.routes.js`.
5. Cross-check against the API mapping sheet for the correct TMF-aligned path/method.

