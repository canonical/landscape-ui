# PPA Build Branch

This branch is intended for use for packaging `landscape-dashboard` and uploading it to Landscape's release PPAs.

The branch itself should be kept up-to-date by the [PPA build commit workflow](https://github.com/canonical/landscape-dashboard/blob/dev/.github/workflows/build.yaml). It consists solely of built artifacts from the `main` branch, the debian directory, and this README.

If you want to build the latest debian package manually, checking out this branch and using `debuild` should be enough.
