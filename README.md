# Wax Eccentric

A pnpm/Turborepo workspace containing three independently built applications:

- `apps/www`: the statically exported main site
- `apps/verse`: a static poetry app served at `/verse/`
- `apps/kallos-sthenos`: a Next.js and SQLite workout app served at `/kallos-sthenos/`

## Development

Install all workspace dependencies from the repository root:

```bash
pnpm install
```

Run the main site and Kallos Sthenos together:

```bash
pnpm run dev
```

The main site is available at `http://localhost:3000`, with Kallos Sthenos
proxied at `http://localhost:3000/kallos-sthenos/`. To run only Kallos Sthenos:

```bash
pnpm run dev:kallos-sthenos
```

Kallos Sthenos uses a base path, so append `/kallos-sthenos/` when running it
independently. Its SQLite database is created in
`apps/kallos-sthenos/data/kallos.db`.

Run `pnpm run check` for formatting, lint, type checks, and tests. Build every
app with `pnpm run build`.

## Deployment

The main site and Verse are static files deployed with `pnpm run deploy:static`.
Kallos Sthenos is a server application and must run as a separate Node process
or container. Start it with:

```bash
pnpm run start:kallos-sthenos
```

The public web server must proxy the full subpath without stripping it. For
Nginx, the location is:

```nginx
location /kallos-sthenos/ {
	proxy_pass http://127.0.0.1:3000;
	proxy_http_version 1.1;
	proxy_set_header Host $host;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	proxy_set_header X-Forwarded-Proto $scheme;
}
```

The containerized app can be run from its directory with
`docker compose up -d --build`. The compose volume persists SQLite data under
`apps/kallos-sthenos/data`.
