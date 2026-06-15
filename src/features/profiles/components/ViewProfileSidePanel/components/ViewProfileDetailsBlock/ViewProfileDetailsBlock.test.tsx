import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { Suspense } from "react";
import { describe, expect, it } from "vitest";
import ViewProfileDetailsBlock from "./ViewProfileDetailsBlock";
import { profiles } from "@/tests/mocks/profiles";
import LoadingState from "@/components/layout/LoadingState";

const [baseProfile] = profiles;

describe("ViewProfileDetailsBlock", () => {
  it("renders removal profile details", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <ViewProfileDetailsBlock
          profile={{ ...baseProfile, days_without_exchange: 30 }}
        />
      </Suspense>,
    );

    expect(
      await screen.findByRole("heading", { name: /Details/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Removal Timeframe")).toBeInTheDocument();
    expect(screen.getByText("30 days")).toBeInTheDocument();
  });

  it("renders script profile details", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <ViewProfileDetailsBlock
          profile={{
            ...baseProfile,
            script_id: 30,
            username: "root",
            time_limit: 300,
          }}
        />
      </Suspense>,
    );

    expect(
      await screen.findByRole("heading", { name: /Details/i }),
    ).toBeInTheDocument();
    expect(await screen.findByText("Script")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /new v2 script/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Run as User")).toBeInTheDocument();
    expect(screen.getByText("Time limit")).toBeInTheDocument();
  });

  it("renders usg profile details", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <ViewProfileDetailsBlock
          profile={{
            ...baseProfile,
            benchmark: "disa_stig",
            mode: "audit-fix",
            tailoring_file: null,
          }}
        />
      </Suspense>,
    );

    expect(
      await screen.findByRole("heading", { name: /Details/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Benchmark")).toBeInTheDocument();
    expect(screen.getByText("Mode")).toBeInTheDocument();
  });

  it("renders upgrade profile details", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <ViewProfileDetailsBlock
          profile={{ ...baseProfile, upgrade_type: "all", autoremove: true }}
        />
      </Suspense>,
    );

    expect(
      await screen.findByRole("heading", { name: /Details/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Upgrade type")).toBeInTheDocument();
    expect(screen.getByText("All upgrades")).toBeInTheDocument();
  });

  it("renders wsl profile details", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <ViewProfileDetailsBlock
          profile={{
            ...baseProfile,
            image_name: "image",
            image_source: "https://example.com/image.tar.gz",
            cloud_init_contents: "#cloud-config",
            only_landscape_created: false,
          }}
        />
      </Suspense>,
    );

    expect(
      await screen.findByRole("heading", { name: /Details/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Image name")).toBeInTheDocument();
    expect(screen.getByText("image")).toBeInTheDocument();
  });

  it("renders nothing when profile type is unsupported", () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <ViewProfileDetailsBlock profile={baseProfile} />
      </Suspense>,
    );

    expect(screen.queryByText(/Details/i)).not.toBeInTheDocument();
  });
});
