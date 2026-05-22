import LocationDisplay from "@/tests/LocationDisplay";
import { renderWithProviders } from "@/tests/render";
import RolesContainer from "./RolesContainer";
import { screen } from "@testing-library/react";
import { expectLoadingState } from "@/tests/helpers";
import { setEndpointStatus } from "@/tests/controllers/controller";
import userEvent from "@testing-library/user-event";

describe("RolesContainer", () => {
  const user = userEvent.setup();

  it("renders correctly", async () => {
    renderWithProviders(<RolesContainer />);

    await expectLoadingState();

    expect(screen.getByRole("table")).toBeInTheDocument();

    const columnHeaders = [
      /name/i,
      /administrators/i,
      /view/i,
      /manage/i,
      /actions/i,
    ];

    columnHeaders.forEach((header) => {
      expect(
        screen.getByRole("columnheader", { name: header }),
      ).toBeInTheDocument();
    });
  });

  it("renders empty state for roles", async () => {
    setEndpointStatus("empty");

    renderWithProviders(<RolesContainer />);

    await expectLoadingState();

    expect(screen.getByText(/no roles found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/how to manage administrators in landscape/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add role/i }),
    ).toBeInTheDocument();
  });

  it("opens the add role side panel when 'Add role' is clicked in empty state", async () => {
    setEndpointStatus("empty");

    renderWithProviders(
      <>
        <RolesContainer />
        <LocationDisplay />
      </>,
    );

    await expectLoadingState();

    await user.click(screen.getByRole("button", { name: /add role/i }));

    expect(screen.getByTestId("location").textContent).toContain(
      "sidePath=add",
    );
  });
});
