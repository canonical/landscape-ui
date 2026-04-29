import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router";
import { describe, expect, it } from "vitest";
import RepositoryProfileAddButton from "./RepositoryProfileAddButton";

const LocationDisplay = () => {
  const { search } = useLocation();
  return <div data-testid="location">{search}</div>;
};

describe("RepositoryProfileAddButton", () => {
  it("sets sidePath=add in the URL when clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <RepositoryProfileAddButton />
        <LocationDisplay />
      </>,
    );

    await user.click(
      screen.getByRole("button", { name: /Add repository profile/i }),
    );

    expect(screen.getByTestId("location").textContent).toContain(
      "sidePath=add",
    );
  });
});
