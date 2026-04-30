import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { publicationTargets } from "@/tests/mocks/publicationTargets";
import { publications } from "@/tests/mocks/publications";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { Mock } from "vitest";
import { describe, expect, it, vi, beforeEach } from "vitest";
import PublicationTargetList from "./PublicationTargetList";

vi.mock("../../api/useGetPublicationsByTarget", () => ({
  default: vi.fn(),
}));

import useGetPublicationsByTarget from "../../api/useGetPublicationsByTarget";
import type { PublicationTarget } from "@canonical/landscape-openapi";

describe("PublicationTargetList", () => {
  beforeEach(() => {
    // Default: prod-s3-us-east has 3 publications, others have 0
    (useGetPublicationsByTarget as Mock).mockImplementation(
      (publicationTargetId: string | undefined) => {
        if (publicationTargetId === "aaaaaaaa-0000-0000-0000-000000000001") {
          return { publications, isGettingPublications: false };
        }

        return { publications: [], isGettingPublications: false };
      },
    );
  });

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

  it("renders S3 type label for S3 targets", () => {
    renderWithProviders(<PublicationTargetList targets={publicationTargets} />);

    // Two S3 targets: prod-s3-us-east and staging-s3-eu-west
    expect(screen.getAllByText("S3")).toHaveLength(2);
  });

  it("renders Swift type label for Swift targets", () => {
    renderWithProviders(<PublicationTargetList targets={publicationTargets} />);

    expect(screen.getByText("Swift")).toBeInTheDocument();
  });

  it("renders Filesystem type label for Filesystem targets", () => {
    renderWithProviders(<PublicationTargetList targets={publicationTargets} />);

    expect(screen.getByText("Filesystem")).toBeInTheDocument();
  });

  it("renders the publication count for a target with publications", () => {
    renderWithProviders(<PublicationTargetList targets={publicationTargets} />);

    // prod-s3-us-east has 3 publications
    expect(screen.getByText("3 publications")).toBeInTheDocument();
  });

  it("renders NoData placeholder when a target has no publications", () => {
    renderWithProviders(<PublicationTargetList targets={publicationTargets} />);

    // staging-s3-eu-west, swift-internal, and local-fs-archive each have 0 publications → three NoData cells
    expect(screen.getAllByText(NO_DATA_TEXT)).toHaveLength(3);
  });

  it("renders singular 'publication' when a target has exactly one publication", () => {
    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: [publications[0]],
      isGettingPublications: false,
    });

    const [firstTarget] = publicationTargets;
    if (!firstTarget) throw new Error("Missing mock target");
    const singleTarget: PublicationTarget[] = [firstTarget];

    renderWithProviders(<PublicationTargetList targets={singleTarget} />);

    expect(screen.getByText("1 publication")).toBeInTheDocument();
  });

  it("renders table correctly with empty targets array", () => {
    renderWithProviders(<PublicationTargetList targets={[]} />);

    // Table should still render with headers but no data rows
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("table")).toHaveTexts([
      "Name",
      "Type",
      "Publications",
    ]);
  });

  it("renders PublicationTargetListActions component in actions column", () => {
    renderWithProviders(<PublicationTargetList targets={publicationTargets} />);

    // Each target should have an actions button with aria-label like "{displayName} actions"
    publicationTargets.forEach((target) => {
      const actionButton = screen.getByRole("button", {
        name: `${target.displayName} actions`,
      });
      expect(actionButton).toBeInTheDocument();
    });
  });

  it("renders 'Unknown' type when target has neither S3 nor Swift", () => {
    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: [],
      isGettingPublications: false,
    });

    const unknownTarget: PublicationTarget = {
      name: "publicationTargets/dddddddd-0000-0000-0000-000000000004",
      publicationTargetId: "dddddddd-0000-0000-0000-000000000004",
      displayName: "unknown-target",
    };

    renderWithProviders(<PublicationTargetList targets={[unknownTarget]} />);

    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  it("renders NoData placeholder in Name cell when target has no displayName", () => {
    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: [],
      isGettingPublications: false,
    });

    const noNameTarget: PublicationTarget = {
      name: "publicationTargets/eeeeeeee-0000-0000-0000-000000000005",
      publicationTargetId: "eeeeeeee-0000-0000-0000-000000000005",
      displayName: "",
      s3: {
        region: "us-east-1",
        bucket: "test-bucket",
        disableMultiDel: false,
        forceSigV2: false,
        awsAccessKeyId: "AKIA...",
        awsSecretAccessKey: "SECRET...",
      },
    };

    renderWithProviders(<PublicationTargetList targets={[noNameTarget]} />);

    // Name cell and Publications cell both show NoData — there are two instances
    expect(screen.getAllByText(NO_DATA_TEXT).length).toBeGreaterThanOrEqual(1);
    // Verify the Name column in particular is NoData by checking the first cell in the row
    const cells = screen.getAllByRole("cell");
    expect(cells[0]).toHaveTextContent(NO_DATA_TEXT);
  });

  it("renders the publications count as a link filtered by publicationTargetId", () => {
    renderWithProviders(<PublicationTargetList targets={publicationTargets} />);

    const link = screen.getByRole("link", { name: "3 publications" });
    expect(link).toHaveAttribute(
      "href",
      `/repositories/publications?query=${encodeURIComponent("publicationTargetId:aaaaaaaa-0000-0000-0000-000000000001")}`,
    );
  });

  it("renders spinner while publications count is loading", () => {
    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: [],
      isGettingPublications: true,
    });

    const [firstTarget] = publicationTargets;
    if (!firstTarget) throw new Error("Missing mock target");

    renderWithProviders(<PublicationTargetList targets={[firstTarget]} />);

    // aria-hidden spinner icon is rendered while loading
    const spinner = document.querySelector(".u-animation--spin");
    expect(spinner).toBeInTheDocument();
  });
});
