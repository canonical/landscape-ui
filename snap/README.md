# landscape-ui snap

Serves the Landscape web dashboard (Vite/React SPA) over HTTPS and reverse-proxies API traffic to the Landscape backend services.

---

## Build

### macOS (via Multipass)

`snapcraft` only runs on Linux, so on macOS the build script manages a Multipass Ubuntu 24.04 VM automatically — creating it on first run and reusing it on subsequent runs.

**Prerequisites:** [Multipass](https://multipass.run) installed.

```sh
cd landscape-packaging/landscape-ui

./snap/build-snap.sh              # production build
./snap/build-snap.sh --mock       # MSW-enabled build — no backend needed
```

The VM is named `landscape-ui-build`. The script mounts the project directory into the VM at `/build`, rsyncs source to `/root/landscape-ui-src/`, and runs `snapcraft pack --destructive-mode` there. The `.snap` file is copied back to `snap/`.

### Linux

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

## Install

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
# open https://<ip>/new_dashboard/
```

---

## Connecting to a backend

The snap proxies `/api/` and `/debarchive/` to configurable hosts. There are two supported setups.

### Option A — backend on the Mac host (snap in Multipass VM)

Run the landscape-backend rock stack on your Mac as normal (`docker compose up` in `landscape-packaging/rock/`), then point the snap at the Mac's IP as seen from the VM:

```sh
# The Mac host is always reachable from Multipass VMs at 192.168.64.1
multipass exec landscape-ui-build -- sudo snap set landscape-ui \
  landscape.ui.backend-host=192.168.64.1 \
  landscape.ui.backend-port=443 \
  landscape.ui.debarchive-host=192.168.64.1 \
  landscape.ui.debarchive-port=443
```

The snap nginx proxies to `https://192.168.64.1:443` with TLS verification disabled (self-signed backend cert is fine).

Open `https://192.168.64.24/new_dashboard/` (use your VM's actual IP).

### Option B — backend inside the Multipass VM (fully self-contained)

Run the rock stack inside the same VM as the snap. Useful for demos or QA where you want a fully isolated environment.

**1. Install Docker in the VM:**

```sh
multipass exec landscape-ui-build -- bash -c "
  curl -fsSL https://get.docker.com | sudo sh
  sudo usermod -aG docker ubuntu
"
```

**2. Copy the rock image into the VM and import it:**

```sh
# On your Mac — copy the built .rock file into the VM
multipass transfer \
  landscape-packaging/rock/landscape-backend_*.rock \
  landscape-ui-build:/home/ubuntu/

# In the VM — import into Docker
multipass exec landscape-ui-build -- bash -c "
  docker run -d -p 6100:5000 --name registry registry:2
  skopeo copy --dest-tls-verify=false \
    oci-archive:/home/ubuntu/landscape-backend_*.rock \
    docker://localhost:6100/landscape-backend:latest
  docker pull localhost:6100/landscape-backend:latest
  docker tag localhost:6100/landscape-backend:latest landscape-backend:latest
"
```

**3. Copy the compose stack and start it:**

```sh
multipass transfer --recursive \
  landscape-packaging/rock/. \
  landscape-ui-build:/home/ubuntu/landscape-rock/

multipass exec landscape-ui-build -- bash -c "
  cd /home/ubuntu/landscape-rock
  LANDSCAPE_BOOTSTRAP_SCHEMA_ARGS='--with-computers' docker compose up -d
"
```

**4. Point the snap at localhost (default — no `snap set` needed):**

The snap's default `backend-host` is `localhost` and `backend-port` is `443`, matching the compose stack's haproxy port. If you previously changed these, reset them:

```sh
multipass exec landscape-ui-build -- sudo snap set landscape-ui \
  landscape.ui.backend-host=localhost \
  landscape.ui.backend-port=443 \
  landscape.ui.debarchive-host=localhost \
  landscape.ui.debarchive-port=443
```

The compose stack's haproxy listens on port 443 inside the VM, so the snap proxies to `https://localhost:443`.

Open `https://<vm-ip>/new_dashboard/`.

---

## Mock mode (MSW)

Build with `--mock` to embed [Mock Service Worker](https://mswjs.io/) in the bundle. All API calls are intercepted in-browser — no Landscape backend is required. Useful for UI development and demo purposes.

```sh
./snap/build-snap.sh --mock          # macOS
./snap/build-snap-linux.sh --mock    # Linux
sudo snap install --devmode snap/landscape-ui_*.snap
```

---

## Configuration

Use `snap set` to configure the snap at runtime. Changes take effect immediately (the service restarts automatically).

| Key                            | Default        | Description                  |
| ------------------------------ | -------------- | ---------------------------- |
| `landscape.ui.listen-port`     | `443`          | HTTPS listen port            |
| `landscape.ui.backend-host` | `localhost` | Landscape API host |
| `landscape.ui.backend-port` | `443` | Landscape API port (haproxy) |
| `landscape.ui.backend-scheme` | `https` | Landscape API scheme (`http` or `https`) |
| `landscape.ui.debarchive-host` | `localhost` | Deb archive host |
| `landscape.ui.debarchive-port` | `8000` | Deb archive port |
| `landscape.ui.debarchive-scheme` | `http` | Deb archive scheme (`http` or `https`) |
| `landscape.ui.cert-file`       | auto-generated | Path to TLS certificate      |
| `landscape.ui.key-file`        | auto-generated | Path to TLS private key      |

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
