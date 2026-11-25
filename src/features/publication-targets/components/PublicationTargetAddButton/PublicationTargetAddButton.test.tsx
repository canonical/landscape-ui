import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PublicationTargetAddButton from "./PublicationTargetAddButton";

describe("PublicationTargetAddButton", () => {
  const user = userEvent.setup();

  it("renders the Add publication target button", () => {
    renderWithProviders(<PublicationTargetAddButton />);

    const button = screen.getByRole("button", {
      name: /add publication target/i,
    });
    expect(button).toHaveClass("ds", "button", "primary", "constructive");
    expect(button).toHaveIcon("plus");
  });

  it("sets sidePath=add in the URL when clicked", async () => {
    renderWithProviders(
      <>
        <PublicationTargetAddButton />
        <LocationDisplay />
      </>,
    );

    await user.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );

    expect(getLocationDisplay().textContent).toContain("sidePath=add");
  });
});
