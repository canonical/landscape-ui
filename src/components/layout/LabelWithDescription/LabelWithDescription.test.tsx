import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import LabelWithDescription from "./LabelWithDescription";

describe("LabelWithDescription", () => {
  it("should render", () => {
    const description = "Description";
    const label = "Label";

    renderWithProviders(
      <LabelWithDescription
        description={description}
        label={label}
        link="link"
      />,
    );

    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
