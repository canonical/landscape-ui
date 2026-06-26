import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { publicationTargets } from "@/tests/mocks/publicationTargets";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PublicationTargetList from "./PublicationTargetList";
import type { PublicationTarget } from "@canonical/landscape-openapi";
import { expectLoadingState } from "@/tests/helpers";

describe("PublicationTargetList", () => {
  it("renders table headers", () => {
    renderWithProviders(<PublicationTargetList targets={publicationTargets} />);

    expect(screen.getByRole("table")).toHaveTexts([
      "Name",
      "Type",
      "Publications",
    ]);
  });

  it("renders the displayName for each target", () => {
    renderWithProviders(<PublicationTargetList targets={publicationTargets} />);

    expect(screen.getByText("prod-s3-us-east")).toBeInTheDocument();
    expect(screen.getByText("staging-s3-eu-west")).toBeInTheDocument();
    expect(screen.getByText("swift-internal")).toBeInTheDocument();
  });

  it("renders target type labels", () => {
    renderWithProviders(<PublicationTargetList targets={publicationTargets} />);

    expect(screen.getAllByText("S3")).toHaveLength(2);
    expect(screen.getByText("Swift")).toBeInTheDocument();
    expect(screen.getByText("Filesystem")).toBeInTheDocument();
  });

  it("renders the publication counts from shared fixtures", async () => {
    renderWithProviders(<PublicationTargetList targets={publicationTargets} />);

    await waitFor(() => {
      expect(screen.getAllByText("1 publication")).toHaveLength(2);
    });
    expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();
  });

  it("renders table correctly with empty targets array", () => {
    renderWithProviders(<PublicationTargetList targets={[]} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("table")).toHaveTexts([
      "Name",
      "Type",
      "Publications",
    ]);
  });

  it("renders PublicationTargetListActions component in actions column", () => {
    renderWithProviders(<PublicationTargetList targets={publicationTargets} />);

    publicationTargets.forEach((target) => {
      const actionButton = screen.getByRole("button", {
        name: `${target.displayName} actions`,
      });
      expect(actionButton).toBeInTheDocument();
    });
  });

  it("renders 'Unknown' type when target has no target details", () => {
    const unknownTarget: PublicationTarget = {
      name: "publicationTargets/dddddddd-0000-0000-0000-000000000004",
      publicationTargetId: "dddddddd-0000-0000-0000-000000000004",
      displayName: "unknown-target",
    };

    renderWithProviders(<PublicationTargetList targets={[unknownTarget]} />);

    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  it("renders NoData placeholder in Name cell when target has no displayName", async () => {
    const noNameTarget: PublicationTarget = {
      name: "publicationTargets/eeeeeeee-0000-0000-0000-000000000005",
      publicationTargetId: "eeeeeeee-0000-0000-0000-000000000005",
      displayName: "",
      s3: {
        region: "us-east-1",
        bucket: "test-bucket",
        disableMultiDel: false,
        forceSigV2: false,
      },
    };

    renderWithProviders(<PublicationTargetList targets={[noNameTarget]} />);

    await expectLoadingState();

    expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();
  });

  it("renders the publications count as a link filtered by publicationTargetId", async () => {
    renderWithProviders(<PublicationTargetList targets={publicationTargets} />);

    const link = await screen.findByRole("link", { name: "1 publication" });
    expect(link).toHaveAttribute(
      "href",
      `/repositories/publications?query=${encodeURIComponent("publicationTargetId:aaaaaaaa-0000-0000-0000-000000000001")}`,
    );
  });

  it("renders spinner while publications count is loading", () => {
    const [firstTarget] = publicationTargets;

    assert(firstTarget, "Missing mock target");

    renderWithProviders(<PublicationTargetList targets={[firstTarget]} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
