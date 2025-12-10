import { expectLoadingState } from "@/tests/helpers";
import { listPockets, pockets } from "@/tests/mocks/pockets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect } from "vitest";
import PackageList from "./PackageList";

const mirrorPocket = pockets.find((p) => p.mode === "mirror");
assert(mirrorPocket);
const mirrorPocketProps: ComponentProps<typeof PackageList> = {
  distributionName: "Ubuntu",
  seriesName: "Focal Fossa",
  pocket: mirrorPocket,
};

const uploadPocket = pockets.find((p) => p.mode === "upload");
assert(uploadPocket);
const uploadPocketProps: ComponentProps<typeof PackageList> = {
  distributionName: "Ubuntu",
  seriesName: "Focal Fossa",
  pocket: uploadPocket,
};

const pullPocket = pockets.find((p) => p.mode === "pull" && p.filter_type);
assert(pullPocket);
const pullPocketProps: ComponentProps<typeof PackageList> = {
  distributionName: "Ubuntu",
  seriesName: "Focal Fossa",
  pocket: pullPocket,
};

describe("PackageList", () => {
  it("renders common buttons", () => {
    renderWithProviders(<PackageList {...mirrorPocketProps} />);
    expect(screen.getByRole("button", { name: /edit/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /remove/i })).toBeVisible();
  });

  it("renders correct mirror conditionals", async () => {
    renderWithProviders(<PackageList {...mirrorPocketProps} />);
    expect(screen.getByRole("button", { name: /sync/i })).toBeVisible();
    await expectLoadingState();

    expect(screen.getByRole("searchbox", { name: /search/i })).toBeVisible();
  });

  it("renders correct pull conditionals", async () => {
    renderWithProviders(<PackageList {...pullPocketProps} />);
    expect(screen.getByRole("button", { name: /pull/i })).toBeVisible();

    await expectLoadingState();
    expect(screen.getByRole("searchbox", { name: /search/i })).toBeVisible();
  });

  it("renders table with correct columns for mirror pocket", async () => {
    renderWithProviders(<PackageList {...mirrorPocketProps} />);

    await expectLoadingState();
    expect(screen.getByText("Package")).toBeVisible();

    const checkboxes = screen.queryAllByRole("checkbox");
    expect(checkboxes.length).toEqual(0);
  });

  it("renders table with correct columns", async () => {
    renderWithProviders(<PackageList {...uploadPocketProps} />);

    await expectLoadingState();
    const toggleAllCheckbox = screen.getByRole("checkbox", {
      name: /toggle all/i,
    });
    expect(toggleAllCheckbox).toBeVisible();

    const rowCheckboxes = screen.getAllByRole("checkbox").length - 1;
    expect(rowCheckboxes).toEqual(listPockets.length);
  });
});
