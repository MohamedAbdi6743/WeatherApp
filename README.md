# Weather App

A full-stack weather app. You create an account, verify your email, log in, and search any city to see its current weather. You can star up to 8 cities as favourites, and your recent searches are kept for quick access.

- **Backend:** Spring Boot 3 (Java 17) REST API with JWT login, email verification and password reset
- **Frontend:** React 19 with Tailwind CSS
- **Weather data:** [OpenWeather](https://openweathermap.org/current) current weather API

Built as a three-person capstone project at BPTN / Obsidi Academy by [Mohamed Abdi](https://github.com/MohamedAbdi6743), [Umukulthum Arowolo](https://github.com/Umukulthum) and [Mohammed Ahmed](https://github.com/mahmed097).

---

## What's in the repo

```
WeatherApp/
├── WeatherApp-Backend/weatherApp/     Spring Boot API
│   ├── src/main/java/com/bptn/weatherapp/
│   │   ├── controller/                REST endpoints
│   │   ├── service/                   business logic (users, weather, favourites, email)
│   │   ├── security/ + filter/        JWT creation and checking
│   │   ├── jpa/ + repository/         database entities and queries
│   │   └── config/                    security, H2 and WebClient setup
│   └── src/main/resources/
│       ├── application.yml            server, database, mail and profile settings
│       ├── config.yml                 JWT, OpenWeather key, client URL, favourites limit
│       └── templates/                 HTML for the verification and reset emails
│
├── WeatherApp-Frontend/weather-app-frontend/   React app
│   └── src/
│       ├── user/                      login, signup, verify email, reset password
│       ├── weather/                   home page and weather card
│       ├── ui/                        shared buttons, inputs, panels, layout
│       └── util/ApiUtil.js            every call to the backend
│
└── .github/workflows/ci.yml           runs the backend tests on every push to main
```

---

## Running it locally

You need:

- **Java 17 or newer** (Maven doesn't need to be installed; the project includes the Maven wrapper)
- **Node.js 18 or newer** and npm

### 1. Start the backend

```bash
cd WeatherApp-Backend/weatherApp
./mvnw spring-boot:run
```

On Windows, run `mvnw.cmd spring-boot:run` instead.

The API starts on **http://localhost:8081**. You should see `Started WeatherAppApplication` in the logs. A quick check:

```bash
curl http://localhost:8081/actuator/health
```

It should return `{"status":"UP"}`.

By default it uses an **in-memory H2 database**, so you don't have to set anything up. The trade-off is that everything is wiped when the backend stops (more on that under [Profiles](#profiles)).

### 2. Start the frontend

In a second terminal:

```bash
cd WeatherApp-Frontend/weather-app-frontend
npm install
npm start
```

The app opens at **http://localhost:3000**.

### 3. Use it

1. Go to **Sign up** and create an account. The password needs 8+ characters with upper and lower case, a number and a symbol.
2. Check your inbox for the verification email and click the link. You can't log in until you've verified.
3. Log in, search a city, and click the star to save it.

---

## Configuration

Settings live in two files under `WeatherApp-Backend/weatherApp/src/main/resources/`.

### Environment variables

Secrets are never stored in the repo. They're read from environment variables (see [`.env.example`](.env.example)):

| Variable | Needed for | Default if unset |
| --- | --- | --- |
| `OPENWEATHER_API_KEY` | Weather searches. Get a free key at [openweathermap.org](https://home.openweathermap.org/api_keys) | none, so searches fail |
| `JWT_SECRET` | Signing login tokens | a local-dev-only value. **Always set it outside your machine** |
| `MAIL_USERNAME`, `MAIL_PASSWORD` | Sending verification and reset emails (Gmail needs an app password) | none, so emails aren't sent |
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | The `prod` profile's PostgreSQL | `jdbc:postgresql://localhost:5432/weatherDB` |

Example on macOS / Linux:

```bash
export OPENWEATHER_API_KEY=your-key
export JWT_SECRET=$(openssl rand -base64 64)
./mvnw spring-boot:run
```

**`application.yml`**

| Setting | What it does |
| --- | --- |
| `spring.profiles.active` | Which profile runs: `test` (default, H2) or `prod` (Postgres) |
| `server.port` | `8081` for the test profile, `8080` for prod |
| `spring.mail.*` | Gmail SMTP account used to send verification and reset emails |
| `spring.datasource.*` | Database connection for each profile |

**`config.yml`**

| Setting | What it does |
| --- | --- |
| `jwt.secret`, `jwt.expiration` | Signing key and lifetime (24 hours) for login tokens |
| `jwt.excluded.urls` | Endpoints that don't need a token (login, signup, reset, etc.) |
| `api.key` | OpenWeather API key |
| `client.url` | Frontend address used to build links in emails (`http://localhost:3000`) |
| `max_favourite_cities` | How many favourites each user can save (8) |

**Frontend**

The frontend calls `http://localhost:8081` by default. To point it somewhere else, set `REACT_APP_API_BASE_URL` before starting:

```bash
REACT_APP_API_BASE_URL=http://localhost:9000 npm start
```

### Profiles

- **`test`** (default): in-memory H2 database, tables are created on startup and dropped on shutdown. The H2 console is available at http://localhost:8081/h2-console (JDBC URL `jdbc:h2:mem:testdb`, user `sa`, password `sa123#`).
- **`prod`**: PostgreSQL with `ddl-auto: validate`, so the tables must already exist. The Postgres server this was originally pointed at has been shut down, so set `DB_URL`, `DB_USERNAME` and `DB_PASSWORD` to your own database before using it.

To run with the prod profile:

```bash
SPRING_PROFILES_ACTIVE=prod ./mvnw spring-boot:run
```

---

## API

Everything except the auth endpoints needs an `Authorization: Bearer <token>` header. You get the token from the `Authorization` response header when you log in.

**Users**

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/user/signup` | Create an account and send a verification email |
| `GET` | `/user/verify/email` | Verify an email (token from the email link) |
| `POST` | `/user/login` | Log in; the JWT comes back in the `Authorization` header |
| `GET` | `/user/reset/{email}` | Send a password reset email |
| `POST` | `/user/reset?password=...` | Set a new password (token from the reset link) |

**Weather**

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/weathers/{city}/{save}` | Current weather for a city. `save=true` stores it in your history |
| `GET` | `/weathers` | All weather searches you've saved |

**Favourites**

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/favouritecity` | Your favourite cities and the maximum allowed |
| `POST` | `/favouritecity/{cityId}` | Add a city (the city must have been searched first) |
| `DELETE` | `/favouritecity/{favouriteCityId}` | Remove a favourite |

Errors come back as JSON with a readable `message`, for example `"City doesn't exist, abcd"` or `"Email requires verification, jane@example.com"`.

---

## Tests and CI

The backend has 13 tests (controller and integration tests against H2):

```bash
cd WeatherApp-Backend/weatherApp
./mvnw test
```

GitHub Actions runs the same tests on every push to `main` and posts the results to the commit.

To check the frontend builds cleanly (lint warnings are treated as errors here, same as most CI setups):

```bash
cd WeatherApp-Frontend/weather-app-frontend
CI=true npm run build
```

---

## Troubleshooting

**"Port 8081 was already in use"**
Another copy of the backend is probably still running. Stop it, or run on another port with `./mvnw spring-boot:run -Dspring-boot.run.arguments=--server.port=8082` (and point the frontend at it with `REACT_APP_API_BASE_URL`).

**"H2 TCP server not started: port 9091 in use" in the logs**
Harmless. It only means a second backend instance couldn't open the optional H2 TCP port. The app still works.

**Logging in says "Email requires verification"**
You need to click the link in the verification email first. If the email never arrives, check the `spring.mail` settings. Gmail needs an app password, not your normal one.

**My account disappeared**
With the default `test` profile the database lives in memory, so restarting the backend wipes it. Sign up again, or switch to the `prod` profile with a real database.

**I get logged out after a while**
The login cookie lasts 15 minutes. Log in again.

---

## Known limitations

- **The new password goes in the URL.** The password reset endpoint takes it as a query parameter, so it can end up in server logs. It should move into the request body.
- **Times are shown in Toronto time,** not the searched city's local time.
