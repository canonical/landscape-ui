import { upgradeProfiles } from "@/tests/mocks/upgrade-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import type { ComponentProps } from "react";
import UpgradeProfileList from "./UpgradeProfileList";

const props: ComponentProps<typeof UpgradeProfileList> = {
  profiles: upgradeProfiles,
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

    expect(screen.getAllByRole("row")).toHaveLength(upgradeProfiles.length + 1);

    await waitFor(() => {
      upgradeProfiles.forEach(async (profile) => {
        expect(screen.getByText(profile.title)).toBeInTheDocument();
        expect(
          screen.getByLabelText(`${profile.name} profile actions`),
        ).toBeInTheDocument();
      });
    });
  });

  it("should filter profiles by search", () => {
    const searchText = upgradeProfiles[0].title;

    renderWithProviders(
      <UpgradeProfileList {...props} />,
      undefined,
      `/profiles/upgrade?search=${searchText}`,
    );

    expect(screen.getByText(searchText)).toBeInTheDocument();

    upgradeProfiles
      .filter(({ title }) => !title.includes(searchText))
      .forEach((profile) => {
        expect(screen.queryByText(profile.title)).not.toBeInTheDocument();
      });
  });
});
