#!/bin/sh
set -e

CERT_DIR="$SNAP_COMMON/ssl"
mkdir -p "$CERT_DIR"
[ -f "$CERT_DIR/nginx.crt" ] && exit 0

openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
  -keyout "$CERT_DIR/nginx.key" \
  -out "$CERT_DIR/nginx.crt" \
  -subj "/CN=landscape-ui"
