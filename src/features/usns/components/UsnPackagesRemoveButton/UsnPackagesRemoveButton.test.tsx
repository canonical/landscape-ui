import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "@/tests/render";
import UsnPackagesRemoveButton from "./UsnPackagesRemoveButton";

describe("UsnPackagesRemoveButton", () => {
  it("renders 'Uninstall packages' button", () => {
    renderWithProviders(
      <UsnPackagesRemoveButton
        instanceTitle="Application Server 1"
        usn="USN-6557-1"
      />,
      {},
      "/instances/1/child/2",
      "/instances/:instanceId/child/:childInstanceId",
    );

    expect(
      screen.getByRole("button", { name: /uninstall packages/i }),
    ).toBeInTheDocument();
  });
});
