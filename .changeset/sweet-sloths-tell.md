---
"landscape-ui": minor
---

Restrict dev server exposure by removing the --host flag from the dev script. This keeps the server listening on localhost instead of all network interfaces, reducing access from other devices on the local network and improving development security (particularly when utilizing public networks)
