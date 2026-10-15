---
---

Internal: release-process overhaul. `main` no longer publishes an artifact —
its Changeset versioning moves to a dedicated workflow and it serves only as the
CHANGELOG baseline. Versioning is reworked so `release/YY.MM` builds `YY.MM.0.x`
and point releases are `point/YY.MM.N` → `YY.MM.N.x` (candidates carry `-rc`
until promoted via the `RELEASED_BRANCHES` variable, which governs `release/*` and
`point/*` alike), each publishing to its own `ppa-build-YY.MM.N`. The retired `dev`
branch is removed from the pipeline.
