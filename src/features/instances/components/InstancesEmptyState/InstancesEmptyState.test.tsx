import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InstancesEmptyState from "./InstancesEmptyState";

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
      "https://documentation.ubuntu.com/landscape/how-to-guides/web-portal/classic-web-portal/manage-computers/",
    );
    expect(docsLink).toHaveAttribute("target", "_blank");
    expect(docsLink).toHaveAttribute("rel", "nofollow noopener noreferrer");
  });
});
