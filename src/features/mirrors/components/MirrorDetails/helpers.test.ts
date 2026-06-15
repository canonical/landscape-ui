import { describe, expect, it } from "vitest";
import type { Mirror } from "@canonical/landscape-openapi";
import {
  getSourceType,
  getStrippedUrl,
  shouldShowAuthentication,
} from "./helpers";

const buildMirror = (overrides: Partial<Mirror> = {}): Mirror =>
  ({
    name: "mirrors/test",
    mirrorId: "test",
    displayName: "Test mirror",
    archiveRoot: "https://example.com/repo",
    distribution: "noble",
    components: ["main"],
    architectures: ["amd64"],
    ...overrides,
  }) as Mirror;

describe("MirrorDetails helpers", () => {
  describe("getSourceType", () => {
    it("maps UBUNTU_ARCHIVE to Ubuntu archive", () => {
      expect(getSourceType(buildMirror({ mirrorType: "UBUNTU_ARCHIVE" }))).toBe(
        "Ubuntu archive",
      );
    });

    it("maps UBUNTU_SNAPSHOTS to Ubuntu snapshots", () => {
      expect(
        getSourceType(buildMirror({ mirrorType: "UBUNTU_SNAPSHOTS" })),
      ).toBe("Ubuntu snapshots");
    });

    it("maps UBUNTU_PRO to Ubuntu Pro", () => {
      expect(getSourceType(buildMirror({ mirrorType: "UBUNTU_PRO" }))).toBe(
        "Ubuntu Pro",
      );
    });

    it("maps THIRD_PARTY to Third party", () => {
      expect(getSourceType(buildMirror({ mirrorType: "THIRD_PARTY" }))).toBe(
        "Third party",
      );
    });

    it("infers https://archive.ubuntu.com/ubuntu as Ubuntu archive when mirrorType is missing", () => {
      expect(
        getSourceType(
          buildMirror({ archiveRoot: "https://archive.ubuntu.com/ubuntu" }),
        ),
      ).toBe("Ubuntu archive");
    });

    it("infers https://us.archive.ubuntu.com/ubuntu as Ubuntu archive when mirrorType is missing", () => {
      expect(
        getSourceType(
          buildMirror({ archiveRoot: "https://us.archive.ubuntu.com/ubuntu" }),
        ),
      ).toBe("Ubuntu archive");
    });

    it("infers https://security.ubuntu.com/ubuntu as Ubuntu archive when mirrorType is missing", () => {
      expect(
        getSourceType(
          buildMirror({ archiveRoot: "https://security.ubuntu.com/ubuntu" }),
        ),
      ).toBe("Ubuntu archive");
    });

    it("infers https://snapshot.ubuntu.com/ubuntu/20240101 as Ubuntu snapshots when mirrorType is missing", () => {
      expect(
        getSourceType(
          buildMirror({
            archiveRoot: "https://snapshot.ubuntu.com/ubuntu/20240101",
          }),
        ),
      ).toBe("Ubuntu snapshots");
    });

    it("infers https://bearer:token@esm.ubuntu.com/infra/ubuntu as Ubuntu Pro when mirrorType is missing", () => {
      expect(
        getSourceType(
          buildMirror({
            archiveRoot: "https://bearer:token@esm.ubuntu.com/infra/ubuntu",
          }),
        ),
      ).toBe("Ubuntu Pro");
    });

    it("infers https://example.com/repo as Third party when mirrorType is missing", () => {
      expect(
        getSourceType(buildMirror({ archiveRoot: "https://example.com/repo" })),
      ).toBe("Third party");
    });

    it("infers https://mirror.example.com/archive.ubuntu.com/ubuntu as Third party when mirrorType is missing", () => {
      expect(
        getSourceType(
          buildMirror({
            archiveRoot: "https://mirror.example.com/archive.ubuntu.com/ubuntu",
          }),
        ),
      ).toBe("Third party");
    });

    it("infers from the URL for legacy mirrors (mirrorType MIRROR_TYPE_UNSPECIFIED)", () => {
      expect(
        getSourceType(
          buildMirror({
            mirrorType: "MIRROR_TYPE_UNSPECIFIED",
            archiveRoot: "https://archive.ubuntu.com/ubuntu",
          }),
        ),
      ).toBe("Ubuntu archive");
    });

    it("infers from the URL for legacy mirrors (mirrorType undefined)", () => {
      expect(
        getSourceType(
          buildMirror({
            mirrorType: undefined,
            archiveRoot: "https://archive.ubuntu.com/ubuntu",
          }),
        ),
      ).toBe("Ubuntu archive");
    });
  });

  describe("shouldShowAuthentication", () => {
    const gpgKey = { armor: "ARMOR", fingerprint: "FINGERPRINT" };

    it("shows authentication for third-party mirrors", () => {
      expect(
        shouldShowAuthentication(buildMirror({ mirrorType: "THIRD_PARTY" })),
      ).toBe(true);
    });

    it("hides authentication for Ubuntu mirrors without a GPG key", () => {
      expect(
        shouldShowAuthentication(buildMirror({ mirrorType: "UBUNTU_ARCHIVE" })),
      ).toBe(false);
    });

    it("shows authentication for legacy mirrors (mirrorType MIRROR_TYPE_UNSPECIFIED) that have a GPG key", () => {
      expect(
        shouldShowAuthentication(
          buildMirror({ mirrorType: "MIRROR_TYPE_UNSPECIFIED", gpgKey }),
        ),
      ).toBe(true);
    });

    it("shows authentication for legacy mirrors (mirrorType undefined) that have a GPG key", () => {
      expect(
        shouldShowAuthentication(
          buildMirror({ mirrorType: undefined, gpgKey }),
        ),
      ).toBe(true);
    });

    it("shows authentication for legacy third-party mirrors (mirrorType MIRROR_TYPE_UNSPECIFIED) inferred from the URL", () => {
      expect(
        shouldShowAuthentication(
          buildMirror({
            mirrorType: "MIRROR_TYPE_UNSPECIFIED",
            archiveRoot: "https://example.com/repo",
          }),
        ),
      ).toBe(true);
    });

    it("shows authentication for legacy third-party mirrors (mirrorType undefined) inferred from the URL", () => {
      expect(
        shouldShowAuthentication(
          buildMirror({
            mirrorType: undefined,
            archiveRoot: "https://example.com/repo",
          }),
        ),
      ).toBe(true);
    });

    it("hides authentication for legacy Ubuntu mirrors (mirrorType MIRROR_TYPE_UNSPECIFIED) without a GPG key", () => {
      expect(
        shouldShowAuthentication(
          buildMirror({
            mirrorType: "MIRROR_TYPE_UNSPECIFIED",
            archiveRoot: "https://archive.ubuntu.com/ubuntu",
          }),
        ),
      ).toBe(false);
    });

    it("hides authentication for legacy Ubuntu mirrors (mirrorType undefined) without a GPG key", () => {
      expect(
        shouldShowAuthentication(
          buildMirror({
            mirrorType: undefined,
            archiveRoot: "https://archive.ubuntu.com/ubuntu",
          }),
        ),
      ).toBe(false);
    });
  });

  describe("getStrippedUrl", () => {
    it("strips embedded credentials from an Ubuntu Pro archive root", () => {
      expect(
        getStrippedUrl(
          "https://bearer:s3cr3t-token@esm.ubuntu.com/infra/ubuntu/",
        ),
      ).toBe("https://esm.ubuntu.com/infra/ubuntu/");
    });

    it("leaves a credential-free URL unchanged", () => {
      expect(getStrippedUrl("https://archive.ubuntu.com/ubuntu/")).toBe(
        "https://archive.ubuntu.com/ubuntu/",
      );
    });

    it("does not strip an @ that is part of the path", () => {
      expect(getStrippedUrl("https://example.com/foo@bar/")).toBe(
        "https://example.com/foo@bar/",
      );
    });

    it("returns the input unchanged when it is not a valid absolute URL", () => {
      expect(getStrippedUrl("not a url")).toBe("not a url");
    });
  });
});
