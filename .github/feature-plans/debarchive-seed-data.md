# Feature Plan: debarchive Sample Data Seeding

**Date:** 2026-04-15  
**Scope:** `landscape-packaging/docker/ui-dev/` (Docker Compose environment)  
**Goal:** Populate the debarchive service with realistic sample data (publication targets, mirrors, locals, publications) on first `docker compose up`, so landscape-ui development renders meaningfully without manual API calls.

---

## Recommendation: Single-service seeder using the Connect RPC API

### Why not `postgres-init/` SQL?

`postgres-init/` runs exactly once (on first volume creation) and before any service is healthy. It works for DDL (creating the database — see `02-debarchive.sql`). For DML seeding it has critical drawbacks here:

| Problem              | Detail                                                                                                                                                                                              |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aptly-managed tables | `mirror_aptly`, `local_repository_aptly`, `published_repo_aptly` contain aptly's internal binary/JSON serialisation. Raw SQL cannot produce correct values without reimplementing aptly's encoding. |
| Foreign-key ordering | Publications reference mirrors/locals by aptly-internal UUID linkage, not just a simple FK. The API enforces this; SQL does not.                                                                    |
| No idempotency       | Re-running after a DB wipe requires manual intervention; a service can check before inserting.                                                                                                      |

The `publication_target` table is simple (UUID + JSONB blob), so it _could_ be seeded via SQL. But seeding it in one place while other entities go through the API creates split ownership with no gain.

### Why the seeder service pattern?

The `builder` service in `compose.yaml` is the established precedent for one-shot initialisation containers. It:

- Declares `depends_on` with `condition: service_completed_successfully`
- Exits 0 on success, which downstream `depends_on` respect
- Is cheap (no long-running process)

A `debarchive-seeder` service follows the same pattern and calls the debarchive Connect RPC API via `curl` after the debarchive container is healthy.

---

## Implementation Steps

### Step 1 — Create the seeder shell script

**File:** `docker/ui-dev/debarchive-seed.sh`

The script must be idempotent. Check `ListPublicationTargets`; if the response already contains items, exit 0 immediately (avoids duplicate data after a restart without a full volume wipe).

**Logical flow:**

```
1. Wait-for-debarchive (already handled by depends_on: service_healthy)
2. GET ListPublicationTargets → if count > 0 → exit 0 (already seeded)
3. CreatePublicationTarget × 3 (two S3, one Swift) → capture returned IDs
4. CreateMirror × 3 (Ubuntu noble, Ubuntu jammy, a PPA) → capture returned IDs
5. CreateLocal × 2 (noble-local, jammy-local) → capture returned IDs
6. CreatePublication × ~6 (pair each mirror/local with a publication target) → done
```

**Connect RPC JSON wire format** (unary):

```bash
curl -s -X POST "http://landscape-debarchive:8000/${SERVICE_PATH}/${METHOD}" \
  -H "Content-Type: application/connect+json" \
  -d "${JSON_BODY}"
```

Service paths follow the proto package: `canonical.landscape.debarchive.v1.PublicationTargetService`, etc.

**Sample entities to create:**

_Publication Targets:_
| displayName | type | region/container |
|---|---|---|
| `Dev S3 Bucket` | S3 | `us-east-1` / `landscape-dev-packages` |
| `Staging S3 Bucket` | S3 | `eu-west-1` / `landscape-staging-packages` |
| `Swift Store` | Swift | container: `landscape-archive` |

_Mirrors:_
| displayName | archiveRoot | distribution | components | architectures |
|---|---|---|---|---|
| `Ubuntu Noble Main` | `http://archive.ubuntu.com/ubuntu` | `noble` | `["main","restricted"]` | `["amd64","arm64"]` |
| `Ubuntu Jammy Main` | `http://archive.ubuntu.com/ubuntu` | `jammy` | `["main","universe"]` | `["amd64"]` |
| `Landscape PPA` | `https://ppa.launchpadcontent.net/landscape/landscape-client/ubuntu` | `noble` | `["main"]` | `["amd64","arm64"]` |

_Locals:_
| displayName | defaultDistribution | defaultComponent |
|---|---|---|
| `Noble Internal` | `noble` | `main` |
| `Jammy Internal` | `jammy` | `main` |

_Publications (mirror each source to a target):_
| publicationTarget | source | distribution | component |
|---|---|---|---|
| `Dev S3 Bucket` | noble mirror | `noble` | `main` |
| `Dev S3 Bucket` | jammy mirror | `jammy` | `main` |
| `Staging S3 Bucket` | noble mirror | `noble` | `main` |
| `Dev S3 Bucket` | noble local | `noble` | `main` |
| `Dev S3 Bucket` | jammy local | `jammy` | `main` |
| `Swift Store` | Landscape PPA mirror | `noble` | `main` |

---

### Step 2 — Add the Dockerfile for the seeder

**File:** `docker/ui-dev/Dockerfile.debarchive-seed`

```dockerfile
FROM ubuntu:24.04
RUN apt-get update && apt-get install -y --no-install-recommends curl jq && rm -rf /var/lib/apt/lists/*
COPY debarchive-seed.sh /seed.sh
RUN chmod +x /seed.sh
CMD ["/seed.sh"]
```

Using `ubuntu:24.04` with `curl` + `jq` is sufficient. No Go toolchain required. `jq` makes parsing returned IDs from JSON responses straightforward.

---

### Step 3 — Add the seeder service to compose.yaml

**File:** `docker/ui-dev/compose.yaml`

Add after the `debarchive` service:

```yaml
debarchive-seeder:
  build:
    context: .
    dockerfile: Dockerfile.debarchive-seed
  container_name: landscape-debarchive-seeder
  restart: "no"
  depends_on:
    debarchive:
      condition: service_healthy
  networks:
    - landscape-net
```

No env_file needed — the script targets the internal Docker hostname `landscape-debarchive:8000` directly.

---

### Step 4 — Make the debarchive service health-checkable

The `debarchive` service in `compose.yaml` currently has no `healthcheck`. The seeder's `depends_on: condition: service_healthy` requires one.

Add to the `debarchive` service:

```yaml
healthcheck:
  test: ["CMD-SHELL", "curl -sf -I http://localhost:8000/ || exit 1"]
  interval: 5s
  timeout: 3s
  retries: 10
  start_period: 15s
```

The health endpoint is `HEAD /` (root) — `mux.HandleFunc("HEAD /{$}", handlers.HealthCheck)` in `routes/routes.go`. Use `-I` to send HEAD.

---

### Step 5 — Optional: Makefile target

In `docker/ui-dev/Makefile`, add:

```makefile
seed-debarchive: ## Re-run the debarchive seeder (useful after a data wipe)
	docker compose run --rm debarchive-seeder
```

---

## File Checklist

| File                                       | Action                                                                 |
| ------------------------------------------ | ---------------------------------------------------------------------- |
| `docker/ui-dev/debarchive-seed.sh`         | Create — idempotent seeder script                                      |
| `docker/ui-dev/Dockerfile.debarchive-seed` | Create — ubuntu:24.04 + curl + jq                                      |
| `docker/ui-dev/compose.yaml`               | Modify — add `debarchive-seeder` service + healthcheck on `debarchive` |
| `docker/ui-dev/Makefile`                   | Modify — add `seed-debarchive` target (optional)                       |

---

## Pre-flight Questions — Resolved

1. **Health check path:** `HEAD /` (root). Route: `mux.HandleFunc("HEAD /{$}", handlers.HealthCheck)` in `routes/routes.go`. Healthcheck test: `curl -sf -I http://localhost:8000/ || exit 1`.
2. **Connect RPC wire format:** `application/connect+json` on **port 8000** is correct. URL path: `POST /canonical.landscape.debarchive.v1.{ServiceName}/{MethodName}`. The gRPC-gateway routes are on a separate mux (port 8001).
3. **`CreateMirror` side-effects:** None. `CreateMirror` returns immediately with the mirror in `idle` status. No background task is triggered. `CreatePublication` only checks that the mirror exists — it does not require a prior sync. The seeder can call `CreatePublication` directly after `CreateMirror`.
4. **Publications with no published data:** `CreatePublication` is valid with an unsynced mirror. The UI renders "not published" state gracefully (confirmed by product owner).

---

## Non-Goals

- This plan does not seed GPG keys, snapshots, or package data — those require external artefacts and are not needed for UI component rendering.
- This plan does not modify `landscape-server`'s seeding mechanism (`uv run schema`). The two services are independent.
