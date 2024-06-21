# Landscape Dashboard Debian Build Branch

This branch is intended for use when building the `landscape-dashboard` package for distribution. The basic steps are as follows:

  1. check out this branch

         git switch ppa-build-debian
     
  2. merge the latest changes from `ppa-build`, resolving all conflicts with that branch's version

         git merge -X theirs ppa-build

  3. update the changelog

         dch

  4. perform a source build

         debuild -S

  5. upload

         dput ppa:myaccount/my-ppa ./landscape-dashboard_0.0.X-0landscape0_source.changes

  6. commit and push to this branch
