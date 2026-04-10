import useSidePanel from "@/hooks/useSidePanel";
import { publications, publicationTargetsWithPublications } from "@/tests/mocks/publication-targets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TargetDetails from "./TargetDetails";

vi.mock("@/hooks/useSidePanel");

// Target with publications (prod-s3-us-east, 3 publications)
const targetWithPublications = publicationTargetsWithPublications[0];
// Target without publications (staging-s3-eu-west)
const targetWithoutPublications = publicationTargetsWithPublications[1];

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
        `Edit "${targetWithPublications.display_name}"`,
        expect.anything(),
      );
    });

    it("calls setSidePanelContent with remove title when Remove is clicked", async () => {
      const { setSidePanelContent } = useSidePanel();

      renderWithProviders(<TargetDetails target={targetWithPublications} />);

      await user.click(screen.getByRole("button", { name: /remove/i }));

      expect(setSidePanelContent).toHaveBeenCalledWith(
        `Remove ${targetWithPublications.display_name}`,
        expect.anything(),
      );
    });
  });

  describe("S3 target details", () => {
    it("renders the DETAILS heading", () => {
      renderWithProviders(<TargetDetails target={targetWithPublications} />);

      expect(screen.getByText("DETAILS")).toBeInTheDocument();
    });

    it("renders the target display_name", () => {
      renderWithProviders(<TargetDetails target={targetWithPublications} />);

      expect(
        screen.getByText(targetWithPublications.display_name),
      ).toBeInTheDocument();
    });

    it("renders all S3 fields: region, bucket, prefix, acl, storage_class, encryption_method, disable_multi_del, force_sig_v2", () => {
      const { container } = renderWithProviders(
        <TargetDetails target={targetWithPublications} />,
      );

      expect(container).toHaveInfoItem(
        "Region",
        targetWithPublications.s3!.region,
      );
      expect(container).toHaveInfoItem(
        "Bucket Name",
        targetWithPublications.s3!.bucket,
      );
      expect(container).toHaveInfoItem(
        "Prefix",
        targetWithPublications.s3!.prefix,
      );
      expect(container).toHaveInfoItem("ACL", targetWithPublications.s3!.acl);
      expect(container).toHaveInfoItem(
        "Storage class",
        targetWithPublications.s3!.storage_class,
      );
      expect(container).toHaveInfoItem(
        "Encryption method",
        targetWithPublications.s3!.encryption_method,
      );
      // Boolean fields should be converted to "Yes"/"No"
      expect(container).toHaveInfoItem(
        "Disable MultiDel",
        targetWithPublications.s3!.disable_multi_del ? "Yes" : "No",
      );
      expect(container).toHaveInfoItem(
        "Force AWS SIGv2",
        targetWithPublications.s3!.force_sig_v2 ? "Yes" : "No",
      );
    });

    it("renders S3 configuration with partial fields (missing optional fields have undefined values)", () => {
      const { container } = renderWithProviders(
        <TargetDetails target={targetWithoutPublications} />,
      );

      // These fields should still be present even with undefined values
      expect(container).toHaveInfoItem(
        "Region",
        targetWithoutPublications.s3!.region,
      );
      expect(container).toHaveInfoItem(
        "Bucket Name",
        targetWithoutPublications.s3!.bucket,
      );
      // Boolean fields should still show "Yes"/"No"
      expect(container).toHaveInfoItem(
        "Disable MultiDel",
        targetWithoutPublications.s3!.disable_multi_del ? "Yes" : "No",
      );
    });
  });

  describe("USED IN section", () => {
    it("shows the USED IN section and publications table when target has publications", () => {
      renderWithProviders(<TargetDetails target={targetWithPublications} />);

      expect(screen.getByText("USED IN")).toBeInTheDocument();
      // Publications table should show publication display names
      expect(
        screen.getByText(publications[0].display_name),
      ).toBeInTheDocument();
    });

    it("hides the USED IN section when target has no publications", () => {
      renderWithProviders(<TargetDetails target={targetWithoutPublications} />);

      expect(screen.queryByText("USED IN")).not.toBeInTheDocument();
    });
  });
});
