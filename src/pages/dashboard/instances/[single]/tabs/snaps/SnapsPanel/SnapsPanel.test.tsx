import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import SnapsPanel from "./SnapsPanel";
import { expectLoadingState } from "@/tests/helpers";

describe("SnapsPanel", () => {
  it("shows loading state initially", async () => {
    renderWithProviders(
      <SnapsPanel />,
      undefined,
      "/instances/1",
      "/instances/:instanceId",
    );

    await expectLoadingState();
  });

  it("shows snaps list after loading", async () => {
    renderWithProviders(
      <SnapsPanel />,
      undefined,
      "/instances/1",
      "/instances/:instanceId",
    );

    expect(
      await screen.findByRole("columnheader", { name: /name/i }),
    ).toBeInTheDocument();
  });
});
