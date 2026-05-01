import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/tests/render";
import UsnPackagesContainer from "./UsnPackagesContainer";
import { ubuntuInstance } from "@/tests/mocks/instance";
import { usnPackageComputerId } from "@/tests/mocks/usn";
import type { Instance } from "@/types/Instance";

// 6 instances sharing the same id that matches usnPackages computer_ids,
// so allFilteredInstances.length (6) > default limit (5) triggering "Show more"
const manyAffectedInstances: Instance[] = Array.from({ length: 6 }, (_, i) => ({
  ...ubuntuInstance,
  id: usnPackageComputerId,
  title: `Affected Server ${i + 1}`,
}));

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

  it("renders remove button when isRemovable is true and listType is packages", async () => {
    renderWithProviders(
      <UsnPackagesContainer
        instances={[ubuntuInstance]}
        isRemovable={true}
        listType="packages"
        usn="USN-6557-1"
      />,
      {},
      "/instances/1",
      "/instances/:instanceId",
    );

    expect(
      await screen.findByRole("button", { name: /uninstall packages/i }),
    ).toBeInTheDocument();
  });

  it("can load more packages by triggering onLimitChange", async () => {
    renderWithProviders(
      <UsnPackagesContainer
        instances={[ubuntuInstance]}
        isRemovable={false}
        listType="packages"
        usn="USN-6557-1"
      />,
    );

    await screen.findByText(/packages affected by/i);

    const showMoreButton = await screen.findByRole("button", {
      name: /show.*more/i,
    });
    expect(showMoreButton).toBeInTheDocument();
    await userEvent.click(showMoreButton);
  });

  it("can load more instances by triggering onLimitChange", async () => {
    renderWithProviders(
      <UsnPackagesContainer
        instances={manyAffectedInstances}
        isRemovable={false}
        listType="instances"
        usn="USN-6557-1"
      />,
    );

    await screen.findByText(/instances affected by/i);

    const showMoreButton = await screen.findByRole("button", {
      name: /show.*more/i,
    });
    expect(showMoreButton).toBeInTheDocument();
    await userEvent.click(showMoreButton);
    // After clicking "Show more", limit increases and more instances load
    expect(screen.getByText(/instances affected by/i)).toBeInTheDocument();
  });
});
