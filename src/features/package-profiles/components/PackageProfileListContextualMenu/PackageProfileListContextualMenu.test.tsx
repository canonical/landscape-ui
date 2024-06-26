import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import PackageProfileListContextualMenu from "./PackageProfileListContextualMenu";

describe("PackageProfileListContextualMenu", () => {
  beforeEach(() => {
    renderWithProviders(
      <PackageProfileListContextualMenu profile={packageProfiles[0]} />,
    );
  });

  it("should render package profile contextual menu", async () => {
    expect(
      screen.getByLabelText(`${packageProfiles[0].title} profile actions`),
    ).toBeInTheDocument();
    const buttonLabels = [
      "Edit",
      "Change package constraints",
      "Duplicate",
      "Remove",
    ];

    const button = screen.getByLabelText(
      `${packageProfiles[0].title} profile actions`,
    );

    await userEvent.click(button);

    expect(
      screen.queryAllByLabelText(new RegExp(packageProfiles[0].title)),
    ).toHaveLength(5);

    await waitFor(() =>
      buttonLabels.forEach((label) => {
        expect(screen.queryByText(label)).toBeInTheDocument();
      }),
    );
  });
});
