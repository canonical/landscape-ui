import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { autoinstallFiles } from "@/tests/mocks/autoinstallFiles";
import { renderWithProviders } from "@/tests/render";
import AutoinstallFileEditForm from "./AutoinstallFileEditForm";
import { expectLoadingState } from "@/tests/helpers";

describe("AutoinstallFileEditForm", () => {
  it("shows loading state while fetching", async () => {
    renderWithProviders(
      <AutoinstallFileEditForm autoinstallFile={autoinstallFiles[0]} />,
    );

    await expectLoadingState();
  });

  it("shows form after loading", async () => {
    renderWithProviders(
      <AutoinstallFileEditForm autoinstallFile={autoinstallFiles[0]} />,
    );

    expect(
      await screen.findByRole("button", { name: /save changes/i }),
    ).toBeInTheDocument();
  });
});
