import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { renderWithProviders } from "@/tests/render";
import { withProfilesContext } from "@/tests/mocks/profilesContext";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AddProfileButton from "./AddProfileButton";

describe("AddProfileButton", () => {
  it("displays specific appearance for scripts header", () => {
    renderWithProviders(
      <AddProfileButton isInsideScriptHeader />,
      undefined,
      undefined,
      undefined,
      withProfilesContext(),
    );

    const button = screen.getByRole("button", { name: /add profile/i });

    expect(button).toHaveClass("secondary");
    expect(button).not.toHaveClass("constructive");
    expect(button).toHaveIcon("plus");
  });

  it("opens add side panel", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <AddProfileButton />
        <LocationDisplay />
      </>,
      undefined,
      undefined,
      undefined,
      withProfilesContext(),
    );

    await user.click(screen.getByRole("button", { name: /add profile/i }));

    expect(getLocationDisplay()).toHaveTextContent("sidePath=add");
  });

  it("disables button when profile limit is reached", () => {
    renderWithProviders(
      <AddProfileButton />,
      undefined,
      undefined,
      undefined,
      withProfilesContext({
        isProfileLimitReached: true,
      }),
    );

    const button = screen.getByRole("button", { name: /add profile/i });

    expect(button).toHaveClass("primary", "constructive");
    expect(button).toHaveIcon("plus");
    expect(button).toBeDisabled();
  });
});
