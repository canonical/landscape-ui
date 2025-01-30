import type { ComponentProps } from "react";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import WslProfileList from "./WslProfilesList";
import { wslProfiles } from "@/tests/mocks/wsl-profiles";

const props: ComponentProps<typeof WslProfileList> = {
  wslProfiles: wslProfiles,
};

describe("WslProfileList", () => {
  it("should render profile list", async () => {
    const { container } = renderWithProviders(<WslProfileList {...props} />);

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
          screen.getByLabelText(`${profile.name} profile actions`),
        ).toBeInTheDocument();
      });
    });
  });

  it("should filter profiles by search", () => {
    const searchText = wslProfiles[0].title;

    renderWithProviders(
      <WslProfileList {...props} />,
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
