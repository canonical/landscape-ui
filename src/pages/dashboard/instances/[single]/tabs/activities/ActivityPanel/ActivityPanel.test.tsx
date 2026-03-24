import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import ActivityPanel from "./ActivityPanel";
import { expectLoadingState } from "@/tests/helpers";
import { activities } from "@/tests/mocks/activity";

const targetActivity = "Start instance Bionic WSL";
const idOfInstanceWithActivity = activities.find((activity) =>
  activity.summary.includes(targetActivity),
)?.computer_id;

describe("ActivityPanel", () => {
  it("shows activities after loading", async () => {
    renderWithProviders(
      <ActivityPanel instanceId={idOfInstanceWithActivity} />,
    );

    await expectLoadingState();

    expect((await screen.findAllByText(targetActivity)).length).toBeGreaterThan(
      0,
    );
  });
});
