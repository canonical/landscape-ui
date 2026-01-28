import { renderWithProviders } from "@/tests/render";
import RolesContainer from "./RolesContainer";
import { screen } from "@testing-library/react";
import { expectLoadingState } from "@/tests/helpers";
import { setEndpointStatus } from "@/tests/controllers/controller";

describe("RolesContainer", () => {
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
});
