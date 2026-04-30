import { API_URL_DEB_ARCHIVE } from "@/constants";
import { publicationTargets } from "@/tests/mocks/publicationTargets";
import server from "@/tests/server";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
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
const { swift } = swiftTarget;
const { filesystem } = filesystemTarget;

describe("EditTargetForm", () => {
  const user = userEvent.setup();

  describe("S3 target", () => {
    it("pre-populates the display_name field", () => {
      renderWithProviders(<EditTargetForm target={s3TargetFull} />);

      expect(screen.getByLabelText("Name")).toHaveValue(
        s3TargetFull.displayName,
      );
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

      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
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

      expect(screen.getByLabelText(/^tenant$/i)).toHaveValue(
        swift.tenant ?? "",
      );
    });

    it("submits and shows success notification", async () => {
      renderWithProviders(<EditTargetForm target={swiftTarget} />);

      await user.click(screen.getByRole("button", { name: /save/i }));

      expect(
        await screen.findByText(/publication target edited/i),
      ).toBeInTheDocument();
    });

    it("user can edit optional Swift fields and submit successfully", async () => {
      renderWithProviders(<EditTargetForm target={swiftTarget} />);

      await user.clear(screen.getByLabelText(/^tenant$/i));
      await user.type(screen.getByLabelText(/^tenant$/i), "updated-tenant");
      await user.type(screen.getByLabelText(/^prefix$/i), "packages/");
      await user.click(screen.getByRole("button", { name: /save/i }));

      expect(
        await screen.findByText(/publication target edited/i),
      ).toBeInTheDocument();
    });

    it("shows 'This field is required' when display name is cleared", async () => {
      renderWithProviders(<EditTargetForm target={swiftTarget} />);

      await user.clear(screen.getByLabelText("Name"));
      await user.click(screen.getByRole("button", { name: /save/i }));

      expect(
        await screen.findByText(/this field is required/i),
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

    it("user can change linkMethod and submit successfully", async () => {
      renderWithProviders(<EditTargetForm target={filesystemTarget} />);

      await user.selectOptions(
        screen.getByLabelText(/link method/i),
        "SYMLINK",
      );
      await user.click(screen.getByRole("button", { name: /save/i }));

      expect(
        await screen.findByText(/publication target edited/i),
      ).toBeInTheDocument();
    });

    it("shows 'This field is required' when display name is cleared", async () => {
      renderWithProviders(<EditTargetForm target={filesystemTarget} />);

      await user.clear(screen.getByLabelText("Name"));
      await user.click(screen.getByRole("button", { name: /save/i }));

      expect(
        await screen.findByText(/this field is required/i),
      ).toBeInTheDocument();
    });
  });

  describe("display name validation", () => {
    it("shows 'This field is required' when display name is cleared on S3 target", async () => {
      renderWithProviders(<EditTargetForm target={s3TargetFull} />);

      await user.clear(screen.getByLabelText("Name"));
      await user.click(screen.getByRole("button", { name: /save/i }));

      expect(
        await screen.findByText(/this field is required/i),
      ).toBeInTheDocument();
    });
  });

  describe("S3 checkbox fields", () => {
    it("toggles the disableMultiDel checkbox", async () => {
      renderWithProviders(<EditTargetForm target={s3TargetFull} />);

      const checkbox = screen.getByRole("checkbox", {
        name: /disable multidel/i,
      });
      const initialState = (checkbox as HTMLInputElement).checked;

      await user.click(checkbox);
      expect((checkbox as HTMLInputElement).checked).toBe(!initialState);
    });

    it("toggles the forceSigV2 checkbox", async () => {
      renderWithProviders(<EditTargetForm target={s3TargetFull} />);

      const checkbox = screen.getByRole("checkbox", {
        name: /force aws sigv2/i,
      });
      const initialState = (checkbox as HTMLInputElement).checked;

      await user.click(checkbox);
      expect((checkbox as HTMLInputElement).checked).toBe(!initialState);
    });

    it("submits S3 form with optional fields populated and shows success", async () => {
      renderWithProviders(<EditTargetForm target={s3TargetFull} />);

      await user.type(screen.getByLabelText(/aws access key id/i), "NEWKEY");
      await user.type(
        screen.getByLabelText(/aws secret access key/i),
        "NEWSECRET",
      );
      await user.clear(screen.getByLabelText(/^acl$/i));
      await user.type(screen.getByLabelText(/^acl$/i), "public-read");
      await user.clear(screen.getByLabelText(/storage class/i));
      await user.type(screen.getByLabelText(/storage class/i), "STANDARD_IA");
      await user.clear(screen.getByLabelText(/encryption method/i));
      await user.type(screen.getByLabelText(/encryption method/i), "aws:kms");

      await user.click(screen.getByRole("button", { name: /save/i }));

      expect(
        await screen.findByText(/publication target edited/i),
      ).toBeInTheDocument();
    });
  });

  describe("Swift optional fields editing", () => {
    it("submits Swift form with all optional fields populated and shows success", async () => {
      renderWithProviders(<EditTargetForm target={swiftTarget} />);

      await user.type(screen.getByLabelText(/^prefix$/i), "packages/");
      await user.clear(screen.getByLabelText(/^tenant$/i));
      await user.type(screen.getByLabelText(/^tenant$/i), "updated-tenant");
      await user.type(screen.getByLabelText(/^tenant id$/i), "tid-999");
      await user.type(screen.getByLabelText(/^domain$/i), "Default");
      await user.type(screen.getByLabelText(/^domain id$/i), "did-999");
      await user.type(screen.getByLabelText(/^tenant domain$/i), "td-999");
      await user.type(screen.getByLabelText(/^tenant domain id$/i), "tdid-999");

      await user.click(screen.getByRole("button", { name: /save/i }));

      expect(
        await screen.findByText(/publication target edited/i),
      ).toBeInTheDocument();
    });
  });

  describe("error handling", () => {
    it("shows an error notification when S3 edit fails", async () => {
      server.use(
        http.patch(`${API_URL_DEB_ARCHIVE}publicationTargets/:id`, () =>
          HttpResponse.json({ message: "edit failed" }, { status: 500 }),
        ),
      );

      renderWithProviders(<EditTargetForm target={s3TargetFull} />);
      await user.click(screen.getByRole("button", { name: /save/i }));

      expect(await screen.findByText("edit failed")).toBeInTheDocument();
    });

    it("shows an error notification when Swift edit fails", async () => {
      server.use(
        http.patch(`${API_URL_DEB_ARCHIVE}publicationTargets/:id`, () =>
          HttpResponse.json({ message: "swift edit failed" }, { status: 500 }),
        ),
      );

      renderWithProviders(<EditTargetForm target={swiftTarget} />);
      await user.click(screen.getByRole("button", { name: /save/i }));

      expect(await screen.findByText("swift edit failed")).toBeInTheDocument();
    });
  });
});
