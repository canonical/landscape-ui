import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import Flow from "./Flow";

describe("Flow", () => {
  it("should render", () => {
    const description = "Description";
    const header = "Header";

    renderWithProviders(
      <Flow
        cards={[
          {
            description,
            header,
            iconName: "",
          },
        ]}
      />,
    );

    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.getByText(header)).toBeInTheDocument();
  });
});
