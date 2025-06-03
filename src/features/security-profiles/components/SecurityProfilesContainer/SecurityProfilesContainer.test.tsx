import { expectLoadingState } from "@/tests/helpers";
import { securityProfiles } from "@/tests/mocks/securityProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import SecurityProfilesContainer from "./SecurityProfilesContainer";

describe("SecurityProfilesContainer", () => {
  it("should filter security profiles that match the search text", async () => {
    const searchText = securityProfiles[0].name.charAt(0);

    renderWithProviders(
      <SecurityProfilesContainer hideRetentionNotification={() => undefined} />,
      undefined,
      `/profiles/security?search=${searchText}&status=all`,
    );

    await expectLoadingState();

    securityProfiles
      .filter(({ title }) => title.startsWith(searchText))
      .forEach((profile) => {
        expect(
          screen.getByRole("button", { name: profile.title }),
        ).toBeInTheDocument();
      });

    securityProfiles
      .filter(({ title }) => !title.startsWith(searchText))
      .forEach((profile) => {
        expect(
          screen.queryByRole("button", { name: profile.title }),
        ).not.toBeInTheDocument();
      });
  });
});
