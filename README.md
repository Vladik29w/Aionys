## Tech stack

* **Backend:** .NET 10
* **Frontend:** Angular 22
* **Database:** PostgreSQL
* **State manager:** NgRx Signals
* **E2E test:** Playwright
* **I18n translation:** ngx-translate

---

## How to run

### Project:
```bash
docker compose up --build -d
```
* **Frontend:** http://localhost:8080
* **Backend (Scalar):** http://localhost:5203/scalar/v1

### E2E tests:
```bash
npm ci
npx playwright install --with-deps chromium
npm run e2e
```
