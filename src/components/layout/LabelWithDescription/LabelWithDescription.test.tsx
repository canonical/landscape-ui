import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
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

  it("renders without a link when link is not provided", () => {
    renderWithProviders(
      <LabelWithDescription description="desc" label="label" />,
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("stops click propagation on the learn more link", async () => {
    const parentClickHandler = vi.fn();

    renderWithProviders(
      <div onClick={parentClickHandler} role="none">
        <LabelWithDescription
          description="Description"
          label="Label"
          link="https://example.com"
        />
      </div>,
    );

    await userEvent.click(screen.getByRole("link", { name: "learn more" }));

    expect(parentClickHandler).not.toHaveBeenCalled();
  });
});
