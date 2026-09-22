import type { APIRequestContext } from "@playwright/test";

export async function login(request: APIRequestContext): Promise<void> {
  // Helper call that should count toward API-contract coverage.
  await request.post("/api/v2/login", { data: { user: "admin" } });
}
