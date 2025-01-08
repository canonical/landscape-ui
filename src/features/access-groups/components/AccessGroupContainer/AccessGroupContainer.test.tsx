import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { accessGroups } from "@/tests/mocks/accessGroup";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import AccessGroupContainer from "./AccessGroupContainer";

describe("AccessGroupContainer", () => {
  it("renders AccessGroupContainer", async () => {
    renderWithProviders(<AccessGroupContainer />);
    await expectLoadingState();

    for (const accessGroup of accessGroups) {
      const group = screen.getByRole("rowheader", {
        name: accessGroup.title,
      });
      expect(group).toBeVisible();
    }
  });

  it("AccessGroupContainer error", async () => {
    setEndpointStatus("empty");
    renderWithProviders(<AccessGroupContainer />);

    await expectLoadingState();

    expect(screen.getByText("No access groups found")).toBeInTheDocument();
  });
});
