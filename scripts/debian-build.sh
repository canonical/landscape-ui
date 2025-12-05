#!/bin/sh

if [ -z "$1" ]; then
  echo "usage: $0 <version>"
  exit 1
fi

set -e

pnpm install --frozen-lockfile
pnpm run build

cd dist
cp -r ../debian .

export DEBFULLNAME="Landscape Team"
export DEBEMAIL="landscape-team@canonical.com"

dch \
  --newversion "$1-0landscape0" \
  --distribution jammy \
  "Release $1 for jammy"

tar -cf "../landscape-dashboard_$1.orig.tar" \
  assets \
  favicon.svg \
  index.html

gzip "../landscape-dashboard_$1.orig.tar"
debuild -S -sa --no-sign

cp debian/changelog ../debian
