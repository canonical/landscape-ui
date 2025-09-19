import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import PackageProfileList from "./PackageProfileList";

const props: ComponentProps<typeof PackageProfileList> = {
  packageProfiles,
};

describe("PackageProfileList", () => {
  it("should render profile list", () => {
    const { container } = renderWithProviders(
      <PackageProfileList {...props} />,
    );

    expect(container).toHaveTexts([
      "Name",
      "Description",
      "Access group",
      "Tags",
      "Not compliant",
      "Pending",
      "Associated",
      "Actions",
    ]);

    expect(screen.getAllByRole("row")).toHaveLength(packageProfiles.length + 1);

    packageProfiles.forEach((profile) => {
      expect(
        screen.getByRole("rowheader", {
          name: `${profile.title} profile title and name`,
        }),
      ).toBeInTheDocument();
    });
  });

  it("should filter profiles by search", () => {
    const searchText = packageProfiles[0].title;

    renderWithProviders(
      <PackageProfileList {...props} />,
      undefined,
      `/profiles/package?search=${searchText}`,
    );

    expect(
      screen.getByRole("rowheader", {
        name: `${packageProfiles[0].title} profile title and name`,
      }),
    ).toBeInTheDocument();

    packageProfiles
      .filter(({ title }) => !title.includes(searchText))
      .forEach((profile) => {
        expect(
          screen.queryByRole("rowheader", {
            name: `${profile.title} profile title and name`,
          }),
        ).not.toBeInTheDocument();
      });
  });
});
