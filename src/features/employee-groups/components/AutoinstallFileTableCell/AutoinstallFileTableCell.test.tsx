import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AutoinstallFileTableCell from "./AutoinstallFileTableCell";
import { NO_DATA_TEXT } from "@/components/layout/NoData";

describe("AutoinstallFileTableCell", () => {
  it("renders NoData when fileName is missing", () => {
    renderWithProviders(
      <AutoinstallFileTableCell
        fileName={undefined}
        isDefault={false}
        version={1}
      />,
    );

    expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();
  });

  it("renders NoData when version is missing", () => {
    renderWithProviders(
      <AutoinstallFileTableCell
        fileName="install.sh"
        isDefault={false}
        version={undefined}
      />,
    );

    expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();
  });

  it("renders fileName and version when provided", () => {
    renderWithProviders(
      <AutoinstallFileTableCell
        fileName="install.sh"
        isDefault={false}
        version={2}
      />,
    );

    expect(screen.getByText("install.sh, v2")).toBeInTheDocument();
  });

  it("renders the default chip when isDefault is true", () => {
    renderWithProviders(
      <AutoinstallFileTableCell
        fileName="install.sh"
        isDefault={true}
        version={3}
      />,
    );

    expect(screen.getByText("install.sh, v3")).toBeInTheDocument();
    expect(screen.getByText("default")).toBeInTheDocument();
  });

  it("does not render the default chip when isDefault is false", () => {
    renderWithProviders(
      <AutoinstallFileTableCell
        fileName="install.sh"
        isDefault={false}
        version={3}
      />,
    );

    expect(screen.getByText("install.sh, v3")).toBeInTheDocument();
    expect(screen.queryByText("default")).not.toBeInTheDocument();
  });
});
