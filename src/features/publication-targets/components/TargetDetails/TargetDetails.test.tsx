import useSidePanel from "@/hooks/useSidePanel";
import { publications, publicationTargetsWithPublications } from "@/tests/mocks/publication-targets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TargetDetails from "./TargetDetails";

vi.mock("@/hooks/useSidePanel");

const [targetWithPublications, targetWithoutPublications] = publicationTargetsWithPublications;
const [firstPublication] = publications;

if (
  !targetWithPublications?.s3 ||
  !targetWithoutPublications?.s3 ||
  !firstPublication?.label
) {
  throw new Error("Test data is missing required properties");
}

// Extract narrowed s3 references at module level so type guards propagate into callbacks
const s3WithPubs = targetWithPublications.s3;
const s3WithoutPubs = targetWithoutPublications.s3;
const firstPubLabel = firstPublication.label;

describe("TargetDetails", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    (useSidePanel as Mock).mockReturnValue({
      setSidePanelContent: vi.fn(),
      closeSidePanel: vi.fn(),
    });
  });

  describe("action buttons", () => {
    it("renders Edit and Remove buttons", () => {
      renderWithProviders(<TargetDetails target={targetWithPublications} />);

      expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /remove/i }),
      ).toBeInTheDocument();
    });

    it("calls setSidePanelContent with edit title when Edit is clicked", async () => {
      const { setSidePanelContent } = useSidePanel();

      renderWithProviders(<TargetDetails target={targetWithPublications} />);

      await user.click(screen.getByRole("button", { name: /edit/i }));

      expect(setSidePanelContent).toHaveBeenCalledWith(
        `Edit "${targetWithPublications.displayName}"`,
        expect.anything(),
      );
    });

    it("calls setSidePanelContent with remove title when Remove is clicked", async () => {
      const { setSidePanelContent } = useSidePanel();

      renderWithProviders(<TargetDetails target={targetWithPublications} />);

      await user.click(screen.getByRole("button", { name: /remove/i }));

      expect(setSidePanelContent).toHaveBeenCalledWith(
        `Remove ${targetWithPublications.displayName}`,
        expect.anything(),
      );
    });
  });

  describe("S3 target details", () => {
    it("renders the DETAILS heading", () => {
      renderWithProviders(<TargetDetails target={targetWithPublications} />);

      expect(screen.getByText("DETAILS")).toBeInTheDocument();
    });

    it("renders the target displayName", () => {
      renderWithProviders(<TargetDetails target={targetWithPublications} />);

      expect(
        screen.getByText(targetWithPublications.displayName),
      ).toBeInTheDocument();
    });

    it("renders all S3 fields: region, bucket, prefix, acl, storageClass, encryptionMethod, disableMultiDel, forceSigV2", () => {
      const { container } = renderWithProviders(
        <TargetDetails target={targetWithPublications} />,
      );

      expect(container).toHaveInfoItem("Region", s3WithPubs.region);
      expect(container).toHaveInfoItem("Bucket Name", s3WithPubs.bucket);
      expect(container).toHaveInfoItem("Prefix", s3WithPubs.prefix ?? "");
      expect(container).toHaveInfoItem("ACL", s3WithPubs.acl ?? "");
      expect(container).toHaveInfoItem("Storage class", s3WithPubs.storageClass ?? "");
      expect(container).toHaveInfoItem(
        "Encryption method",
        s3WithPubs.encryptionMethod ?? "",
      );
      // Boolean fields should be converted to "Yes"/"No"
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
      const { container } = renderWithProviders(
        <TargetDetails target={targetWithoutPublications} />,
      );

      // These fields should still be present even with undefined values
      expect(container).toHaveInfoItem("Region", s3WithoutPubs.region);
      expect(container).toHaveInfoItem("Bucket Name", s3WithoutPubs.bucket);
      // Boolean fields should still show "Yes"/"No"
      expect(container).toHaveInfoItem(
        "Disable MultiDel",
        s3WithoutPubs.disableMultiDel ? "Yes" : "No",
      );
    });
  });

  describe("USED IN section", () => {
    it("shows the USED IN section and publications table when target has publications", () => {
      renderWithProviders(<TargetDetails target={targetWithPublications} />);

      expect(screen.getByText("USED IN")).toBeInTheDocument();
      // Publications table should show publication labels
      expect(screen.getByText(firstPubLabel)).toBeInTheDocument();
    });

    it("hides the USED IN section when target has no publications", () => {
      renderWithProviders(<TargetDetails target={targetWithoutPublications} />);

      expect(screen.queryByText("USED IN")).not.toBeInTheDocument();
    });
  });
});

