#! /bin/sh

KEY_MAPPINGS="
LANDSCAPE_UI_BACKEND_HOST|landscape.ui.backend-host|localhost
LANDSCAPE_UI_BACKEND_PORT|landscape.ui.backend-port|443
LANDSCAPE_UI_DEBARCHIVE_HOST|landscape.ui.debarchive-host|localhost
LANDSCAPE_UI_DEBARCHIVE_PORT|landscape.ui.debarchive-port|443
LANDSCAPE_UI_LISTEN_PORT|landscape.ui.listen-port|443
LANDSCAPE_UI_CERT_FILE|landscape.ui.cert-file|
LANDSCAPE_UI_KEY_FILE|landscape.ui.key-file|
"

# Set env based on snap configs, falling back to default if unset
while IFS='|' read -r env_key snap_key default_val; do
    [ -z "$env_key" ] && continue

    # Fetch the value from the snap configuration
    snap_val="$(snapctl get "$snap_key")"

    if [ -z "$snap_val" ]; then
        snapctl set "$snap_key"="$default_val"
    fi

    # Export the variable: Use snap_val if it exists, otherwise use default_val
    export "$env_key=${snap_val:-$default_val}"
done <<EOF
$KEY_MAPPINGS
EOF

# Generate self-signed cert if no cert configured
if [ -z "$LANDSCAPE_UI_CERT_FILE" ]; then
    sh "$SNAP/generate-cert.sh"
    export LANDSCAPE_UI_CERT_FILE="$SNAP_COMMON/ssl/nginx.crt"
    export LANDSCAPE_UI_KEY_FILE="$SNAP_COMMON/ssl/nginx.key"
fi

# Create nginx temp directories
mkdir -p \
    "$SNAP_COMMON/nginx-tmp/client" \
    "$SNAP_COMMON/nginx-tmp/proxy" \
    "$SNAP_COMMON/nginx-tmp/fastcgi" \
    "$SNAP_COMMON/nginx-tmp/uwsgi" \
    "$SNAP_COMMON/nginx-tmp/scgi"

# Render nginx config from template
envsubst '${SNAP} ${SNAP_COMMON} ${LANDSCAPE_UI_LISTEN_PORT} ${LANDSCAPE_UI_CERT_FILE} ${LANDSCAPE_UI_KEY_FILE} ${LANDSCAPE_UI_BACKEND_HOST} ${LANDSCAPE_UI_BACKEND_PORT} ${LANDSCAPE_UI_DEBARCHIVE_HOST} ${LANDSCAPE_UI_DEBARCHIVE_PORT}' \
    < "$SNAP/nginx.conf.tmpl" > "$SNAP_COMMON/nginx.conf"

exec nginx -c "$SNAP_COMMON/nginx.conf" -g "daemon off;"
