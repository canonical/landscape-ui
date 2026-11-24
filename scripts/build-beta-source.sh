#!/usr/bin/env bash
set -euo pipefail

# The version has already been validated against the committed changelog.
version=$1
upstream=${version%-*}
output=$2
marker=$3
package=landscape-dashboard
source="${package}-${upstream}"
orig="${package}_${upstream}.orig.tar.gz"
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
mkdir -p "$output" "$work/$source"
output=$(realpath "$output")
cp -r dist/{assets,icons,index.html,favicon.svg} "$work/$source/"
# Build the orig exactly once; every series must upload these same bytes.
tar -C "$work" -czf "$work/$orig" "$source"
cp -r debian "$work/$source/"
(cd "$work/$source" && dpkg-buildpackage -S -sa --no-sign)
changes="$work/${package}_${version}_source.changes"
grep -Fx "Version: $version" "$changes"

for series in jammy noble resolute; do
  mkdir "$output/$series"
  cp "$work/$orig" "$work"/*.dsc "$work"/*.debian.tar.* "$work"/*.buildinfo "$output/$series/"
  # Launchpad routes by the signed .changes Distribution. Leave the source
  # itself identical in all series, including its committed changelog.
  sed -e "s/^Distribution: .*/Distribution: ${series}/" \
      -e "/^Changes:$/a\   * ${marker}:${series}" \
      "$changes" > "$output/$series/${changes##*/}"
done
