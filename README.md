# LastDB Website

Marketing site for **LastDB** — the local database you build your own tool stack on; apps (Brain, Kanban, …) are thin clients. Live at **[thelastdb.com](https://thelastdb.com)**.

## Pages

| Path | Purpose |
|------|---------|
| `/` | What it is + **install** (primary CTA) |
| `/apps` | What each app does |
| `/start` | Daily loop + agent MCP/skills (after install) |
| `/about` | Product thesis |
| `/developer` | Socket API for builders |
| `/blog` | Engineering writing |
| `/llms.txt` | Plain-text install map for agents |

## Local development

```bash
npm install
npm run dev        # http://localhost:5175
```

Production build (includes **prerender** so agents/curl get real HTML without JS):

```bash
npm run build      # vite build && node scripts/prerender.mjs
npm run preview
```

## Deploy

**LastGit is the production deploy path** for `thelastdb.com`.

| Step | Who |
|------|-----|
| Review + merge gate | LastGit CR + `.lastgit/ci.sh` (`npm ci` + `npm run build`) |
| Production publish | LastGit watcher context **`deploy-prod`** → `.lastgit/deploy-prod.sh` → `vercel deploy --prod` of the **checked-out tree** |
| Public mirror | GitHub (`EdgeVector/fold_db_website`) via `.lastgit/sync-github-mirror.sh` |

Install the deploy watcher (once per machine that should publish):

```bash
# Token in LastSecrets (not keychain): https://vercel.com/account/tokens
export PATH="$HOME/.bun/bin:$PATH"
printf '%s' "$(pbpaste)" | lastsecrets put lastgit-vercel-token \
  --label "Vercel deploy token for LastGit fold_db_website" \
  --provider vercel --purpose lastgit-fold-db-website-deploy-prod \
  --env prod --value-stdin
.lastgit/install-deploy-launchd.sh   # com.edgevector.lastgit-deploy-fold-db-website
```

Optional env: `VERCEL_SCOPE` (default `shiba4lifes-projects`), `VERCEL_PROJECT` (default `fold_db_website`).

`vercel.json` has `"git": { "deploymentEnabled": false }` — GitHub pushes do not
trigger Vercel. Production deploys only via LastGit `deploy-prod`. Logs:
`~/.lastgit/deploy-fold_db_website/`.

Static prerendered routes under `dist/<path>/index.html` are served before the SPA rewrite.

## Browser Error Reporting

The site initializes Sentry only when `VITE_SENTRY_DSN` is present at build time.
Keep the DSN in LastSecrets and inject it into the deploy environment at the
point of use. The LastGit production deploy script defaults to
`lastsecrets://obs-sentry-dsn-javascript-react` when `VITE_SENTRY_DSN` is not
already set.

Recommended deploy env:

```bash
VITE_SENTRY_DSN=<from LastSecrets>
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_RELEASE=<deployed commit sha>
```

The browser SDK is configured with `sendDefaultPii=false`; event payloads also
strip user fields, cookies, headers, request bodies, query strings, and URL
fragments before send.

Preview smoke:

```bash
VITE_SENTRY_DSN=<from LastSecrets> VITE_SENTRY_ENVIRONMENT=preview \
VITE_SENTRY_RELEASE=<preview commit sha> VITE_SENTRY_SMOKE=1 npm run build
```

Deploy that preview and open `/?sentry-smoke=1`; Sentry should receive
`fold_db_website.sentry_smoke` for the preview environment.

## Source of truth

This repository is homed at `http://localhost:3300/EdgeVector/fold_db_website.git`. LastGit change requests
and `.lastgit/ci.sh` are the merge gate; GitHub is a read-only public mirror for
clone and browse workflows. Repo-local GitHub Actions are intentionally inert.

Mirror sync is handled by `.lastgit/sync-github-mirror.sh`, optionally installed
as `com.edgevector.lastgit-mirror-fold-db-website` with
`.lastgit/install-mirror-launchd.sh`.

## Related

- Install: https://thelastdb.com/#install
- Homebrew: `brew install edgevector/lastdb/lastdb` — [homebrew-lastdb](https://github.com/EdgeVector/homebrew-lastdb)
- Public apps: [EdgeVector on GitHub](https://github.com/EdgeVector)
