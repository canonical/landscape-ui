import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import PackageProfileDetailsConstraintsInfo from "./PackageProfileDetailsConstraintsInfo";

const props: ComponentProps<typeof PackageProfileDetailsConstraintsInfo> = {
  profileConstraints: packageProfiles[0].constraints,
  search: "",
  isConstraintsLoading: false,
};

describe("PackageProfileDetailsConstraintsInfo", () => {
  it("should render profile constraint list", async () => {
    const { container } = render(
      <PackageProfileDetailsConstraintsInfo {...props} />,
    );

    expect(container).toHaveTexts(["Constraint", "Package", "Version"]);

    expect(screen.getAllByRole("row")).toHaveLength(
      packageProfiles[0].constraints.length + 1,
    );

    packageProfiles[0].constraints.forEach((constraint) => {
      expect(
        screen.getByRole("rowheader", { name: constraint.package }),
      ).toBeInTheDocument();
    });
  });

  it("should render loading state", () => {
    render(
      <PackageProfileDetailsConstraintsInfo {...props} isConstraintsLoading />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Loading...");
  });

  it("should render not found message", () => {
    const searchText = "not-existing-package";

    render(
      <PackageProfileDetailsConstraintsInfo
        {...props}
        profileConstraints={[]}
        search={searchText}
      />,
    );

    expect(
      screen.getByText(`No constraints found with the search: "${searchText}"`),
    ).toBeInTheDocument();
  });
});
