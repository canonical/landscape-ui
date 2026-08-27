---
"landscape-ui": patch
---

Replace moment.js with a custom `ChronoDate` class to remove the moment.js dependency and reduce bundle size. Behavior is preserved across parsing, formatting, UTC/local modes, calendar, diff math (including DST adjustment), and strict ISO 8601 validation.
