# Landscape Dashboard Debian Build Branch

This branch is intended for use when building the `landscape-dashboard` package for distribution. The basic steps are as follows:

  1. check out this branch

         git switch ppa-build-debian
     
  2. merge the latest changes from `ppa-build`, resolving all conflicts with that branch's version

         git merge -X theirs ppa-build

  3. update the changelog for new `<VERSION>`

         dch

  4. create the orig tarball and cleanup extra files (should be just this README)

         tar -cf ../landscape-dashboard_<VERSION>.orig.tar ./index.html ./favicon.svg ./assets
         gzip ../landscape-dashboard_<VERSION>.orig.tar
         rm README.md

  6. perform a source build

         debuild -S

  7. upload

         dput ppa:myaccount/my-ppa ./landscape-dashboard_0.0.X-0landscape0_source.changes

  8. restore the `README` and commit and push to this branch
