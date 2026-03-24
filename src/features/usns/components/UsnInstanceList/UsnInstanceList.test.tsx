import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import UsnInstanceList from "./UsnInstanceList";
import { ubuntuInstance } from "@/tests/mocks/instance";
import { usnPackageComputerId, usnPackages } from "@/tests/mocks/usn";
import type { Instance } from "@/types/Instance";

const affectedInstance: Instance = {
  ...ubuntuInstance,
  id: usnPackageComputerId,
  title: "Affected Server",
};

describe("UsnInstanceList", () => {
  it("renders the table with affected instances", () => {
    renderWithProviders(
      <UsnInstanceList
        instances={[affectedInstance]}
        usnPackages={usnPackages}
        usn="USN-6557-1"
        limit={5}
        onLimitChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Affected Server")).toBeInTheDocument();
  });

  it("renders heading with USN identifier", () => {
    renderWithProviders(
      <UsnInstanceList
        instances={[affectedInstance]}
        usnPackages={usnPackages}
        usn="USN-6557-1"
        limit={5}
        onLimitChange={vi.fn()}
      />,
    );

    expect(screen.getByText(/USN-6557-1/)).toBeInTheDocument();
  });

  it("shows affected packages count for instance", () => {
    renderWithProviders(
      <UsnInstanceList
        instances={[affectedInstance]}
        usnPackages={usnPackages}
        usn="USN-6557-1"
        limit={5}
        onLimitChange={vi.fn()}
      />,
    );

    expect(screen.getByText(String(usnPackages.length))).toBeInTheDocument();
  });

  it("does not render instances that are not in usnPackages", () => {
    const unaffectedInstance: Instance = {
      ...ubuntuInstance,
      id: 999,
      title: "Unaffected Server",
    };

    renderWithProviders(
      <UsnInstanceList
        instances={[unaffectedInstance]}
        usnPackages={usnPackages}
        usn="USN-6557-1"
        limit={5}
        onLimitChange={vi.fn()}
      />,
    );

    expect(screen.queryByText("Unaffected Server")).not.toBeInTheDocument();
  });
});
