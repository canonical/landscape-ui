# API Contract Eval Loop

A weekly automated check that answers one question:

> **Which API endpoints does the frontend actually use that our backend API-contract tests never exercise?**

It then asks an LLM to draft Playwright API-contract test specs for the 5 highest-impact gaps, so adding coverage is a copy-paste-review job instead of a research project.

## Quick start

```bash
pnpm coverage:full   # run the Vitest suite (produces the MSW coverage report)
pnpm eval:collect    # deterministic: build the gap list -> out/gaps.json
pnpm eval:suggest    # LLM: draft spec suggestions -> out/suggestions/*.md
```

No LLM key handy? Dry-run the whole loop with a mock:

```bash
LLM_MOCK=1 pnpm eval:suggest
```

## Acting on a suggestion

Each file in `out/suggestions/` is one endpoint gap: why it matters, plus a complete draft spec. To land one:

1. Review the draft (it is a starting point, not gospel — check assertions and seed-data assumptions).
2. Copy it into `e2e/docker-stack/api/` as a new `*.spec.ts` file.
3. Run the suite against your local backend stack:

   ```bash
   pnpm exec playwright test --config e2e/docker-stack/playwright.api-contract.config.ts
   ```

4. Iterate until green, then commit like any other API-contract test.

## Configuration

| Variable       | Required | Default                        | Purpose                            |
| -------------- | -------- | ------------------------------ | ---------------------------------- |
| `LLM_API_KEY`  | yes\*    | —                              | OpenRouter API key (or compatible) |
| `LLM_BASE_URL` | no       | `https://openrouter.ai/api/v1` | Any OpenAI-compatible endpoint     |
| `LLM_MODEL`    | no       | `openai/gpt-4o-mini`           | Model used for suggestions         |
| `LLM_MOCK`     | no       | —                              | Set to `1` for a no-key dry-run    |

\* Only for real suggestions. `eval:collect` never needs a key.

> GitHub Models was the original default provider but entered retirement brownouts in July 2026, so OpenRouter is the default. Any OpenAI-compatible provider works via the variables above.

## How it works

The loop is deliberately split into a deterministic phase and an LLM phase:

```
coverage:full ──> msw-contract-coverage.json ──> collect-gaps.ts ──> out/gaps.json
      (Vitest + MSW traffic)        (validate report, statically scan
                                     e2e/docker-stack/api/*.spec.ts,
                                     rank uncovered routes by usage)
                                                          │
                                                          ▼
                                     run-eval-loop.ts ──> LLM (top 5 only)
                                                          │
                                                          ▼
                                     render.ts ──> out/suggestions/*.md
```

- **Collection never involves an LLM.** Gap detection is pure scripts, so results are reproducible and reviewable.
- **The LLM only elaborates.** It receives just the top-5 gaps (with real observed request/response payloads) and one exemplar spec — never the whole report.
- **Failures degrade gracefully.** If the LLM call fails, you still get `gaps.json`; coverage or report problems fail fast with a clear message.

Files: `types.ts` (shapes + validators), `collect-gaps.ts` (collection), `llm-client.ts` (provider-agnostic LLM client), `prompt.ts` (prompt builder), `render.ts` (markdown renderer), `run-eval-loop.ts` (orchestrator). Tests are colocated (`*.test.ts`).

## In CI

The **API Contract Eval Loop** workflow runs every Monday 06:00 UTC and on demand (**Actions → API Contract Eval Loop → Run workflow**). Download the `api-contract-eval-report` artifact from a run to get `gaps.json` and the suggestion markdown files; the run summary lists the top suggestions inline.

Requires the `LLM_API_KEY` repo secret (OpenRouter key). Optional repo vars `LLM_BASE_URL` / `LLM_MODEL` override the defaults.

## Troubleshooting

- **"Report missing … run pnpm coverage:full first"** — the coverage report is generated, not committed. Run `pnpm coverage:full` before `eval:collect`.
- **"malformed report"** — a previous run was interrupted. Re-run `pnpm coverage:full`.
- **LLM step failed but you want the gap list** — it's already on disk: `out/gaps.json` is written before any LLM call, and CI uploads it even when the suggestion step fails.
- **"Set LLM_API_KEY"** — export your OpenRouter key, or use `LLM_MOCK=1` for a dry-run.
