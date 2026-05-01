import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ViewProfileGeneralBlock from "./ViewProfileGeneralBlock";
import { ProfileTypes } from "../../../../helpers";
import { profiles } from "@/tests/mocks/profiles";

const [baseProfile] = profiles;

describe("ViewProfileGeneralBlock", () => {
  it("shows loading state while access groups are loading", () => {
    renderWithProviders(
      <ViewProfileGeneralBlock
        profile={baseProfile}
        type={ProfileTypes.script}
      />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it.each([
    [ProfileTypes.reboot],
    [ProfileTypes.upgrade],
    [ProfileTypes.removal],
  ])("renders no status nor description for %s profile", async (type) => {
    renderWithProviders(
      <ViewProfileGeneralBlock profile={baseProfile} type={type} />,
    );

    expect(
      await screen.findByRole("heading", { name: /^General$/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/^Name$/i)).toBeInTheDocument();
    expect(screen.getByText(baseProfile.title)).toBeInTheDocument();
    expect(screen.getByText(/^Access group$/i)).toBeInTheDocument();
    expect(screen.getByText("Global access")).toBeInTheDocument();

    expect(screen.queryByText(/^Status$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Description$/i)).not.toBeInTheDocument();
  });

  it.each([[ProfileTypes.script], [ProfileTypes.usg]])(
    "renders active status for %s profile",
    async (type) => {
      renderWithProviders(
        <ViewProfileGeneralBlock profile={baseProfile} type={type} />,
      );

      expect(
        await screen.findByRole("heading", { name: /^General$/i }),
      ).toBeInTheDocument();
      expect(screen.getByText(/^Name$/i)).toBeInTheDocument();
      expect(screen.getByText(/^Access group$/i)).toBeInTheDocument();

      expect(screen.getByText(/^Status$/i)).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();

      expect(screen.queryByText(/^Description$/i)).not.toBeInTheDocument();
    },
  );

  it.each([
    [ProfileTypes.script, { ...baseProfile, archived: true }],
    [ProfileTypes.usg, { ...baseProfile, status: "archived" }],
  ])("renders archived status for %s profile", async (type, profile) => {
    renderWithProviders(
      <ViewProfileGeneralBlock profile={profile} type={type} />,
    );

    expect(await screen.findByText("Archived")).toBeInTheDocument();
  });

  it.each([
    [ProfileTypes.package],
    [ProfileTypes.repository],
    [ProfileTypes.wsl],
  ])("renders description for %s profile", async (type) => {
    renderWithProviders(
      <ViewProfileGeneralBlock profile={baseProfile} type={type} />,
    );

    expect(
      await screen.findByRole("heading", { name: /^General$/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/^Name$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Access group$/i)).toBeInTheDocument();

    expect(screen.getByText(/^Description$/i)).toBeInTheDocument();
    expect(screen.getByText(baseProfile.description)).toBeInTheDocument();

    expect(screen.queryByText(/^Status$/i)).not.toBeInTheDocument();
  });
});
