#!/bin/sh
# Tests for nginx.conf.tmpl rendering via the envsubst call in start-landscape-ui.sh.
#
# Run: sh snap/tests/test-nginx-config-render.sh

set -e

TESTS_DIR="$(cd "$(dirname "$0")" && pwd)"
SNAP_DIR="$(dirname "$TESTS_DIR")"
TEMPLATE="$SNAP_DIR/local/nginx.conf.tmpl"

PASS=0
FAIL=0

pass() { echo "  PASS: $1"; PASS=$((PASS + 1)); }
fail() { echo "  FAIL: $1"; echo "        expected: $2"; echo "        got:      $3"; FAIL=$((FAIL + 1)); }

render() {
    SNAP="$1" \
    SNAP_COMMON="$2" \
    LANDSCAPE_UI_LISTEN_PORT="$3" \
    LANDSCAPE_UI_CERT_FILE="$4" \
    LANDSCAPE_UI_KEY_FILE="$5" \
    LANDSCAPE_UI_BACKEND_SCHEME="$6" \
    LANDSCAPE_UI_BACKEND_HOST="$7" \
    LANDSCAPE_UI_BACKEND_PORT="$8" \
    LANDSCAPE_UI_DEBARCHIVE_SCHEME="$9" \
    LANDSCAPE_UI_DEBARCHIVE_HOST="${10}" \
    LANDSCAPE_UI_DEBARCHIVE_PORT="${11}" \
    envsubst '${SNAP} ${SNAP_COMMON} ${LANDSCAPE_UI_LISTEN_PORT} ${LANDSCAPE_UI_CERT_FILE} ${LANDSCAPE_UI_KEY_FILE} ${LANDSCAPE_UI_BACKEND_SCHEME} ${LANDSCAPE_UI_BACKEND_HOST} ${LANDSCAPE_UI_BACKEND_PORT} ${LANDSCAPE_UI_DEBARCHIVE_SCHEME} ${LANDSCAPE_UI_DEBARCHIVE_HOST} ${LANDSCAPE_UI_DEBARCHIVE_PORT}' \
    < "$TEMPLATE"
}

assert_contains() {
    label="$1"; needle="$2"; haystack="$3"
    if echo "$haystack" | grep -qF "$needle"; then
        pass "$label"
    else
        fail "$label" "$needle" "(not found)"
    fi
}

assert_not_contains() {
    label="$1"; needle="$2"; haystack="$3"
    if echo "$haystack" | grep -qF "$needle"; then
        fail "$label" "(absent)" "$needle"
    else
        pass "$label"
    fi
}

echo "nginx.conf.tmpl rendering tests"
echo "================================"

CONF=$(render \
    /snap/landscape-ui/current \
    /var/snap/landscape-ui/common \
    443 \
    /var/snap/landscape-ui/common/ssl/nginx.crt \
    /var/snap/landscape-ui/common/ssl/nginx.key \
    https localhost 443 \
    http  localhost 8000)

echo ""
echo "defaults"
assert_contains "listen port"          "listen 443 ssl"                                       "$CONF"
assert_contains "ssl_certificate"      "ssl_certificate     /var/snap/landscape-ui/common/ssl/nginx.crt" "$CONF"
assert_contains "ssl_certificate_key"  "ssl_certificate_key /var/snap/landscape-ui/common/ssl/nginx.key" "$CONF"
assert_contains "mime.types path"      "include       /snap/landscape-ui/current/etc/nginx/mime.types"   "$CONF"
assert_contains "web root"             "root /snap/landscape-ui/current/var/www/landscape-ui"  "$CONF"
assert_contains "api proxy_pass"       "proxy_pass https://localhost:443"                      "$CONF"
assert_contains "debarchive proxy_pass""proxy_pass http://localhost:8000"                      "$CONF"
REWRITE_NEEDLE='rewrite ^/debarchive/(.*) /$1 break'
assert_contains "debarchive rewrite"   "$REWRITE_NEEDLE"                                       "$CONF"
assert_contains "spa try_files"        "try_files \$uri /index.html"                           "$CONF"
assert_contains "root redirect"        "return 301 /new_dashboard/"                            "$CONF"
assert_contains "proxy_ssl_verify off" "proxy_ssl_verify off"                                  "$CONF"
assert_not_contains "nginx vars unexpanded" "\${uri}"                                          "$CONF"
assert_not_contains "nginx vars unexpanded" "\${host}"                                         "$CONF"

echo ""
echo "custom host and port"
CONF=$(render \
    /snap/landscape-ui/current \
    /var/snap/landscape-ui/common \
    8443 \
    /var/snap/landscape-ui/common/ssl/nginx.crt \
    /var/snap/landscape-ui/common/ssl/nginx.key \
    https 192.168.64.1 443 \
    http  192.168.64.1 8000)

assert_contains "custom listen port"        "listen 8443 ssl"                          "$CONF"
assert_contains "custom api host"           "proxy_pass https://192.168.64.1:443"      "$CONF"
assert_contains "custom debarchive host"    "proxy_pass http://192.168.64.1:8000"      "$CONF"

echo ""
echo "http backend scheme"
CONF=$(render \
    /snap/landscape-ui/current \
    /var/snap/landscape-ui/common \
    443 \
    /var/snap/landscape-ui/common/ssl/nginx.crt \
    /var/snap/landscape-ui/common/ssl/nginx.key \
    http localhost 9080 \
    http localhost 8000)

assert_contains "http backend scheme"       "proxy_pass http://localhost:9080"         "$CONF"
assert_not_contains "no https backend"      "proxy_pass https://localhost:9080"        "$CONF"

echo ""
echo "https debarchive scheme"
CONF=$(render \
    /snap/landscape-ui/current \
    /var/snap/landscape-ui/common \
    443 \
    /var/snap/landscape-ui/common/ssl/nginx.crt \
    /var/snap/landscape-ui/common/ssl/nginx.key \
    https localhost 443 \
    https localhost 443)

assert_contains "https debarchive scheme"   "proxy_pass https://localhost:443"         "$CONF"

echo ""
echo "================================"
echo "Results: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ]
