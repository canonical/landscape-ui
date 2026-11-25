#!/usr/bin/env bash
set -euo pipefail

# The version comes from the release metadata or the rehearsal stanza.
version=$1
upstream=${version%-*}
output=$2
marker=$3
package=landscape-dashboard
if [[ "$version" == 0~rehearsal.* ]]; then
  package=landscape-dashboard-rehearsal
fi
source="${package}-${upstream}"
orig="${package}_${upstream}.orig.tar.gz"
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
mkdir -p "$output" "$work/$source"
output=$(realpath "$output")
cp -r dist/{assets,icons,index.html,favicon.svg} "$work/$source/"
# Build the orig once for the Jammy source upload.
tar -C "$work" -czf "$work/$orig" "$source"
cp -r debian "$work/$source/"
if [[ "$package" == landscape-dashboard-rehearsal ]]; then
  packaging="$work/$source/debian"
  # A separate package name keeps the rehearsal from replacing daily builds.
  # Keep the installed file paths identical and prevent co-installation.
  sed -i -e "s/^Source: landscape-dashboard$/Source: $package/" \
      -e "s/^Package: landscape-dashboard$/Package: $package\nConflicts: landscape-dashboard/" \
      "$packaging/control"
  shopt -s nullglob
  for file in "$packaging"/landscape-dashboard.* "$packaging"/landscape-dashboard-*; do
    name=${file##*/}
    mv "$file" "$packaging/$package${name#landscape-dashboard}"
  done
  shopt -u nullglob
  {
    printf '%s (%s) jammy; urgency=medium\n\n' "$package" "$version"
    printf '  * Daily PPA publication rehearsal.\n\n'
    printf ' -- Landscape Team <landscape-team@canonical.com>  %s\n' "$(date -Ru)"
  } > "$packaging/changelog"
fi
(cd "$work/$source" && dpkg-buildpackage -S -sa --no-sign)
changes="$work/${package}_${version}_source.changes"
grep -Fx "Version: $version" "$changes"

mkdir "$output/jammy"
cp "$work/$orig" "$work"/*.dsc "$work"/*.debian.tar.* "$work"/*.buildinfo "$output/jammy/"
# Launchpad routes by the signed .changes Distribution.
sed -e 's/^Distribution: .*/Distribution: jammy/' \
    -e "/^Changes:$/a\   * ${marker}:jammy" \
    "$changes" > "$output/jammy/${changes##*/}"
