# Notes management

Angular client with NgRx Signals and localization, ASP.NET Core API, and PostgreSQL.

## Run with Docker

Requirements: Docker with Compose v2.

From the repository root:

```sh
docker compose up --build -d
```

The database credentials in `compose.yaml` are public demo credentials for local
testing only, not production secrets. No `.env` file is required.

- Client: http://localhost:8080
- API: http://localhost:5203/notes
- API through Nginx: http://localhost:8080/api/notes

The database is not exposed to the host. Compose waits for PostgreSQL to accept
queries before starting the API, and starts the client only after the API health
check passes. EF Core migrations are applied automatically during API startup.
The first launch can take a few minutes for image downloads, builds, and migrations.

```sh
docker compose ps
docker compose logs -f server
docker compose down
```

Notes persist in the `postgres-data` volume after stopping containers.
To **delete all notes and reset the database**:

```sh
docker compose down -v
```

Changing the password in `compose.yaml` does not change the password in an existing
database volume. If you change it, update both services. For a disposable test database,
reset it using the command above before restarting.

This configuration is for reviewing the test task locally, not a production deployment:
HTTP and public local database credentials are intentional simplifications.

## API endpoints

| Method | Path | Action |
| --- | --- | --- |
| GET | `/notes` | List notes |
| GET | `/notes/{id}` | Get a note |
| POST | `/notes` | Create a note |
| PUT | `/notes/{id}` | Update a note |
| DELETE | `/notes/{id}` | Delete a note |

## Run the client locally

Requirements: Node.js 22.22.3+ (or a newer Angular-supported version) and npm.
Keep the Docker API and database running:

```sh
docker compose up --build -d server
cd Client
npm ci
npm start
```

Open http://localhost:4200. The development client uses http://localhost:5203;
the Docker/production build uses the same-origin `/api` Nginx proxy.

## E2E test

Keep the Docker API/database running as above. From `Client`:

```sh
npm ci
npx playwright install --with-deps chromium
npm run e2e
```

Playwright starts the Angular development server automatically (or reuses an existing
one outside CI). The test creates a note, verifies it in the list, and deletes it afterwards.
The browser dependency installation may require administrator privileges on Linux.
