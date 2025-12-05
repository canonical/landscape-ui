set -e

cd dist
cp -r ../debian .

export DEBFULLNAME="Ethan Shaw"
export DEBEMAIL=ethan.shaw@canonical.com

dch \
  --newversion $1-0landscape0 \
  --distribution jammy \
  "Release $1 for jammy"

tar -cf ../landscape-dashboard_$1.orig.tar \
  assets \
  favicon.svg \
  index.html

gzip ../landscape-dashboard_$1.orig.tar
debuild -S -sa --no-sign

cd debian
cp changelog files ../../debian