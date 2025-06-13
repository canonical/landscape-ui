import { securityProfiles } from "@/tests/mocks/securityProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import SecurityProfilesList from "./SecurityProfilesList";

const props: ComponentProps<typeof SecurityProfilesList> = {
  securityProfiles: securityProfiles,
};

describe("SecurityProfilesList", () => {
  it("should render security profiles list", () => {
    renderWithProviders(<SecurityProfilesList {...props} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Last audit's pass rate")).toBeInTheDocument();
    expect(screen.getByText("Associated instances")).toBeInTheDocument();
    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getByText("Profile mode")).toBeInTheDocument();
    expect(screen.getByText("Last run")).toBeInTheDocument();
    expect(screen.getByText("Schedule")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();

    for (const profile of securityProfiles) {
      expect(screen.getByText(profile.title)).toBeInTheDocument();
      expect(
        screen.getByLabelText(`${profile.name} profile actions`),
      ).toBeInTheDocument();
    }
  });
});
