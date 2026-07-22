import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InstancesEmptyState from "./InstancesEmptyState";
import { MANAGE_INSTANCES_DOCUMENTATION_URL } from "./constants";

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
});
