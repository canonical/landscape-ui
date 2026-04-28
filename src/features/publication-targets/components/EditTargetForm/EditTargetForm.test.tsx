import { publicationTargets } from "@/tests/mocks/publicationTargets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import EditTargetForm from "./EditTargetForm";

const [s3TargetFull, s3TargetMinimal, swiftTarget, filesystemTarget] =
  publicationTargets;

if (!s3TargetFull?.s3 || !s3TargetMinimal?.s3) {
  throw new Error("Test targets must have S3 config");
}
if (!swiftTarget?.swift) {
  throw new Error("Test target must have Swift config");
}
if (!filesystemTarget?.filesystem) {
  throw new Error("Test target must have Filesystem config");
}

const s3Full = s3TargetFull.s3;
const swift = swiftTarget.swift;
const filesystem = filesystemTarget.filesystem;

describe("EditTargetForm", () => {
  const user = userEvent.setup();

  describe("S3 target", () => {
    it("pre-populates the display_name field", () => {
      renderWithProviders(<EditTargetForm target={s3TargetFull} />);

      expect(screen.getByLabelText("Name")).toHaveValue(s3TargetFull.displayName);
    });

    it("shows Type as read-only S3", () => {
      renderWithProviders(<EditTargetForm target={s3TargetFull} />);

      expect(screen.getByText("S3")).toBeInTheDocument();
    });

    it("pre-populates S3 structural fields", () => {
      renderWithProviders(<EditTargetForm target={s3TargetFull} />);

      expect(screen.getByText(s3Full.bucket)).toBeInTheDocument();
      expect(screen.getByText(s3Full.region)).toBeInTheDocument();
    });

    it("leaves INPUT_ONLY credential fields blank", () => {
      renderWithProviders(<EditTargetForm target={s3TargetFull} />);

      expect(screen.getByLabelText(/aws access key id/i)).toHaveValue("");
      expect(screen.getByLabelText(/aws secret access key/i)).toHaveValue("");
    });

    it("shows help text for INPUT_ONLY fields", () => {
      renderWithProviders(<EditTargetForm target={s3TargetFull} />);

      expect(
        screen.getAllByText(/leave blank to keep current value/i),
      ).toHaveLength(2);
    });

    it("pre-populates optional S3 fields when present", () => {
      renderWithProviders(<EditTargetForm target={s3TargetFull} />);

      expect(screen.getByLabelText(/^acl$/i)).toHaveValue(s3Full.acl);
      expect(screen.getByLabelText(/storage class/i)).toHaveValue(
        s3Full.storageClass,
      );
      expect(screen.getByLabelText(/encryption method/i)).toHaveValue(
        s3Full.encryptionMethod,
      );
    });

    it("pre-populates with empty strings when optional S3 fields are missing", () => {
      renderWithProviders(<EditTargetForm target={s3TargetMinimal} />);

      expect(screen.getByLabelText(/^acl$/i)).toHaveValue("");
      expect(screen.getByLabelText(/storage class/i)).toHaveValue("");
      expect(screen.getByLabelText(/encryption method/i)).toHaveValue("");
    });

    it("renders the save button", () => {
      renderWithProviders(<EditTargetForm target={s3TargetFull} />);

      expect(
        screen.getByRole("button", { name: /save/i }),
      ).toBeInTheDocument();
    });

    it("submits and shows success notification", async () => {
      renderWithProviders(<EditTargetForm target={s3TargetFull} />);

      await user.click(screen.getByRole("button", { name: /save/i }));

      expect(
        await screen.findByText(/publication target edited/i),
      ).toBeInTheDocument();
    });
  });

  describe("Swift target", () => {
    it("shows Type as read-only Swift", () => {
      renderWithProviders(<EditTargetForm target={swiftTarget} />);

      expect(screen.getByText("Swift")).toBeInTheDocument();
    });

    it("pre-populates container as read-only", () => {
      renderWithProviders(<EditTargetForm target={swiftTarget} />);

      expect(screen.getByText(swift.container)).toBeInTheDocument();
    });

    it("pre-populates authUrl as read-only", () => {
      renderWithProviders(<EditTargetForm target={swiftTarget} />);

      expect(screen.getByText(swift.authUrl)).toBeInTheDocument();
    });

    it("leaves INPUT_ONLY credential fields blank with help text", () => {
      renderWithProviders(<EditTargetForm target={swiftTarget} />);

      expect(screen.getByLabelText(/^username$/i)).toHaveValue("");
      expect(screen.getByLabelText(/^password$/i)).toHaveValue("");
      expect(
        screen.getAllByText(/leave blank to keep current value/i),
      ).toHaveLength(2);
    });

    it("pre-populates optional Swift fields when present", () => {
      renderWithProviders(<EditTargetForm target={swiftTarget} />);

      expect(screen.getByLabelText(/^tenant$/i)).toHaveValue(swift.tenant ?? "");
    });

    it("submits and shows success notification", async () => {
      renderWithProviders(<EditTargetForm target={swiftTarget} />);

      await user.click(screen.getByRole("button", { name: /save/i }));

      expect(
        await screen.findByText(/publication target edited/i),
      ).toBeInTheDocument();
    });
  });

  describe("Filesystem target", () => {
    it("shows Type as read-only Filesystem", () => {
      renderWithProviders(<EditTargetForm target={filesystemTarget} />);

      expect(screen.getByText("Filesystem")).toBeInTheDocument();
    });

    it("pre-populates path as read-only", () => {
      renderWithProviders(<EditTargetForm target={filesystemTarget} />);

      expect(screen.getByText(filesystem.path)).toBeInTheDocument();
    });

    it("pre-populates linkMethod select", () => {
      renderWithProviders(<EditTargetForm target={filesystemTarget} />);

      expect(screen.getByLabelText(/link method/i)).toHaveValue(
        filesystem.linkMethod ?? "",
      );
    });

    it("submits and shows success notification", async () => {
      renderWithProviders(<EditTargetForm target={filesystemTarget} />);

      await user.click(screen.getByRole("button", { name: /save/i }));

      expect(
        await screen.findByText(/publication target edited/i),
      ).toBeInTheDocument();
    });
  });
});

