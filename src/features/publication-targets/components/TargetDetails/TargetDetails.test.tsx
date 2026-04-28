import { publicationTargets } from "@/tests/mocks/publicationTargets";
import { publications } from "@/tests/mocks/publications";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router";
import type { Mock } from "vitest";
import { describe, expect, it, vi } from "vitest";
import TargetDetails from "./TargetDetails";

vi.mock("../../api/useGetPublicationsByTarget", () => ({
  default: vi.fn(),
}));

import useGetPublicationsByTarget from "../../api/useGetPublicationsByTarget";

const [targetWithPublications, targetWithoutPublications] = publicationTargets;
const [firstPublication] = publications;

if (
  !targetWithPublications?.s3 ||
  !targetWithoutPublications?.s3 ||
  !firstPublication?.label
) {
  throw new Error("Test data is missing required properties");
}

const s3WithPubs = targetWithPublications.s3;
const s3WithoutPubs = targetWithoutPublications.s3;
const firstPubName = firstPublication.displayName;

const LocationDisplay = () => {
  const { search } = useLocation();
  return <div data-testid="location">{search}</div>;
};

describe("TargetDetails", () => {
  const user = userEvent.setup();

  describe("action buttons", () => {
    it("renders Edit and Remove buttons", () => {
      (useGetPublicationsByTarget as Mock).mockReturnValue({
        publications: publications,
        isGettingPublications: false,
      });

      renderWithProviders(<TargetDetails target={targetWithPublications} />);

      expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /remove/i }),
      ).toBeInTheDocument();
    });

    it("sets sidePath=edit in URL when Edit is clicked", async () => {
      (useGetPublicationsByTarget as Mock).mockReturnValue({
        publications: [],
        isGettingPublications: false,
      });

      renderWithProviders(
        <>
          <TargetDetails target={targetWithPublications} />
          <LocationDisplay />
        </>,
      );

      await user.click(screen.getByRole("button", { name: /edit/i }));

      expect(screen.getByTestId("location")).toHaveTextContent("sidePath=edit");
    });

    it("opens the remove confirmation modal when Remove is clicked", async () => {
      (useGetPublicationsByTarget as Mock).mockReturnValue({
        publications: [],
        isGettingPublications: false,
      });

      renderWithProviders(<TargetDetails target={targetWithPublications} />);

      await user.click(screen.getByRole("button", { name: /remove/i }));

      expect(
        screen.getByRole("dialog", {
          name: `Remove ${targetWithPublications.displayName}`,
        }),
      ).toBeInTheDocument();
    });
  });

  describe("S3 target details", () => {
    it("renders the DETAILS heading", () => {
      (useGetPublicationsByTarget as Mock).mockReturnValue({
        publications: [],
        isGettingPublications: false,
      });

      renderWithProviders(<TargetDetails target={targetWithPublications} />);

      expect(screen.getByText("Details")).toBeInTheDocument();
    });

    it("renders the target displayName", () => {
      (useGetPublicationsByTarget as Mock).mockReturnValue({
        publications: [],
        isGettingPublications: false,
      });

      renderWithProviders(<TargetDetails target={targetWithPublications} />);

      expect(
        screen.getByText(targetWithPublications.displayName),
      ).toBeInTheDocument();
    });

    it("renders all S3 fields: region, bucket, prefix, acl, storageClass, encryptionMethod, disableMultiDel, forceSigV2", () => {
      (useGetPublicationsByTarget as Mock).mockReturnValue({
        publications: [],
        isGettingPublications: false,
      });

      const { container } = renderWithProviders(
        <TargetDetails target={targetWithPublications} />,
      );

      expect(container).toHaveInfoItem("Region", s3WithPubs.region);
      expect(container).toHaveInfoItem("Bucket Name", s3WithPubs.bucket);
      expect(container).toHaveInfoItem("Prefix", s3WithPubs.prefix ?? "");
      expect(container).toHaveInfoItem("ACL", s3WithPubs.acl ?? "");
      expect(container).toHaveInfoItem(
        "Storage class",
        s3WithPubs.storageClass ?? "",
      );
      expect(container).toHaveInfoItem(
        "Encryption method",
        s3WithPubs.encryptionMethod ?? "",
      );
      expect(container).toHaveInfoItem(
        "Disable MultiDel",
        s3WithPubs.disableMultiDel ? "Yes" : "No",
      );
      expect(container).toHaveInfoItem(
        "Force AWS SIGv2",
        s3WithPubs.forceSigV2 ? "Yes" : "No",
      );
    });

    it("renders S3 configuration with partial fields (missing optional fields have undefined values)", () => {
      (useGetPublicationsByTarget as Mock).mockReturnValue({
        publications: [],
        isGettingPublications: false,
      });

      const { container } = renderWithProviders(
        <TargetDetails target={targetWithoutPublications} />,
      );

      expect(container).toHaveInfoItem("Region", s3WithoutPubs.region);
      expect(container).toHaveInfoItem("Bucket Name", s3WithoutPubs.bucket);
      expect(container).toHaveInfoItem(
        "Disable MultiDel",
        s3WithoutPubs.disableMultiDel ? "Yes" : "No",
      );
    });

    it("renders 'Yes' for forceSigV2 when it is true", () => {
      (useGetPublicationsByTarget as Mock).mockReturnValue({
        publications: [],
        isGettingPublications: false,
      });

      const targetWithForceSigV2: typeof targetWithPublications = {
        ...targetWithPublications,
        s3: { ...s3WithPubs, forceSigV2: true },
      };

      const { container } = renderWithProviders(
        <TargetDetails target={targetWithForceSigV2} />,
      );

      expect(container).toHaveInfoItem("Force AWS SIGv2", "Yes");
    });
  });

  describe("Used In section", () => {
    it("shows the Used In section and publications table when target has publications", () => {
      (useGetPublicationsByTarget as Mock).mockReturnValue({
        publications: publications,
        isGettingPublications: false,
      });

      renderWithProviders(<TargetDetails target={targetWithPublications} />);

      expect(screen.getByText("Used In")).toBeInTheDocument();
      expect(screen.getByText(firstPubName)).toBeInTheDocument();
    });

    it("hides the Used In section when target has no publications", () => {
      (useGetPublicationsByTarget as Mock).mockReturnValue({
        publications: [],
        isGettingPublications: false,
      });

      renderWithProviders(<TargetDetails target={targetWithoutPublications} />);

      expect(screen.queryByText("Used In")).not.toBeInTheDocument();
    });

    it("shows LoadingState while publications are loading", () => {
      (useGetPublicationsByTarget as Mock).mockReturnValue({
        publications: [],
        isGettingPublications: true,
      });

      renderWithProviders(<TargetDetails target={targetWithPublications} />);

      expect(screen.getByText("Details")).toBeInTheDocument();
      expect(screen.queryByText("Used In")).not.toBeInTheDocument();
    });
  });

  describe("Swift target", () => {
    it("renders DETAILS without S3 fields for a Swift target", () => {
      (useGetPublicationsByTarget as Mock).mockReturnValue({
        publications: [],
        isGettingPublications: false,
      });

      const swiftTarget = publicationTargets[2];
      if (!swiftTarget) throw new Error("Missing swift mock target");

      const { container } = renderWithProviders(
        <TargetDetails target={swiftTarget} />,
      );

      expect(screen.getByText("Details")).toBeInTheDocument();
      // S3-specific InfoGrid items should not be present
      expect(container.textContent).not.toContain("Region");
      expect(container.textContent).not.toContain("Bucket Name");
    });
  });
});
