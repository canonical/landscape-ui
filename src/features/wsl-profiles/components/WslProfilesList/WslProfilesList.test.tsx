import { expectLoadingState } from "@/tests/helpers";
import { wslProfiles } from "@/tests/mocks/wsl-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import type { ComponentProps } from "react";
import WslProfilesList from "./WslProfilesList";

const props: ComponentProps<typeof WslProfilesList> = {
  wslProfiles: wslProfiles,
};

describe("WslProfilesList", () => {
  it("should render profile list", async () => {
    const { container } = renderWithProviders(<WslProfilesList {...props} />);

    await expectLoadingState();

    expect(container).toHaveTexts([
      "Name",
      "Description",
      "Access group",
      "Tags",
      "Associated parents",
      "Not compliant",
      "Compliant",
      "Actions",
    ]);

    expect(screen.getAllByRole("row")).toHaveLength(wslProfiles.length + 1);

    await waitFor(() => {
      wslProfiles.forEach(async (profile) => {
        expect(
          screen.getByRole("button", { name: profile.title }),
        ).toBeInTheDocument();

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

    wslProfiles
      .filter(({ title }) => !title.includes(searchText))
      .forEach((profile) => {
        expect(screen.queryByText(profile.title)).not.toBeInTheDocument();
      });
  });
});
