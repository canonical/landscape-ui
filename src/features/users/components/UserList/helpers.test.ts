import { describe, expect, it } from "vitest";
import type { Cell } from "react-table";
import type { User } from "@/types/User";
import { handleCellProps } from "./helpers";

const toCell = (id: string) => {
  return { column: { id } } as unknown as Cell<User>;
};

describe("UserList helpers", () => {
  it("adds rowheader role for username cells", () => {
    expect(handleCellProps(toCell("username"))).toEqual({
      role: "rowheader",
    });
  });

  it("adds accessibility labels for known columns", () => {
    expect(handleCellProps(toCell("enabled"))).toEqual({
      "aria-label": "Status",
    });
    expect(handleCellProps(toCell("uid"))).toEqual({
      "aria-label": "User id",
    });
    expect(handleCellProps(toCell("name"))).toEqual({
      "aria-label": "Full name",
    });
  });

  it("returns empty props for unknown columns", () => {
    expect(handleCellProps(toCell("shell"))).toEqual({});
  });
});
