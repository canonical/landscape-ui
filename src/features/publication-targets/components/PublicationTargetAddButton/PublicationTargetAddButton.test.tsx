import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router";
import { describe, expect, it } from "vitest";
import PublicationTargetAddButton from "./PublicationTargetAddButton";

const LocationDisplay = () => {
  const { search } = useLocation();
  return <div data-testid="location">{search}</div>;
};

describe("PublicationTargetAddButton", () => {
  const user = userEvent.setup();

  it("renders the Add publication target button", () => {
    renderWithProviders(<PublicationTargetAddButton />);

    expect(
      screen.getByRole("button", { name: /add publication target/i }),
    ).toBeInTheDocument();
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

    expect(screen.getByTestId("location").textContent).toContain(
      "sidePath=add",
    );
  });
});
