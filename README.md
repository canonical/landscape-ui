# Landscape UI Debian Build Branch

This branch is intended for use when building the `landscape-dashboard` package for distribution. The basic steps are as follows:

  1. check out the `ppa-build` branch

         git switch ppa-build

  2. copy the `assets` directory, `index.html`, and `favicon.svg`.

         cp -r ./assets ..
         cp ./index.html ..
         cp ./favicon.svg ..

  4. check out this branch

         git switch ppa-build-debian

  5. delete the `assets` directory and replace it with the one you copied. Also bring back the `index.html` and `favicon.svg`

         rm -r ./assets
         mv ../assets ./
         mv ../index.html ./
         mv ../favicon.svg ./

  3. update the changelog for new `<VERSION>`

         dch

  4. create the orig tarball and cleanup extra files (should be just this README)

         tar -cf ../landscape-dashboard_<VERSION>.orig.tar ./index.html ./favicon.svg ./assets
         gzip ../landscape-dashboard_<VERSION>.orig.tar
         rm README.md

  5. perform a source build

         debuild -S

  6. upload

         dput ppa:myaccount/my-ppa ./landscape-dashboard_<VERSION>-0landscape0_source.changes

  7. restore the `README` and commit and push to this branch
