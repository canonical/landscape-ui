import { ComponentProps } from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { upgradeProfiles } from "@/tests/mocks/upgrade-profiles";
import { renderWithProviders } from "@/tests/render";
import UpgradeProfileList from "./UpgradeProfileList";

const props: ComponentProps<typeof UpgradeProfileList> = {
  profiles: upgradeProfiles,
  search: "",
};

describe("UpgradeProfileList", () => {
  it("should render profile list", async () => {
    const { container } = renderWithProviders(
      <UpgradeProfileList {...props} />,
    );

    expect(container).toHaveTexts([
      "Name",
      "Access group",
      "Tags",
      "Associated",
      "Actions",
    ]);

    await waitFor(() => {
      upgradeProfiles.forEach(async (profile) => {
        expect(screen.getByText(profile.title)).toBeInTheDocument();
        expect(
          screen.getByLabelText(`${profile.name} profile actions`),
        ).toBeInTheDocument();

        const actionsButton = screen.getByLabelText(
          `${profile.name} profile actions`,
        );

        await userEvent.click(actionsButton);

        expect(
          screen.getByLabelText(`Edit ${profile.name} profile`),
        ).toBeInTheDocument();
        expect(
          screen.getByLabelText(`Delete ${profile.name} profile`),
        ).toBeInTheDocument();
      });
    });
  });

  it("should filter profiles by search", () => {
    const searchText = upgradeProfiles[0].name;

    renderWithProviders(<UpgradeProfileList {...props} search={searchText} />);

    expect(screen.getByText(searchText)).toBeInTheDocument();

    upgradeProfiles
      .filter(({ name }) => !name.includes(searchText))
      .forEach((profile) => {
        expect(screen.queryByText(profile.title)).not.toBeInTheDocument();
      });
  });
});
