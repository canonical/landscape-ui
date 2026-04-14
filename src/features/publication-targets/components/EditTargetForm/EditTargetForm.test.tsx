import useSidePanel from "@/hooks/useSidePanel";
import { publicationTargets } from "@/tests/mocks/publication-targets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EditTargetForm from "./EditTargetForm";
import type { PublicationTarget } from "@/api/generated/debArchive.schemas";

vi.mock("@/hooks/useSidePanel");

// TODO: add coverage for other target types (swift and filesystem) once those are supported

// S3 targets from mocks. publicationTargets[0] has all optional S3 fields;
// publicationTargets[1] has minimal optional fields. Both are S3-only in this version.
const [s3TargetFull, s3TargetMinimal] = publicationTargets;

if (!s3TargetFull?.s3 || !s3TargetMinimal?.s3) {
  throw new Error("Test targets must have S3 config");
}

describe("EditTargetForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    (useSidePanel as Mock).mockReturnValue({
      setSidePanelContent: vi.fn(),
      closeSidePanel: vi.fn(),
    });
  });

  it("pre-populates the display_name field from the target prop", () => {
    renderWithProviders(<EditTargetForm target={s3TargetFull} />);

    expect(screen.getByLabelText("Name")).toHaveValue(s3TargetFull.displayName);
  });

  it("pre-populates S3 fields from the target prop", () => {
    renderWithProviders(<EditTargetForm target={s3TargetFull} />);

    expect(screen.getByLabelText(/bucket name/i)).toHaveValue(
      s3TargetFull.s3?.bucket,
    );
    expect(screen.getByLabelText(/aws access key id/i)).toHaveValue(
      s3TargetFull.s3?.awsAccessKeyId,
    );
    expect(screen.getByLabelText(/region/i)).toHaveValue(s3TargetFull.s3?.region);
  });

  it("pre-populates optional S3 fields when present", () => {
    renderWithProviders(<EditTargetForm target={s3TargetFull} />);

    expect(screen.getByLabelText(/prefix/i)).toHaveValue(
      s3TargetFull.s3?.prefix,
    );
    expect(screen.getByLabelText(/^acl$/i)).toHaveValue(s3TargetFull.s3?.acl);
    expect(screen.getByLabelText(/storage class/i)).toHaveValue(
      s3TargetFull.s3?.storageClass,
    );
    expect(screen.getByLabelText(/encryption method/i)).toHaveValue(
      s3TargetFull.s3?.encryptionMethod,
    );
  });

  it("pre-populates with empty strings when optional S3 fields are missing", () => {
    renderWithProviders(<EditTargetForm target={s3TargetMinimal} />);

    expect(screen.getByLabelText(/prefix/i)).toHaveValue("");
    expect(screen.getByLabelText(/^acl$/i)).toHaveValue("");
    expect(screen.getByLabelText(/storage class/i)).toHaveValue("");
    expect(screen.getByLabelText(/encryption method/i)).toHaveValue("");
  });

  it("pre-populates all S3 fields with empty strings when target has no S3 config", () => {
    const targetWithoutS3 = {
      name: "publicationTargets/no-s3",
      publicationTargetId: "no-s3",
      displayName: "Target without S3",
    };

    renderWithProviders(<EditTargetForm target={targetWithoutS3} />);

    expect(screen.getByLabelText("Name")).toHaveValue("Target without S3");
    expect(screen.getByLabelText(/region/i)).toHaveValue("");
    expect(screen.getByLabelText(/bucket name/i)).toHaveValue("");
    expect(screen.getByLabelText(/endpoint/i)).toHaveValue("");
    expect(screen.getByLabelText(/aws access key id/i)).toHaveValue("");
    expect(screen.getByLabelText(/aws secret access key/i)).toHaveValue("");
    expect(screen.getByLabelText(/prefix/i)).toHaveValue("");
    expect(screen.getByLabelText(/^acl$/i)).toHaveValue("");
    expect(screen.getByLabelText(/storage class/i)).toHaveValue("");
    expect(screen.getByLabelText(/encryption method/i)).toHaveValue("");
  });

  it("pre-populates with mixed null/undefined optional S3 fields", () => {
    const s3TargetPartiallyNull = {
      name: "publicationTargets/partial",
      publicationTargetId: "partial",
      displayName: "Partially null",
      s3: {
        bucket: "my-bucket",
        awsAccessKeyId: "key",
        awsSecretAccessKey: "secret",
        region: "region",
        endpoint: undefined,
        prefix: undefined,
        acl: "private",
        storageClass: undefined,
        encryptionMethod: undefined,
      },
    } as PublicationTarget;

    renderWithProviders(<EditTargetForm target={s3TargetPartiallyNull} />);

    expect(screen.getByLabelText(/endpoint/i)).toHaveValue("");
    expect(screen.getByLabelText(/prefix/i)).toHaveValue("");
    expect(screen.getByLabelText(/^acl$/i)).toHaveValue("private");
    expect(screen.getByLabelText(/storage class/i)).toHaveValue("");
    expect(screen.getByLabelText(/encryption method/i)).toHaveValue("");
  });

  it("renders the save button", () => {
    renderWithProviders(<EditTargetForm target={s3TargetFull} />);

    expect(
      screen.getByRole("button", { name: /save/i }),
    ).toBeInTheDocument();
  });

  it("submits the form with all optional fields and calls closeSidePanel on success", async () => {
    const { closeSidePanel } = useSidePanel();

    renderWithProviders(<EditTargetForm target={s3TargetFull} />);

    await user.click(screen.getByRole("button", { name: /save/i }));

    await vi.waitFor(() => {
      expect(closeSidePanel).toHaveBeenCalled();
    });
  });

  it("submits the form with empty optional fields and calls closeSidePanel on success", async () => {
    const { closeSidePanel } = useSidePanel();

    renderWithProviders(<EditTargetForm target={s3TargetMinimal} />);

    await user.click(screen.getByRole("button", { name: /save/i }));

    await vi.waitFor(() => {
      expect(closeSidePanel).toHaveBeenCalled();
    });
  });

  it("toggles the disable_multi_del checkbox", async () => {
    renderWithProviders(<EditTargetForm target={s3TargetFull} />);

    const checkbox = screen.getByRole("checkbox", { name: /disable multidel/i });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("toggles the force_sig_v2 checkbox", async () => {
    renderWithProviders(<EditTargetForm target={s3TargetFull} />);

    const checkbox = screen.getByRole("checkbox", {
      name: /force aws sigv2/i,
    });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
