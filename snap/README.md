# landscape-ui snap

Serves the Landscape web dashboard (Vite/React SPA) over HTTPS and reverse-proxies API traffic to the Landscape backend services.

---

## Contents

- [Build](#build--linux)
  - [Linux](#build--linux)
  - [macOS (Multipass)](#build--macos-multipass)
- [Install](#install)
- [Run](#run)
- [Access](#access)
- [Connecting to a backend](#connecting-to-a-backend)
  - [Linux](#linux)
  - [macOS (Multipass)](#macos-multipass)
- [Mock mode (MSW)](#mock-mode-msw)
- [Configuration](#configuration)
- [Logs and data paths](#logs-and-data-paths)
- [Snap files](#snap-files)
- [Appendix: MSW trade-offs](#appendix-msw-trade-offs)

---

## Build — Linux

**Prerequisites:**

```sh
sudo snap install snapcraft --classic
```

Node.js ≥ 24 is installed automatically by snapcraft via the `node/24/stable` build snap.

```sh
cd landscape-packaging/landscape-ui

./snap/build-snap-linux.sh              # production build
./snap/build-snap-linux.sh --mock       # MSW-enabled build — no backend needed
```

The `.snap` file is written to `snap/output/`.

---

## Build — macOS (Multipass)

`snapcraft` only runs on Linux. On macOS the build script manages a Multipass Ubuntu 24.04 VM automatically — creating it on first run and reusing it on subsequent runs.

**Prerequisites:** [Multipass](https://multipass.run) installed.

```sh
cd landscape-packaging/landscape-ui

./snap/build-snap.sh              # production build
./snap/build-snap.sh --mock       # MSW-enabled build — no backend needed
```

The VM is named `landscape-ui-build`. The script mounts the project directory into the VM at `/build`, rsyncs source to `/root/landscape-ui-src/`, and runs `snapcraft pack --destructive-mode` there. The `.snap` file is copied back to `snap/`.

---

## Install

Snaps can only be installed directly on Linux. If you're on a Mac or other OS, do the following steps inside the same multipass VM where you packed the snap.

```sh
sudo snap install --devmode landscape-ui_*.snap
```

`devmode` is required — the snap is `grade: devel`.

---

## Run

The snap service starts automatically after installation. To manage it manually:

```sh
sudo snap start landscape-ui
sudo snap stop landscape-ui
sudo snap restart landscape-ui
sudo snap services landscape-ui      # show status
sudo snap logs landscape-ui          # show recent logs
sudo snap logs -f landscape-ui       # follow logs
```

---

## Access

The dashboard is served at:

```
https://<host-ip>/new_dashboard/
```

A self-signed TLS certificate is generated on first start. Accept the browser warning to proceed.

**In a Multipass VM:**

```sh
multipass info landscape-ui-build | grep IPv4
# then open https://<ip>/new_dashboard/ on the host
```

---

## Connecting to a backend

The snap proxies `/api/` to the Landscape API and `/debarchive/` to the deb archive service. The `/debarchive/v1beta1/` URL slug used by the browser is fixed — nginx strips the `/debarchive` prefix before forwarding, so the backend always receives `/v1beta1/` regardless of host or port.

### Linux

**Rock stack (localhost defaults)**

The snap defaults match the rock stack's haproxy (`443`) and debarchive (`8000`) ports. Start the stack and install the snap — no `snap set` required.

```sh
cd landscape-packaging/rock
docker compose up -d
```

**Backend containers without the rock stack**

If services are running directly (not via the rock stack), ports will differ. Point the snap at them explicitly:

```sh
sudo snap set landscape-ui \
  landscape.ui.backend-host=localhost \
  landscape.ui.backend-port=9091 \
  landscape.ui.backend-scheme=http \
  landscape.ui.debarchive-host=localhost \
  landscape.ui.debarchive-port=8000 \
  landscape.ui.debarchive-scheme=http
```

### macOS (Multipass)

Run the backend on your Mac with the snap running in Multipass. The Mac host is always reachable from Multipass VMs at `192.168.64.1`:

**Option A — Using the landscape-backend rock stack:**

```sh
multipass exec landscape-ui-build -- sudo snap set landscape-ui \
  landscape.ui.backend-host=192.168.64.1 \
  landscape.ui.backend-port=443 \
  landscape.ui.debarchive-host=192.168.64.1 \
  landscape.ui.debarchive-port=8000
```

---

**Option B — Using the docker setup from landscape-packaging, no rock build:**

Same as above but with different ports:

```sh
multipass exec landscape-ui-build -- sudo snap set landscape-ui \
  landscape.ui.backend-host=192.168.64.1 \
  landscape.ui.backend-port=9091 \
  landscape.ui.backend-scheme=http \
  landscape.ui.debarchive-host=192.168.64.1 \
  landscape.ui.debarchive-port=8000 \
  landscape.ui.debarchive-scheme=http
```

---

## Mock mode (MSW)

Build with `--mock` to embed [Mock Service Worker](https://mswjs.io/) in the bundle. All API calls are intercepted in-browser — no Landscape backend is required. Useful for UI development and demo purposes.

```sh
./snap/build-snap-linux.sh --mock    # Linux
./snap/build-snap.sh --mock          # macOS
sudo snap install --devmode snap/landscape-ui_*.snap
```

See [Appendix: MSW trade-offs](#appendix-msw-trade-offs) for the implications of including or dropping this feature.

---

## Configuration

Use `snap set` to configure the snap at runtime. Changes take effect immediately (the service restarts automatically).

| Key                              | Default        | Description                              |
| -------------------------------- | -------------- | ---------------------------------------- |
| `landscape.ui.listen-port`       | `443`          | HTTPS listen port                        |
| `landscape.ui.backend-host`      | `localhost`    | Landscape API host                       |
| `landscape.ui.backend-port`      | `443`          | Landscape API port (haproxy)             |
| `landscape.ui.backend-scheme`    | `https`        | Landscape API scheme (`http` or `https`) |
| `landscape.ui.debarchive-host`   | `localhost`    | Deb archive host                         |
| `landscape.ui.debarchive-port`   | `8000`         | Deb archive port                         |
| `landscape.ui.debarchive-scheme` | `http`         | Deb archive scheme (`http` or `https`)   |
| `landscape.ui.cert-file`         | auto-generated | Path to TLS certificate                  |
| `landscape.ui.key-file`          | auto-generated | Path to TLS private key                  |

**Example — point to a running Landscape server:**

```sh
sudo snap set landscape-ui \
  landscape.ui.backend-host=192.168.1.10 \
  landscape.ui.backend-port=8080
```

**Example — bring your own certificate:**

```sh
sudo snap set landscape-ui \
  landscape.ui.cert-file=/var/snap/landscape-ui/common/ssl/custom.crt \
  landscape.ui.key-file=/var/snap/landscape-ui/common/ssl/custom.key
```

---

## Logs and data paths

| Path                                             | Contents                                    |
| ------------------------------------------------ | ------------------------------------------- |
| `/var/snap/landscape-ui/common/nginx.conf`       | Rendered nginx config (read-only reference) |
| `/var/snap/landscape-ui/common/nginx-error.log`  | nginx error log                             |
| `/var/snap/landscape-ui/common/nginx-access.log` | nginx access log                            |
| `/var/snap/landscape-ui/common/ssl/`             | Auto-generated TLS certificate and key      |

---

## Snap files

| File                               | Purpose                                                                  |
| ---------------------------------- | ------------------------------------------------------------------------ |
| `snap/snapcraft.yaml`              | Snap definition                                                          |
| `snap/local/start-landscape-ui.sh` | Service entrypoint — reads snap config, renders nginx.conf, starts nginx |
| `snap/local/nginx.conf.tmpl`       | nginx config template (envsubst)                                         |
| `snap/local/generate-cert.sh`      | Self-signed cert generation (idempotent)                                 |
| `snap/hooks/configure`             | Restarts service on `snap set`                                           |
| `snap/build-snap.sh`               | macOS build script (Multipass)                                           |
| `snap/build-snap-linux.sh`         | Linux build script (native)                                              |

---

## Appendix: MSW trade-offs

[Mock Service Worker](https://mswjs.io/) intercepts API requests in the browser's service worker layer. The `--mock` build flag embeds it in the snap bundle.

### Keeping MSW support

**Pros**

- Snap works without any backend — useful for demos, UI development, offline QA
- No `snap set` configuration needed after install

**Cons**

- Two source changes required to make MSW work in production builds:
  - `main.tsx`: the `isDevEnv &&` guard on the MSW start call must be removed, because `import.meta.env.DEV` is `false` in all Vite production builds
  - `vite.config.ts`: the `exclude-msw` plugin must skip deleting `mockServiceWorker.js` when `VITE_MSW_ENABLED=true`
- `mockServiceWorker.js` is included in every `--mock` build (~50 KB)
- `VITE_MSW_ENABLED=true` and `VITE_MSW_ENDPOINTS_TO_INTERCEPT=/` must both be set at build time; missing either silently disables interception

### Dropping MSW support

Revert these changes and the snap becomes real-backend-only:

- `main.tsx` — restore `isDevEnv &&` guard
- `vite.config.ts` — always delete `mockServiceWorker.js` from dist
- `build-snap.sh` / `build-snap-linux.sh` — remove `VITE_MSW_ENABLED` and `VITE_MSW_ENDPOINTS_TO_INTERCEPT` from `.env.production.local`; remove `--mock` flag handling
- `snap/README.md` — remove Mock mode section

Simpler build scripts, no production-mode MSW edge cases, smaller bundle.
