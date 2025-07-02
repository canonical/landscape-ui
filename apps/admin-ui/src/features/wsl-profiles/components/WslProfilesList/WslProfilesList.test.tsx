import type { ComponentProps } from "react";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import WslProfilesList from "./WslProfilesList";
import { wslProfiles } from "@/tests/mocks/wsl-profiles";

const props: ComponentProps<typeof WslProfilesList> = {
  wslProfiles: wslProfiles,
};

describe("WslProfilesList", () => {
  it("should render profile list", async () => {
    const { container } = renderWithProviders(<WslProfilesList {...props} />);

    expect(container).toHaveTexts([
      "Name",
      "Description",
      "Access group",
      "Tags",
      "Associated",
      "Pending",
      "Actions",
    ]);

    expect(screen.getAllByRole("row")).toHaveLength(wslProfiles.length + 1);

    await waitFor(() => {
      wslProfiles.forEach(async (profile) => {
        expect(screen.getByText(profile.title)).toBeInTheDocument();
        expect(
          screen.getByLabelText(`${profile.title} profile actions`),
        ).toBeInTheDocument();
      });
    });
  });

  it("should filter profiles by search", () => {
    const searchText = wslProfiles[0].title;

    renderWithProviders(
      <WslProfilesList {...props} />,
      undefined,
      `/profiles/wsl?search=${searchText}`,
    );

    expect(screen.getByText(searchText)).toBeInTheDocument();

    wslProfiles
      .filter(({ title }) => !title.includes(searchText))
      .forEach((profile) => {
        expect(screen.queryByText(profile.title)).not.toBeInTheDocument();
      });
  });
});
