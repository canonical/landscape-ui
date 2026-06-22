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
    ] as const)("maps %s to %s", (mirrorType, label) => {
      expect(getSourceType(buildMirror({ mirrorType }))).toBe(label);
    });

    it.each([
      ["https://archive.ubuntu.com/ubuntu", "Ubuntu archive"],
      ["https://us.archive.ubuntu.com/ubuntu", "Ubuntu archive"],
      ["https://security.ubuntu.com/ubuntu", "Ubuntu archive"],
      ["https://snapshot.ubuntu.com/ubuntu/20240101", "Ubuntu snapshots"],
      ["https://bearer:token@esm.ubuntu.com/infra/ubuntu", "Ubuntu Pro"],
      ["https://example.com/repo", "Third party"],
      ["https://mirror.example.com/archive.ubuntu.com/ubuntu", "Third party"],
    ] as const)(
      "infers %s as %s when mirrorType is missing",
      (archiveRoot, label) => {
        expect(getSourceType(buildMirror({ archiveRoot }))).toBe(label);
      },
    );

    it.each(["MIRROR_TYPE_UNSPECIFIED", undefined] as const)(
      "infers from the URL for legacy mirrors (mirrorType %s)",
      (mirrorType) => {
        expect(
          getSourceType(
            buildMirror({
              mirrorType,
              archiveRoot: "https://archive.ubuntu.com/ubuntu",
            }),
          ),
        ).toBe("Ubuntu archive");
      },
    );
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

    it.each(["MIRROR_TYPE_UNSPECIFIED", undefined] as const)(
      "shows authentication for legacy third-party mirrors (mirrorType %s) inferred from the URL",
      (mirrorType) => {
        expect(
          shouldShowAuthentication(
            buildMirror({
              mirrorType,
              archiveRoot: "https://example.com/repo",
            }),
          ),
        ).toBe(true);
      },
    );

    it.each(["MIRROR_TYPE_UNSPECIFIED", undefined] as const)(
      "hides authentication for legacy Ubuntu mirrors (mirrorType %s) without a GPG key",
      (mirrorType) => {
        expect(
          shouldShowAuthentication(
            buildMirror({
              mirrorType,
              archiveRoot: "https://archive.ubuntu.com/ubuntu",
            }),
          ),
        ).toBe(false);
      },
    );
  });
});
