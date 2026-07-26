# Wax Eccentric

An npm/Turborepo workspace containing three independently built applications:

- `apps/www`: the statically exported main site
- `apps/verse`: a static poetry app served at `/verse/`
- `apps/kallos-sthenos`: a Next.js and SQLite workout app served at `/kallos-sthenos/`

## Development

Install all workspace dependencies from the repository root:

```bash
npm install
```

Run the main site or Kallos Sthenos independently:

```bash
npm run dev
npm run dev:kallos-sthenos
```

Kallos Sthenos uses a base path, so open the port printed by Next at
`/kallos-sthenos/`. Its SQLite database is created in
`apps/kallos-sthenos/data/kallos.db`.

Build every app with `npm run build`. Run the Kallos Sthenos tests with
`npm run test:kallos-sthenos`.

## Deployment

The main site and Verse are static files assembled by `scripts/deploy.sh`.
Kallos Sthenos is a server application and must run as a separate Node process
or container. Start it with:

```bash
npm run start:kallos-sthenos
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
