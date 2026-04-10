import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ViewProfileSidePanel from "./ViewProfileSidePanel";
import { ProfileTypes } from "../../helpers";
import { profiles } from "@/tests/mocks/profiles";

vi.mock("./components/ViewProfileActionsBlock", () => ({
  default: () => <div>actions-block</div>,
}));

vi.mock("./components/ViewProfileInfoTab", () => ({
  default: () => <div>info-tab</div>,
}));

vi.mock("@/features/script-profiles", () => ({
  ScriptProfileActivityHistory: () => <div>activity-history-tab</div>,
}));

vi.mock("@/features/package-profiles", () => ({
  PackageProfileDetailsConstraints: () => <div>package-constraints-tab</div>,
}));

vi.mock("@/features/repository-profiles", () => ({
  ViewRepositoryProfileAptSourcesTab: () => <div>apt-sources-tab</div>,
  ViewRepositoryProfilePocketsTab: () => <div>pockets-tab</div>,
}));

const [baseProfile] = profiles;

describe("ViewProfileSidePanel", () => {
  it.each([
    [ProfileTypes.security],
    [ProfileTypes.upgrade],
    [ProfileTypes.wsl],
    [ProfileTypes.removal],
    [ProfileTypes.reboot],
  ])("renders only info tab for %s profile", (type) => {
    renderWithProviders(
      <ViewProfileSidePanel profile={baseProfile} type={type} />,
    );

    expect(screen.queryByText(/Activity history/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Package constraints/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Pockets/i)).not.toBeInTheDocument();

    expect(screen.getByText("actions-block")).toBeInTheDocument();
    expect(screen.getByText("info-tab")).toBeInTheDocument();
  });

  it("renders script activity history tab when selected", async () => {
    const scriptProfile = { ...baseProfile, script_id: 10 };

    renderWithProviders(
      <ViewProfileSidePanel
        profile={scriptProfile}
        type={ProfileTypes.script}
      />,
    );

    expect(screen.getByText("Info")).toBeInTheDocument();
    expect(screen.getByText("info-tab")).toBeInTheDocument();

    expect(screen.queryByText(/Package constraints/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Pockets/i)).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Activity history"));
    expect(screen.getByText("activity-history-tab")).toBeInTheDocument();
    expect(screen.getByText("actions-block")).toBeInTheDocument();
  });

  it("renders package constraints tab when selected", async () => {
    const packageProfile = { ...baseProfile, constraints: [] };

    renderWithProviders(
      <ViewProfileSidePanel
        profile={packageProfile}
        type={ProfileTypes.package}
      />,
    );

    expect(screen.getByText("Info")).toBeInTheDocument();
    expect(screen.queryByText(/Activity history/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Pockets/i)).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Package constraints"));
    expect(screen.getByText("package-constraints-tab")).toBeInTheDocument();
    expect(screen.getByText("actions-block")).toBeInTheDocument();
  });

  it("renders repository tabs when selected", async () => {
    const repositoryProfile = { ...baseProfile, apt_sources: [] };

    renderWithProviders(
      <ViewProfileSidePanel
        profile={repositoryProfile}
        type={ProfileTypes.repository}
      />,
    );

    expect(screen.queryByText(/Activity history/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Package constraints/i)).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Pockets"));
    expect(screen.getByText("pockets-tab")).toBeInTheDocument();

    await userEvent.click(screen.getByText("APT sources"));
    expect(screen.getByText("apt-sources-tab")).toBeInTheDocument();
    expect(screen.getByText("actions-block")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Info"));
    expect(screen.getByText("info-tab")).toBeInTheDocument();
  });
});
