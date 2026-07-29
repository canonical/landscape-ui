import { describe, expect, it } from "vitest";
import { ADMINISTRATORS_DOCUMENTATION_URL } from "./documentationUrls";

/*
These tests are to verify that each exported URL is correctly composed from the shared base path
(EXTERNAL_PATHS.documentation in @/libs/routes/external) and its page-specific slug.
Centralising this check here means downstream component tests only need to assert
the correct constant is used — not that the full URL is valid. These tests will also verify
that the correct base path (https://ubuntu.com/landscape/docs) is present, and ensure that
future refactoring to the base path will be covered by testing.
*/

const BASE_PATH = "https://ubuntu.com/landscape/docs";

describe("documentationUrls", () => {
  it("ADMINISTRATORS_DOCUMENTATION_URL contains the docs base path", () => {
    expect(ADMINISTRATORS_DOCUMENTATION_URL).toContain(BASE_PATH);
  });

  it("ADMINISTRATORS_DOCUMENTATION_URL points to the correct page", () => {
    expect(ADMINISTRATORS_DOCUMENTATION_URL).toBe(
      `${BASE_PATH}/administrators`,
    );
  });
});
