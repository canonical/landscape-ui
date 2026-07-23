import * as Constants from "@/constants";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import ActivityPanel from "./ActivityPanel";
import { expectLoadingState } from "@/tests/helpers";
import { activities } from "@/tests/mocks/activity";

const targetActivity = "Start instance Bionic WSL";
const idOfInstanceWithActivity = activities.find((activity) =>
  activity.summary.includes(targetActivity),
)?.computer_id;

describe("ActivityPanel", () => {
  beforeEach(() => {
    vi.spyOn(Constants, "TSV_EXPORTS_ENABLED", "get").mockReturnValue(false);
  });

  it("shows activities after loading", async () => {
    renderWithProviders(
      <ActivityPanel instanceId={idOfInstanceWithActivity} />,
    );

    await expectLoadingState();

    expect((await screen.findAllByText(targetActivity)).length).toBeGreaterThan(
      0,
    );
  });

  it("does not show the export panel for a stale export side path", async () => {
    renderWithProviders(
      <ActivityPanel instanceId={idOfInstanceWithActivity} />,
      {},
      "/?sidePath=export",
    );

    await expectLoadingState();

    expect(
      screen.queryByRole("button", { name: "Generate TSV" }),
    ).not.toBeInTheDocument();
  });
});
