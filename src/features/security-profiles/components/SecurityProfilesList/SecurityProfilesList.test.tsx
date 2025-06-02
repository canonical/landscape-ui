import type { ComponentProps } from "react";
import { screen, waitFor } from "@testing-library/react";
import { securityProfiles } from "@/tests/mocks/securityProfiles";
import { renderWithProviders } from "@/tests/render";
import SecurityProfilesList from "./SecurityProfilesList";

const props: ComponentProps<typeof SecurityProfilesList> = {
  securityProfiles: securityProfiles,
};

describe("SecurityProfileList", () => {
  it("should render security profiles list", async () => {
    renderWithProviders(<SecurityProfilesList {...props} />);

    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("status")).toBeInTheDocument();
    expect(screen.getByText("last audit's pass rate")).toBeInTheDocument();
    expect(screen.getByText("associated instancestags")).toBeInTheDocument();
    expect(screen.getByText("profile mode")).toBeInTheDocument();
    expect(screen.getByText("last runschedule")).toBeInTheDocument();
    expect(screen.getByText("actions")).toBeInTheDocument();

    await waitFor(() => {
      securityProfiles.forEach(async (profile) => {
        expect(screen.getByText(profile.title)).toBeInTheDocument();
        expect(
          screen.getByLabelText(`${profile.name} profile actions`),
        ).toBeInTheDocument();
      });
    });
  });

  it("should filter security profiles by search", () => {
    const searchText = securityProfiles[0].name;

    renderWithProviders(
      <SecurityProfilesList {...props} />,
      undefined,
      `/profiles/security?search=${searchText}`,
    );

    expect(
      screen.getByRole("button", { name: searchText }),
    ).toBeInTheDocument();

    const matchingButtons = screen.getAllByRole("button", { name: searchText });
    matchingButtons.forEach((button) => {
      expect(button).toHaveTextContent(searchText);
    });
  });

  it("should filter profiles by search", () => {
    const searchText = securityProfiles[0].title;

    renderWithProviders(
      <SecurityProfilesList {...props} />,
      undefined,
      `/profiles/security?search=${searchText}`,
    );

    securityProfiles
      .filter(({ title }) => title.includes(searchText))
      .forEach((profile) => {
        expect(
          screen.getByRole("button", { name: profile.title }),
        ).toBeInTheDocument();
      });
  });
});
