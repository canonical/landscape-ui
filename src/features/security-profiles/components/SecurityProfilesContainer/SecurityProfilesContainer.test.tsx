import { expectLoadingState } from "@/tests/helpers";
import { securityProfiles } from "@/tests/mocks/securityProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import SecurityProfilesContainer from "./SecurityProfilesContainer";

describe("SecurityProfilesContainer", () => {
  it("should filter security profiles that match the search text", async () => {
    const searchText = securityProfiles[0].title.charAt(0);

    renderWithProviders(
      <SecurityProfilesContainer hideRetentionNotification={() => undefined} />,
      undefined,
      `/profiles/security?search=${searchText}&status=all`,
    );

    await expectLoadingState();

    for (const profile of securityProfiles) {
      const button = screen.queryByRole("button", { name: profile.title });

      if (profile.title.startsWith(searchText)) {
        expect(button).toBeInTheDocument();
      } else {
        expect(button).not.toBeInTheDocument();
      }
    }
  });
});
