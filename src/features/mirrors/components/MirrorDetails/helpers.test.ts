import { describe, expect, it } from "vitest";
import type { Mirror } from "@canonical/landscape-openapi";
import { getSourceType, shouldShowAuthentication } from "./helpers";

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
    it.each([
      ["UBUNTU_ARCHIVE", "Ubuntu archive"],
      ["UBUNTU_SNAPSHOTS", "Ubuntu snapshots"],
      ["UBUNTU_PRO", "Ubuntu Pro"],
      ["THIRD_PARTY", "Third party"],
      ["MIRROR_TYPE_UNSPECIFIED", "Third party"],
    ] as const)("maps %s to %s", (mirrorType, label) => {
      expect(getSourceType(mirrorType)).toBe(label);
    });

    it("falls back to Third party when mirrorType is missing", () => {
      expect(getSourceType(undefined)).toBe("Third party");
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

    it.each(["MIRROR_TYPE_UNSPECIFIED", undefined] as const)(
      "shows authentication for legacy mirrors (mirrorType %s) that have a GPG key",
      (mirrorType) => {
        expect(
          shouldShowAuthentication(buildMirror({ mirrorType, gpgKey })),
        ).toBe(true);
      },
    );
  });
});
