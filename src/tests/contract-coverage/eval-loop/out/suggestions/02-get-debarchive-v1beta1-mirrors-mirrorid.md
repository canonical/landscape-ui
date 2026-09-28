# Cover mirror fetch (mock)

| Field             | Value                                        |
| ----------------- | -------------------------------------------- |
| Route             | `GET /debarchive/v1beta1/mirrors/{mirrorId}` |
| Backend           | unknown                                      |
| Frontend hits     | n/a                                          |
| Observed statuses | n/a                                          |

## Why this matters

Mock suggestion for dry-runs.

## Proposed spec

```ts
// mock spec
```

## How to apply

- [ ] Create the spec file under `e2e/docker-stack/api/`
- [ ] Run `pnpm exec playwright test --config e2e/docker-stack/playwright.api-contract.config.ts`
- [ ] See the suite README (`e2e/docker-stack/README.md`) for conventions
- [ ] Notes: Generated with LLM_MOCK=1 — not a real proposal.
