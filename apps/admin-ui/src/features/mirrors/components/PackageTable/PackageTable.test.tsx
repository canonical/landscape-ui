import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe } from "vitest";
import PackageTable from "./PackageTable";

describe("PackageTable", () => {
  const props: ComponentProps<typeof PackageTable> = {
    isUpload: true,
    packagesToShow: [
      {
        difference: "delete",
        packageName: "name",
        packageVersion: "version",
      },
    ],
    search: "search",
    selectedPackages: [0],
    setSelectedPackages: () => undefined,
  };

  it("should toggle all packages", async () => {
    render(<PackageTable {...props} />);

    await userEvent.click(screen.getByRole("checkbox", { name: "Toggle all" }));
    await userEvent.click(screen.getByRole("checkbox", { name: "Toggle all" }));
  });

  it("should toggle one package", async () => {
    render(<PackageTable {...props} />);

    await userEvent.click(screen.getByRole("checkbox", { name: "name" }));
    await userEvent.click(screen.getByRole("checkbox", { name: "name" }));
  });

  it("should render without upload controls", () => {
    render(<PackageTable {...props} isUpload={false} />);
  });
});
