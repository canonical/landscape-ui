import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "@/tests/render";
import UsnPackagesContainer from "./UsnPackagesContainer";
import { ubuntuInstance } from "@/tests/mocks/instance";

describe("UsnPackagesContainer", () => {
  it("renders loading state initially", () => {
    renderWithProviders(
      <UsnPackagesContainer
        instances={[ubuntuInstance]}
        isRemovable={false}
        listType="instances"
        usn="USN-6557-1"
      />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders instance list after loading when listType is 'instances'", async () => {
    renderWithProviders(
      <UsnPackagesContainer
        instances={[ubuntuInstance]}
        isRemovable={false}
        listType="instances"
        usn="USN-6557-1"
      />,
    );

    expect(
      await screen.findByText(/instances affected by/i),
    ).toBeInTheDocument();
  });

  it("renders package list after loading when listType is 'packages'", async () => {
    renderWithProviders(
      <UsnPackagesContainer
        instances={[ubuntuInstance]}
        isRemovable={false}
        listType="packages"
        usn="USN-6557-1"
      />,
    );

    expect(
      await screen.findByText(/packages affected by/i),
    ).toBeInTheDocument();
  });
});
