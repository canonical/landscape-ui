import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import { Suspense } from "react";
import { describe, expect, it } from "vitest";
import ViewProfileDetailsBlock from "./ViewProfileDetailsBlock";
import { profiles } from "@/tests/mocks/profiles";
import LoadingState from "@/components/layout/LoadingState";
import type { Profile } from "@/features/profiles";

const [baseProfile] = profiles;

const renderProfileDetails = (profile: Profile) => {
  renderWithProviders(
    <Suspense fallback={<LoadingState />}>
      <ViewProfileDetailsBlock profile={profile} />
    </Suspense>,
  );
};

describe("ViewProfileDetailsBlock", () => {
  it("renders removal profile details", async () => {
    renderProfileDetails({ ...baseProfile, days_without_exchange: 30 });

    expect(
      await screen.findByRole("heading", { name: /Details/i }),
    ).toBeInTheDocument();
    expect(await screen.findByText("Removal Timeframe")).toBeInTheDocument();
    expect(await screen.findByText("30 days")).toBeInTheDocument();
  });

  it("renders script profile details", async () => {
    renderProfileDetails({
      ...baseProfile,
      script_id: 30,
      username: "root",
      time_limit: 300,
    });

    expect(
      await screen.findByRole("heading", { name: /Details/i }),
    ).toBeInTheDocument();
    expect(await screen.findByText("Script")).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: /new v2 script/i }),
    ).toBeInTheDocument();
    expect(await screen.findByText("Run as User")).toBeInTheDocument();
    expect(await screen.findByText("Time limit")).toBeInTheDocument();
  });

  it("renders usg profile details", async () => {
    renderProfileDetails({
      ...baseProfile,
      benchmark: "disa_stig",
      mode: "audit-fix",
      tailoring_file: null,
    });

    expect(
      await screen.findByRole("heading", { name: /Details/i }),
    ).toBeInTheDocument();
    expect(await screen.findByText("Benchmark")).toBeInTheDocument();
    expect(await screen.findByText("Mode")).toBeInTheDocument();
  });

  it("renders upgrade profile details", async () => {
    renderProfileDetails({
      ...baseProfile,
      upgrade_type: "all",
      autoremove: true,
    });

    expect(
      await screen.findByRole("heading", { name: /Details/i }),
    ).toBeInTheDocument();
    expect(await screen.findByText("Upgrade type")).toBeInTheDocument();
    expect(await screen.findByText("All upgrades")).toBeInTheDocument();
  });

  it("renders wsl profile details", async () => {
    renderProfileDetails({
      ...baseProfile,
      image_name: "image",
      image_source: "https://example.com/image.tar.gz",
      cloud_init_contents: "#cloud-config",
      only_landscape_created: false,
    });

    expect(
      await screen.findByRole("heading", { name: /Details/i }),
    ).toBeInTheDocument();
    expect(await screen.findByText("Image name")).toBeInTheDocument();
    expect(await screen.findByText("image")).toBeInTheDocument();
  });

  it("renders nothing when profile type is unsupported", async () => {
    renderProfileDetails(baseProfile);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: /Details/i }),
    ).not.toBeInTheDocument();
  });
});
