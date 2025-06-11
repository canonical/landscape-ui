import { autoinstallFiles } from "@/tests/mocks/autoinstallFiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect } from "vitest";
import AutoinstallFileDetails from "./AutoinstallFileDetails";

describe("AutoinstallFileDetails", () => {
  const [file] = autoinstallFiles;

  const props: ComponentProps<typeof AutoinstallFileDetails> = {
    autoinstallFile: file,
  };

  it("should not render buttons for default file", async () => {
    renderWithProviders(<AutoinstallFileDetails {...props} />);

    expect(
      screen.queryByRole("button", { name: "Set as default" }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Remove" }),
    ).not.toBeInTheDocument();
  });

  it("should render buttons for other files", async () => {
    renderWithProviders(
      <AutoinstallFileDetails
        {...props}
        autoinstallFile={{ ...file, is_default: false }}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Set as default" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });
});
