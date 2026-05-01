import { expectLoadingState } from "@/tests/helpers";
import { usgProfiles } from "@/tests/mocks/usgProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import USGProfilesContainer from "./USGProfilesContainer";

describe("USGProfilesContainer", () => {
  it("should filter usg profiles that match the search text", async () => {
    const searchText = usgProfiles[0].name.charAt(0);

    renderWithProviders(
      <USGProfilesContainer hideRetentionNotification={() => undefined} />,
      undefined,
      `/profiles/usg?search=${searchText}&status=all`,
    );

    await expectLoadingState();

    for (const profile of usgProfiles.filter(({ title }) =>
      title.startsWith(searchText),
    )) {
      expect(
        screen.getByRole("button", { name: profile.title }),
      ).toBeInTheDocument();
    }

    for (const profile of usgProfiles.filter(
      ({ title }) => !title.startsWith(searchText),
    )) {
      expect(
        screen.queryByRole("button", { name: profile.title }),
      ).not.toBeInTheDocument();
    }
  });
});
