# API

This document describes how HTTP access and server-state hooks are organized in this repository. `ARCHITECTURE.md` covers where the API layer sits in the app; this file covers how fetch, query, mutation, endpoint, and data-access code should be written.

## Overview

The repository currently uses:

- axios for HTTP clients
- React Query for server-state queries and mutations
- provider-backed authenticated fetch clients
- a mixed new and legacy API surface

The important split is:

- `API_URL`: newer API surface
- `API_URL_OLD`: legacy API surface still used by many existing features

Both are first-class implementation realities today. New code should minimize the old surface, but the doc must reflect both.

## Shared Fetch Infrastructure

The shared fetch layer lives in `src/api/`:

- `src/api/fetch.tsx`: authenticated axios client for `API_URL`
- `src/api/fetchOld.tsx`: authenticated axios client for `API_URL_OLD`
- `src/api/interceptors.ts`: request and response interceptor setup

Those providers are installed globally through `src/providers/AppProviders.tsx`. The provider stack and ordering are documented in `ARCHITECTURE.md`; this document focuses on how API-facing code should use that infrastructure.

Use the shared hooks to consume those clients:

- `useFetch()` for `API_URL`
- `useFetchOld()` for `API_URL_OLD`

Do not create a new authenticated axios instance in components.

## What The Interceptors Do

The shared interceptors in `src/api/interceptors.ts` and `src/utils/api.ts` are not optional details. They are part of the API contract.

Current behavior:

- the request interceptor reads the latest auth token and sets `Authorization: Bearer ...`
- requests are normalized through `generateRequestParams(...)`
- `generateRequestParams(...)` moves payload into `params` for `GET` and `DELETE`, and into `data` for other methods
- legacy requests set `config.url = ""` so the old API command name is encoded through params rather than a REST-style path
- all requests set `Content-Type: application/json`
- `401` responses trigger logout for non-auth requests
- auth-related failures such as `login` and `auth` requests are excluded from forced logout

If a feature bypasses the shared fetch providers, it is also bypassing this behavior.

## React Query Is The Default Server-State Layer

`src/context/reactQuery.tsx` defines the app-wide React Query client.

Current defaults:

- `retry: false`
- `refetchOnWindowFocus: false`
- `refetchOnReconnect: false`
- query-cache errors are reported through `useDebug()`
- the default query error type is registered as `AxiosError<ApiError>`

Use React Query hooks as the default server-state layer:

- `useQuery(...)` for reads
- `useMutation(...)` for writes
- `useQueryClient()` for invalidation, cache reset, and refetch workflows

Do not move request logic into components unless there is a concrete reason the code cannot live in a hook.

## Where API Code Lives

Preferred direction for new code:

- put feature-owned API hooks under `src/features/<feature>/api/`
- prefer one hook per endpoint or single API operation
- keep shared fetch infrastructure under `src/api/`
- keep app-wide fetch access hooks such as `useFetch` and `useFetchOld` under `src/hooks/`

Current repo reality is mixed:

- many newer features already use `src/features/*/api/`
- some older data-access code still lives in `src/hooks/`
- some legacy feature-owned data-access code still lives in `src/features/*/hooks/`

Examples of older central or mixed placement:

- `src/hooks/useRoles.ts`
- `src/hooks/useUsers.ts`
- `src/hooks/useAdministrators.ts`
- `src/hooks/useReports.ts`
- `src/features/removal-profiles/hooks/useRemovalProfiles.ts`
- `src/features/gpg-keys/hooks/useGPGKeys.ts`

For new work, prefer feature-owned API hooks over adding more domain data access to `src/hooks/`.

## One Hook Per Operation

New API work should use small, operation-specific hooks.

Preferred direction:

- one query hook per read endpoint or read operation
- one mutation hook per write endpoint or write operation
- one file per hook
- feature-owned naming such as `useGetInstances`, `useEditScript`, or `useCreateStandaloneAccount`

Avoid grouped domain manager hooks that bundle many unrelated reads and writes into one return object.

Examples of older patterns that should not be copied for new code:

- `src/hooks/useRoles.ts`
- `src/hooks/useUsers.ts`
- `src/hooks/useAdministrators.ts`

Those files reflect current repo history, not the target shape.

## Query Patterns

Current query hooks commonly:

- accept typed params
- call `useFetch()` or `useFetchOld()`
- define array-based query keys
- accept optional React Query config through `UseQueryOptions`
- return UI-friendly values instead of exposing the full axios response everywhere

Common patterns already in the repo:

- paginated list hooks deriving `limit` and `offset` from `usePageParams()`
- optional `listenToUrlParams` behavior through `PaginatedGetHookParams`
- query keys such as `["instances", params]`, `["scripts", paramsWithPagination, config]`, and `["loginMethods", { isEmployeeLogin }]`
- query helpers typed with `QueryFnType` or `QueryFnTypeWithRequiredParam` when returning reusable query functions instead of a flattened hook contract

Representative examples:

- `src/features/instances/api/useGetInstances.ts`
- `src/features/scripts/api/useGetScripts.ts`
- `src/features/auth/hooks/useAuthHandle.ts`
- `src/hooks/useRoles.ts`

Prefer stable, domain-based query keys that make invalidation obvious.

## Mutation Patterns

Current mutation hooks commonly:

- use `mutateAsync`
- expose domain-specific method names such as `createScript`, `editWslProfile`, or `login`
- expose domain-specific pending flags such as `isCreatingScript` or `isLoggingIn`
- invalidate one or more domain query keys in `onSuccess`

Common invalidation pattern:

- invalidate the smallest stable domain key, for example `["scripts"]`, `["instances"]`, or `["standaloneAccount"]`
- invalidate multiple related keys when a mutation affects more than one view of the same data

Representative examples:

- `src/features/scripts/api/useCreateScript.ts`
- `src/features/scripts/api/useEditScript.ts`
- `src/features/account-creation/api/useCreateStandaloneAccount.ts`
- `src/features/auth/hooks/useAuthHandle.ts`

## New API vs Old API

The repo uses both REST-style newer endpoints and legacy command-style endpoints.

Typical newer API patterns:

- `authFetch.get("computers", { params })`
- `authFetch.post("/auth/oidc-providers", params)`
- `authFetch.patch("/auth/oidc-providers/:id", params)`
- `authFetch.delete("/auth/oidc-providers/:id")`

Typical legacy API patterns:

- `authFetchOld.get("CreateScript", { params })`
- `authFetchOld.get("EditScript", { params })`
- `authFetchOld.get("GetRoles", { params })`

Practical guidance:

- use `useFetch()` for newer endpoints on `API_URL`
- use `useFetchOld()` only when the backend contract still lives on `API_URL_OLD`
- do not add new domain code to the legacy surface unless the backend leaves no alternative
- when a feature still depends on the old API, keep that boundary localized to the owning feature

The current repo is migrating, not finished. `API.md` should document that mixed state rather than pretending the old API is gone.

## Public And Pre-Auth Requests

Some requests happen before authenticated providers are available.

Current examples include:

- `src/features/auth/api/useLogin.ts`
- `src/features/auth/api/useGetLoginMethods.ts`
- `src/features/auth/api/useGetAuthState.ts`
- `src/features/account-creation/api/useGetStandaloneAccount.ts`

These hooks currently create a local axios instance with:

```ts
const publicFetch = axios.create({ baseURL: API_URL });
```

Use that pattern only when the request is genuinely pre-auth or otherwise cannot depend on the shared authenticated providers.

## Return Shapes

This repo does not enforce one single return style, but the dominant patterns are:

- flatten the axios response into domain data plus loading and error flags
- return a renamed domain action around `mutateAsync`
- expose `refetch` only when the caller has a real need for it

Examples:

- `useGetInstances()` returns `instances`, `instancesCount`, `isGettingInstances`, `isFetchingInstances`, and `refetchInstances`
- `useGetScripts()` returns `scripts`, `scriptsCount`, and `isScriptsLoading`
- `useLogin()` returns `login`, `isLoggingIn`, and `error`

Prefer a hook contract that is easy for pages and components to consume. Avoid leaking raw axios response plumbing into UI code unless that detail is necessary.

## Types And Shared API Helpers

Shared API-related types live under `src/types/api/`.

Current important shared types:

- `ApiError`
- `ApiPaginatedResponse`
- `PaginatedGetHookParams`
- `QueryFnType`
- `QueryFnTypeWithRequiredParam`

Current typing conventions:

- query and mutation errors are usually typed as `AxiosError<ApiError>`
- response payloads are often typed as `AxiosResponse<T>` when the hook works directly with axios responses
- some hooks unwrap `response.data` and expose a domain object instead

Use the existing shared API types when they match the pattern already in use. Do not introduce parallel helper types for the same shape.

## Current Exceptions

The repo still contains exceptions to the preferred provider-backed pattern.

Current examples:

- `src/features/wsl-profiles/api/useEditWslProfile.ts` creates a local axios client for authenticated work and includes a TODO about `useFetch`
- `src/features/account-creation/api/useCreateStandaloneAccount.ts` creates a local axios instance
- `src/features/account-creation/api/useGetStandaloneAccount.ts` creates a local axios instance with `useState`

Treat these as current seams, not as the preferred shape for new feature work.

## Avoid These Patterns

Avoid introducing new code that:

- performs axios calls directly inside components
- creates one-off authenticated axios clients when `useFetch()` or `useFetchOld()` would work
- adds more domain data hooks to `src/hooks/` when the hook belongs to one feature
- invents unstable or overly broad query keys
- skips invalidation for mutations that change visible server state
- returns raw axios objects to UI code when a smaller hook contract would be clearer

## Testing API Hooks

Detailed testing guidance lives elsewhere, but API-layer work in this repo usually means:

- Vitest and React Testing Library for hook and component behavior
- MSW in `src/tests/` for mocked HTTP behavior in unit and component tests

See:

- [testing/index.md](testing/index.md)
- [testing/unit.md](testing/unit.md)
- [verification/index.md](verification/index.md)
