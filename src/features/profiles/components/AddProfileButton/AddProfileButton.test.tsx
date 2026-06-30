import { renderWithProviders } from "@/tests/render";
import { withProfilesContext } from "@/tests/mocks/profilesContext";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router";
import { describe, expect, it } from "vitest";
import AddProfileButton from "./AddProfileButton";

const LocationDisplay = () => {
  const { search } = useLocation();

  return <div data-testid="location-display">{search}</div>;
};

describe("AddProfileButton", () => {
  it("displays specific appearance for scripts header", () => {
    renderWithProviders(
      <AddProfileButton isInsideScriptHeader />,
      undefined,
      undefined,
      undefined,
      withProfilesContext(),
    );

    expect(
      screen.getByRole("button", { name: /add profile/i }),
    ).not.toHaveClass("p-button--positive");
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

    expect(screen.getByTestId("location-display")).toHaveTextContent(
      "sidePath=add",
    );
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

    expect(button).toHaveClass("p-button--positive");
    expect(button).toHaveAttribute("aria-disabled", "true");
  });
});
