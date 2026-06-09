import { describe, expect, it } from "vitest";
import { buildExportQuery } from "./helpers";

const FIRST_INSTANCE_ID = 11;
const SECOND_INSTANCE_ID = 42;

describe("buildExportQuery", () => {
  it("returns the original query when there is no row selection", () => {
    expect(buildExportQuery({ query: "name:prod", selectedInstanceIds: [] })).toBe(
      "name:prod",
    );
  });

  it("builds an id-only query when there is no base query", () => {
    expect(buildExportQuery({ selectedInstanceIds: [1, 2, 3] })).toBe(
      "id:1 OR id:2 OR id:3",
    );
  });

  it("combines the current query with the selected instance ids", () => {
    expect(
      buildExportQuery({
        query: "tag:server archived:false",
        selectedInstanceIds: [FIRST_INSTANCE_ID, SECOND_INSTANCE_ID],
      }),
    ).toBe(
      `(tag:server archived:false) AND (id:${FIRST_INSTANCE_ID} OR id:${SECOND_INSTANCE_ID})`,
    );
  });
});
