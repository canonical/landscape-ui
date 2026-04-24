import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { accessGroups } from "@/tests/mocks/accessGroup";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("opens side panel with form when Add access group button is clicked", async () => {
    setEndpointStatus("empty");
    renderWithProviders(<AccessGroupContainer />);

    await expectLoadingState();

    const addButton = screen.getByRole("button", { name: "Add access group" });
    await userEvent.click(addButton);

    expect(
      await screen.findByRole("heading", { name: "Add access group" }),
    ).toBeInTheDocument();
  });
});
