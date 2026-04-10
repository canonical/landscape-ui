import { NO_DATA_TEXT } from "@/components/layout/NoData";
import type { PublicationTargetWithPublications } from "@/features/publication-targets";
import { publicationTargetsWithPublications, publications } from "@/tests/mocks/publication-targets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PublicationTargetList from "./PublicationTargetList";

describe("PublicationTargetList", () => {
  it("renders table headers", () => {
    renderWithProviders(
      <PublicationTargetList targets={publicationTargetsWithPublications} />,
    );

    expect(screen.getByRole("table")).toHaveTexts([
      "Name",
      "Type",
      "Publications",
    ]);
  });

  it("renders the display_name for each target", () => {
    renderWithProviders(
      <PublicationTargetList targets={publicationTargetsWithPublications} />,
    );

    expect(screen.getByText("prod-s3-us-east")).toBeInTheDocument();
    expect(screen.getByText("staging-s3-eu-west")).toBeInTheDocument();
    expect(screen.getByText("swift-internal")).toBeInTheDocument();
  });

  it("renders S3 type label for S3 targets", () => {
    renderWithProviders(
      <PublicationTargetList targets={publicationTargetsWithPublications} />,
    );

    // Two S3 targets: prod-s3-us-east and staging-s3-eu-west
    expect(screen.getAllByText("S3")).toHaveLength(2);
  });

  it("renders Swift type label for Swift targets", () => {
    renderWithProviders(
      <PublicationTargetList targets={publicationTargetsWithPublications} />,
    );

    expect(screen.getByText("Swift")).toBeInTheDocument();
  });

  it("renders the publication count for a target with publications", () => {
    renderWithProviders(
      <PublicationTargetList targets={publicationTargetsWithPublications} />,
    );

    // prod-s3-us-east has 3 publications
    expect(screen.getByText("3 publications")).toBeInTheDocument();
  });

  it("renders NoData placeholder when a target has no publications", () => {
    renderWithProviders(
      <PublicationTargetList targets={publicationTargetsWithPublications} />,
    );

    // staging-s3-eu-west and swift-internal each have 0 publications → two NoData cells
    expect(screen.getAllByText(NO_DATA_TEXT)).toHaveLength(2);
  });

  it("renders singular 'publication' when a target has exactly one publication", () => {
    const targetWithOnePublication: PublicationTargetWithPublications = {
      ...publicationTargetsWithPublications[0],
      publications: [publications[0]],
    };

    renderWithProviders(
      <PublicationTargetList targets={[targetWithOnePublication]} />,
    );

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
    renderWithProviders(
      <PublicationTargetList targets={publicationTargetsWithPublications} />,
    );

    // Each target should have an actions button with aria-label like "{displayName} actions"
    publicationTargetsWithPublications.forEach((target) => {
      const actionButton = screen.getByRole("button", {
        name: `${target.display_name} actions`,
      });
      expect(actionButton).toBeInTheDocument();
    });
  });
});
