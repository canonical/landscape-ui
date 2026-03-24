import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PageContent from "./PageContent";

describe("PageContent", () => {
  it("renders children", () => {
    renderWithProviders(<PageContent>Page body</PageContent>);
    expect(screen.getByText("Page body")).toBeInTheDocument();
  });

  it("has p-panel__content class", () => {
    const { container } = renderWithProviders(
      <PageContent>content</PageContent>,
    );
    expect(container.querySelector(".p-panel__content")).toBeInTheDocument();
  });
});
