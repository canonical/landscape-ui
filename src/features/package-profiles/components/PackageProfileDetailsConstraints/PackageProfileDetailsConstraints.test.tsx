import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectLoadingState } from "@/tests/helpers";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import PackageProfileDetailsConstraints from "./PackageProfileDetailsConstraints";

describe("PackageProfileDetailsConstraints", () => {
  beforeEach(() => {
    renderWithProviders(
      <PackageProfileDetailsConstraints profile={packageProfiles[0]} />,
    );
  });

  it("should render profile constraint list with the search and CTA", async () => {
    await expectLoadingState();

    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    expect(screen.getByText("Change package constraints")).toBeInTheDocument();

    packageProfiles[0].constraints.forEach((constraint) => {
      expect(
        screen.getByRole("rowheader", { name: constraint.package }),
      ).toBeInTheDocument();
    });
  });

  it("should filter profile constraints by search", async () => {
    const searchText = packageProfiles[0].constraints[0].package;

    const searchInput = await screen.findByPlaceholderText("Search");

    await userEvent.type(searchInput, `${searchText}{enter}`);

    expect(
      screen.getByRole("rowheader", { name: searchText }),
    ).toBeInTheDocument();

    packageProfiles[0].constraints
      .filter((constraint) => !constraint.package.includes(searchText))
      .forEach((constraint) => {
        expect(
          screen.queryByRole("rowheader", { name: constraint.package }),
        ).not.toBeInTheDocument();
      });
  });

  it("should open profile constraints form", async () => {
    const button = await screen.findByText("Change package constraints");

    await userEvent.click(button);

    expect(
      screen.queryByRole("heading", {
        name: `Change "${packageProfiles[0].title}" profile's constraints`,
      }),
    ).toBeInTheDocument();
  });
});
