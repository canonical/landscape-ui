import { ubuntuCoreInstance } from "@/tests/mocks/instance";
import { describe } from "vitest";
import {
  isInstancePackagesQueryEnabled,
  isLivepatchInfoQueryEnabled,
  isUsnQueryEnabled,
} from "./helpers";

describe("SingleInstanceContainer", () => {
  describe("isInstancePackagesQueryEnabled", () => {
    it("should be true for an ubuntu core instance", () => {
      assert(
        isInstancePackagesQueryEnabled(
          ubuntuCoreInstance,
          undefined,
          undefined,
        ),
      );
    });
  });

  describe("isLivepatchInfoQueryEnabled", () => {
    it("should be true for an ubuntu core instance", () => {
      assert(
        isLivepatchInfoQueryEnabled(ubuntuCoreInstance, undefined, undefined),
      );
    });
  });

  describe("isUsnQueryEnabled", () => {
    it("should be true for an ubuntu core instance", () => {
      assert(isUsnQueryEnabled(ubuntuCoreInstance, undefined, undefined));
    });
  });
});
