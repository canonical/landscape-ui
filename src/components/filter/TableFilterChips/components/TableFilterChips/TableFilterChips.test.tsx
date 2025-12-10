import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import TableFilterChips from "./TableFilterChips";
import {
  filterSearchQuery,
  getItem,
  getPassRate,
  parseSearchQuery,
} from "./helpers";

describe("TableFilterChips", () => {
  const user = userEvent.setup();

  it("removes an availability zone chip", async () => {
    renderWithProviders(
      <TableFilterChips
        filtersToDisplay={["availabilityZones"]}
        availabilityZonesOptions={[]}
      />,
      undefined,
      "/?availabilityZones=zone1,zone2",
    );

    const chipTexts = [
      screen.getByText("Availability z.: zone1"),
      screen.getByText("Availability z.: zone2"),
    ] as const;

    expect(chipTexts[0]).toBeInTheDocument();
    expect(chipTexts[1]).toBeInTheDocument();

    const chip = chipTexts[0].parentElement;
    assert(chip);
    await user.click(within(chip).getByRole("button", { name: "Dismiss" }));
    expect(
      screen.queryByText("Availability z.: zone1"),
    ).not.toBeInTheDocument();
  });

  it("getPassRate returns a value", () => {
    expect(getPassRate(0, 0)).toBeUndefined();
    expect(getPassRate(0, 1)).toBe("0%");
  });
});

describe("parseSearchQuery", () => {
  it("returns a list of query parts", () => {
    const queryParts = parseSearchQuery("abc,def");

    assert(queryParts[0]);
    assert(queryParts[1]);

    expect(queryParts[0].label).toBe("'abc'");
    expect(queryParts[0].value).toBe("abc");
    expect(queryParts[1].label).toBe("'def'");
    expect(queryParts[1].value).toBe("def");
  });
});

describe("filterSearchQuery", () => {
  it("removes a query part", () => {
    expect(filterSearchQuery("abc,def", "abc")).toBe("def");
  });

  it("does nothing if the query part isn't found", () => {
    expect(filterSearchQuery("abc,def", "ghi")).toBe("abc,def");
  });
});

describe("getItem", () => {
  it("returns undefined", () => {
    expect(getItem(undefined, "")).toBeUndefined();
  });

  it("returns a label", () => {
    expect(getItem([{ label: "Label", value: "value" }], "value")).toBe(
      "Label",
    );
  });

  it("returns the value if there is no item", () => {
    expect(getItem(undefined, "value")).toBe("value");
  });
});
