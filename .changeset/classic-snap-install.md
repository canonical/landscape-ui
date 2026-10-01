---
"landscape-ui": patch
---

Fix snap install, switch channel and hold actions silently dropping their options. The channel, revision, hold time and classic confinement flag are now sent nested under `args` as the API expects, so classic-confined snaps can be installed from the new UI.
