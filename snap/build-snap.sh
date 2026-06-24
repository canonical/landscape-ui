#!/bin/sh
set -e

VM_NAME="landscape-ui-build"
VM_CPUS="4"
VM_MEMORY="8G"
VM_DISK="40G"
MOCK=false
CLEAN_FRONTEND=false

for arg in "$@"; do
    case "$arg" in
        --mock) MOCK=true ;;
        --clean) CLEAN_FRONTEND=true ;;
        --vm=*) VM_NAME="${arg#--vm=}" ;;
        *) echo "Unknown argument: $arg" >&2; exit 1 ;;
    esac
done

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_OVERRIDE="$PROJECT_DIR/.env.production.local"
CLEANUP=false

if [ "$MOCK" = true ]; then
    printf 'VITE_MSW_ENABLED=true\nVITE_MSW_ENDPOINTS_TO_INTERCEPT=/\n' > "$ENV_OVERRIDE"
    CLEANUP=true
    CLEAN_FRONTEND=true
    echo "MSW mock mode enabled — writing .env.production.local"
fi

cleanup() {
    [ "$CLEANUP" = true ] && rm -f "$ENV_OVERRIDE"
}
trap cleanup EXIT

ensure_vm() {
    if ! multipass info "$VM_NAME" >/dev/null 2>&1; then
        echo "Creating VM '$VM_NAME'..."
        multipass launch 24.04 \
            --name "$VM_NAME" \
            --cpus "$VM_CPUS" \
            --memory "$VM_MEMORY" \
            --disk "$VM_DISK"
        echo "Installing snapcraft in VM..."
        multipass exec "$VM_NAME" -- sudo snap install snapcraft --classic
    fi
}

ensure_mount() {
    if ! multipass info "$VM_NAME" --format json | grep -q "$PROJECT_DIR"; then
        multipass mount "$PROJECT_DIR" "$VM_NAME":/build
    fi
}

ensure_vm
ensure_mount

echo "Syncing source into VM..."
multipass exec "$VM_NAME" -- sudo rsync -a --delete \
    --exclude=node_modules \
    --exclude=dist \
    --exclude=parts \
    --exclude=stage \
    --exclude=prime \
    /build/ /root/landscape-ui-src/

echo "Building snap in VM '$VM_NAME'..."
if [ "$CLEAN_FRONTEND" = true ]; then
    echo "Cleaning frontend part before build..."
    multipass exec "$VM_NAME" -- sudo -H sh -c 'set -e; cd /root/landscape-ui-src; snapcraft clean frontend --destructive-mode; mkdir -p /tmp/snap-output; snapcraft pack --destructive-mode --output /tmp/snap-output'
else
    multipass exec "$VM_NAME" -- sudo -H sh -c 'set -e; cd /root/landscape-ui-src; mkdir -p /tmp/snap-output; snapcraft pack --destructive-mode --output /tmp/snap-output'
fi

echo "Copying snap to host..."
multipass exec "$VM_NAME" -- sudo sh -c 'cp /tmp/snap-output/*.snap /build/snap/'

SNAP_FILE="$(ls "$PROJECT_DIR/snap"/*.snap 2>/dev/null | head -1)"
if [ -n "$SNAP_FILE" ]; then
    echo "Built: $SNAP_FILE"
else
    echo "Warning: no .snap file found"
fi
