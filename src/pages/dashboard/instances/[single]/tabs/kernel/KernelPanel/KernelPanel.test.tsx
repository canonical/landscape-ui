import { screen } from "@testing-library/react";
import { describe, expect, it, afterEach } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import KernelPanel from "./KernelPanel";

afterEach(() => {
  setEndpointStatus("default");
});

describe("KernelPanel", () => {
  it("shows loading state then kernel info", async () => {
    renderWithProviders(
      <KernelPanel instanceTitle="Test Instance" />,
      undefined,
      "/instances/1",
      "/instances/:instanceId",
    );

    await expectLoadingState();

    expect(
      await screen.findByRole("heading", { name: /kernel overview/i }),
    ).toBeInTheDocument();
  });

  it("shows empty state when kernel info is unavailable", async () => {
    setEndpointStatus("empty");

    renderWithProviders(
      <KernelPanel instanceTitle="Test Instance" />,
      undefined,
      "/instances/1",
      "/instances/:instanceId",
    );

    await expectLoadingState();

    expect(
      await screen.findByText(/kernel information is not available/i),
    ).toBeInTheDocument();
  });
});
