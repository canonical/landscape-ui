import { publicationTargets } from "@/tests/mocks/publicationTargets";
import { publications } from "@/tests/mocks/publications";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router";
import { describe, expect, it } from "vitest";
import TargetDetails from "./TargetDetails";
import { NO_DATA_TEXT } from "@/components/layout/NoData/constants";
import { LINK_METHOD_OPTIONS } from "../../constants";
import type { PublicationTarget } from "@canonical/landscape-openapi";

const [targetWithPublications, , swiftMock, filesystemMock] =
  publicationTargets;

const targetWithoutPublications = publicationTargets.find(
  (target) =>
    !publications.some(
      ({ publicationTarget }) => publicationTarget === target.name,
    ),
);

const [firstPublication] = publications;

assert(targetWithPublications, "Expected target detail test fixture");
assert(swiftMock, "Expected target detail test fixture");
assert(filesystemMock, "Expected target detail test fixture");
assert(firstPublication, "Expected target detail test fixture");
assert(targetWithPublications.s3, "Expected S3 publication target fixture");
assert(swiftMock.swift, "Expected Swift publication target fixture");
assert(
  filesystemMock.filesystem,
  "Expected filesystem publication target fixture",
);
assert(targetWithoutPublications, "Expected publication target test fixture");

const s3WithPubs = targetWithPublications.s3;
const swiftTarget = swiftMock.swift;
const filesystemTarget = filesystemMock.filesystem;
const firstPubName = firstPublication.displayName;

const LocationDisplay = () => {
  const { search } = useLocation();
  return <div data-testid="location">{search}</div>;
};

const renderTarget = async (target: PublicationTarget) => {
  const result = renderWithProviders(
    <TargetDetails />,
    undefined,
    `/?name=${target.publicationTargetId}`,
  );
  await screen.findByRole("heading", { name: target.displayName });
  return result;
};

describe("TargetDetails", () => {
  const user = userEvent.setup();

  describe("action buttons", () => {
    it("renders Edit and Remove buttons", async () => {
      await renderTarget(targetWithPublications);

      expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /remove/i }),
      ).toBeInTheDocument();
    });

    it("sets sidePath=edit in URL when Edit is clicked", async () => {
      renderWithProviders(
        <>
          <TargetDetails />
          <LocationDisplay />
        </>,
        undefined,
        `/?name=${targetWithPublications.publicationTargetId}`,
      );
      await screen.findByRole("heading", {
        name: targetWithPublications.displayName,
      });

      await user.click(screen.getByRole("button", { name: /edit/i }));

      expect(screen.getByTestId("location")).toHaveTextContent("sidePath=edit");
    });

    it("opens the remove confirmation modal when Remove is clicked", async () => {
      await renderTarget(targetWithPublications);

      await user.click(screen.getByRole("button", { name: /remove/i }));

      expect(
        screen.getByRole("dialog", {
          name: `Remove ${targetWithPublications.displayName}`,
        }),
      ).toBeInTheDocument();
    });
  });

  describe("S3 target details", () => {
    it("renders the DETAILS heading", async () => {
      await renderTarget(targetWithPublications);

      expect(screen.getByText("Details")).toBeInTheDocument();
    });

    it("renders the target displayName", async () => {
      await renderTarget(targetWithPublications);

      expect(
        screen.getByRole("heading", {
          level: 2,
          name: targetWithPublications.displayName,
        }),
      ).toBeInTheDocument();
    });

    it("renders all S3 fields", async () => {
      const { container } = await renderTarget(targetWithPublications);

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
  });

  describe("Used In section", () => {
    it("shows publications when target has publications", async () => {
      await renderTarget(targetWithPublications);

      expect(await screen.findByText(firstPubName)).toBeInTheDocument();
    });

    it("shows empty table when target has no publications", async () => {
      await renderTarget(targetWithoutPublications);

      expect(
        await screen.findByText(/no associated publications were found/i),
      ).toBeInTheDocument();
    });
  });

  describe("Swift target", () => {
    it("renders container and authUrl info items", async () => {
      const { container } = await renderTarget(swiftMock);

      expect(container).toHaveInfoItem("Container", swiftTarget.container);
      expect(container).toHaveInfoItem("Auth URL", swiftTarget.authUrl);
    });

    it("renders optional tenant field when present", async () => {
      const { container } = await renderTarget(swiftMock);

      expect(container).toHaveInfoItem("Tenant", swiftTarget.tenant ?? "");
    });

    it("does not render S3-specific fields", async () => {
      const { container } = await renderTarget(swiftMock);

      expect(container.textContent).not.toContain("Region");
      expect(container.textContent).not.toContain("Bucket Name");
    });
  });

  describe("Filesystem target", () => {
    it("renders path and link method info items", async () => {
      const { container } = await renderTarget(filesystemMock);

      expect(container).toHaveInfoItem("Path", filesystemTarget.path);
      expect(container).toHaveInfoItem(
        "Link method",
        LINK_METHOD_OPTIONS.find((o) => o.value === filesystemTarget.linkMethod)
          ?.label ?? NO_DATA_TEXT,
      );
    });

    it("does not render S3-specific fields", async () => {
      const { container } = await renderTarget(filesystemMock);

      expect(container.textContent).not.toContain("Region");
      expect(container.textContent).not.toContain("Bucket Name");
    });
  });
});
