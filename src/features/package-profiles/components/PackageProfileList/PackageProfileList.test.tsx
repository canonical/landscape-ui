import { ComponentProps } from "react";
import { screen } from "@testing-library/react";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import PackageProfileList from "./PackageProfileList";

const props: ComponentProps<typeof PackageProfileList> = {
  packageProfiles,
  searchText: "",
};

describe("PackageProfileList", () => {
  it("should render profile list", async () => {
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
        screen.getByRole("rowheader", { name: profile.title }),
      ).toBeInTheDocument();
    });
  });

  it("should filter profiles by search", () => {
    const searchText = packageProfiles[0].title;

    renderWithProviders(
      <PackageProfileList {...props} searchText={searchText} />,
    );

    expect(
      screen.getByRole("rowheader", { name: searchText }),
    ).toBeInTheDocument();

    packageProfiles
      .filter(({ title }) => !title.includes(searchText))
      .forEach((profile) => {
        expect(
          screen.queryByRole("rowheader", { name: profile.title }),
        ).not.toBeInTheDocument();
      });
  });
});
