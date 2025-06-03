import type { ComponentProps } from "react";
import { screen } from "@testing-library/react";
import { securityProfiles } from "@/tests/mocks/securityProfiles";
import { renderWithProviders } from "@/tests/render";
import SecurityProfilesList from "./SecurityProfilesList";

const props: ComponentProps<typeof SecurityProfilesList> = {
  securityProfiles: securityProfiles,
};

describe("SecurityProfileList", () => {
  it("should render security profiles list", async () => {
    renderWithProviders(<SecurityProfilesList {...props} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Last audit's pass rate")).toBeInTheDocument();
    expect(screen.getByText("Associated instancesTags")).toBeInTheDocument();
    expect(screen.getByText("Profile mode")).toBeInTheDocument();
    expect(screen.getByText("Last runSchedule")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();

    securityProfiles.forEach(async (profile) => {
      expect(screen.getByText(profile.title)).toBeInTheDocument();
      expect(
        screen.getByLabelText(`${profile.name} profile actions`),
      ).toBeInTheDocument();
    });
  });

  it("should filter security profiles that match the search text", () => {
    const searchText = securityProfiles[0].name;

    renderWithProviders(
      <SecurityProfilesList {...props} />,
      undefined,
      `/profiles/security?search=${searchText}`,
    );

    expect(
      screen.getByRole("button", { name: searchText }),
    ).toBeInTheDocument();
  });

  it("should filter security profiles that do not match the search text", () => {
    const searchText = securityProfiles[0].name;

    securityProfiles
      .filter(({ title }) => !title.includes(searchText))
      .forEach((profile) => {
        expect(
          screen.queryByRole("button", { name: profile.title }),
        ).not.toBeInTheDocument();
      });
  });
});
