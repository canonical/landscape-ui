import { autoinstallFiles } from "@/tests/mocks/autoinstallFiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe } from "vitest";
import AutoinstallFileSidePanelTitle from "./AutoinstallFileSidePanelTitle";

describe("AutoinstallFileSidePanelTitle", () => {
  it("should render with a title prefix and default chip", async () => {
    const [file] = autoinstallFiles;
    const title = "Add";

    renderWithProviders(
      <AutoinstallFileSidePanelTitle file={file} title={title} />,
    );

    expect(
      screen.getByText(`${title} ${file.filename}, v${file.version}`),
    ).toBeInTheDocument();

    expect(screen.getByText("Default")).toBeInTheDocument();
  });

  it("should render with a specified version", async () => {
    const [file] = autoinstallFiles;

    renderWithProviders(
      <AutoinstallFileSidePanelTitle file={file} version={5} />,
    );

    expect(screen.getByText(`${file.filename}, v5`)).toBeInTheDocument();
  });
});
