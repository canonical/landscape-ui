import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { useLocation } from "react-router-dom";
import RepositoryProfileAddButton from "./RepositoryProfileAddButton";


const LocationDisplay = () => {
  const { search } = useLocation();
  return <div data-testid="location">{search}</div>;
};


describe("RepositoryProfileAddButton", () => {
  const user = userEvent.setup();

  it("renders button with correct label", () => {
    renderWithProviders(<RepositoryProfileAddButton />);

    expect(
      screen.getByRole("button", { name: /Add repository profile/i }),
    ).toBeInTheDocument();
  });

  it("opens add repository profile form in side panel on click", async () => {
    renderWithProviders(
      <>
        <RepositoryProfileAddButton />
        <LocationDisplay />
      </>);

    await user.click(
      screen.getByRole("button", { name: /Add repository profile/i }),
    );
    
    expect(screen.getByTestId("location").textContent).toContain(
      "sidePath=add",
    );
  });
});
