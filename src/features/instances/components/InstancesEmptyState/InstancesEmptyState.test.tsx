import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InstancesEmptyState from "./InstancesEmptyState";
import { MANAGE_INSTANCES_DOCUMENTATION_URL } from "@/constants";
import userEvent from "@testing-library/user-event";

describe("InstancesEmptyState", () => {
  it("renders empty-state title and body copy", () => {
    renderWithProviders(<InstancesEmptyState />);

    expect(screen.getByText("No instances found")).toBeInTheDocument();
    expect(
      screen.getByText(
        "You don't have any instances registered to Landscape yet.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the docs link with the expected attributes", () => {
    renderWithProviders(<InstancesEmptyState />);

    const docsLink = screen.getByRole("link", {
      name: "How to manage instances in Landscape",
    });

    expect(docsLink).toHaveAttribute(
      "href",
      MANAGE_INSTANCES_DOCUMENTATION_URL,
    );
    expect(docsLink).toHaveAttribute("target", "_blank");
    expect(docsLink).toHaveAttribute("rel", "nofollow noopener noreferrer");
  });

  it("shows pending instances above the empty state and allows dismissing the banner", async () => {
    const user = userEvent.setup();
    renderWithProviders(<InstancesEmptyState />);

    const notification = await screen.findByRole("heading", {
      name: "Pending instances",
    });
    const emptyState = screen.getByText("No instances found");
    expect(
      notification.compareDocumentPosition(emptyState) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Review Pending Instances" }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Close notification" }),
    );

    expect(
      screen.queryByRole("heading", { name: "Pending instances" }),
    ).not.toBeInTheDocument();
    expect(emptyState).toBeInTheDocument();
  });
});
