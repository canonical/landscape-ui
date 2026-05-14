#!/bin/sh
# build-snap-linux.sh — build the landscape-ui snap directly on a Linux host.
#
# Requirements:
#   sudo snap install snapcraft --classic
#   sudo snap install node --channel=24/stable --classic  (or use system node >=24)
#
# Usage:
#   ./snap/build-snap-linux.sh              # production build
#   ./snap/build-snap-linux.sh --mock       # MSW-enabled build (no backend needed for testing)

set -e

MOCK=false

for arg in "$@"; do
    case "$arg" in
        --mock) MOCK=true ;;
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
    echo "MSW mock mode enabled — writing .env.production.local"
fi

cleanup() {
    [ "$CLEANUP" = true ] && rm -f "$ENV_OVERRIDE"
}
trap cleanup EXIT

cd "$PROJECT_DIR"

# Always clean the frontend part so env changes (e.g. VITE_MSW_ENABLED)
# are picked up — snapcraft does not track .env files as source inputs.
snapcraft clean frontend --destructive-mode

mkdir -p snap/output
snapcraft pack --destructive-mode --output snap/output 2>&1

SNAP_FILE="$(ls snap/output/*.snap 2>/dev/null | head -1)"
if [ -n "$SNAP_FILE" ]; then
    echo "Built: $SNAP_FILE"
else
    echo "Warning: no .snap file found in snap/output/"
fi
