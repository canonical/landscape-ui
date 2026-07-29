import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { accessGroups } from "@/tests/mocks/accessGroup";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";
import AccessGroupContainer from "./AccessGroupContainer";
import { ACCESS_GROUPS_DOCUMENTATION_URL } from "./constants";

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

  it("renders access groups documentation link in empty state", async () => {
    setEndpointStatus("empty");
    renderWithProviders(<AccessGroupContainer />);

    await expectLoadingState();

    const docsLink = screen.getByRole("link", {
      name: "How to manage access groups in Landscape",
    });

    expect(docsLink).toHaveAttribute("href", ACCESS_GROUPS_DOCUMENTATION_URL);

    /*
     * This is a redundant test (done only once in this component to avoid redundancy - which defeats
     * the whole point of centralizing documentation URLS and is meant as a test for all components with
     * documentation links) to ensure the base path URL is imported and combined properly to form the
     * final documentation URL. This test also helps validate future refactoring of the base path url.
     */
    expect(docsLink).toHaveAttribute(
      "href",
      "https://ubuntu.com/landscape/docs/access-groups",
    );
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
