import { ubuntuCoreInstance } from "@/tests/mocks/instance";
import { describe } from "vitest";
import { TAB_LINKS } from "./constants";
import { getTabLinks } from "./helpers";

describe("SingleInstanceTabs", () => {
  describe("getTabLinks", () => {
    it("should use ubuntu tabs for an ubuntu core instance", () => {
      expect(
        getTabLinks({
          activeTabId: "",
          instance: ubuntuCoreInstance,
          onActiveTabChange: () => undefined,
          packageCount: 0,
          packagesLoading: false,
          usnCount: 0,
          usnLoading: false,
          kernelCount: 0,
          kernelLoading: false,
        }),
      ).not.toContain(TAB_LINKS.find((link) => link.id === "tab-link-wsl"));
    });
  });
});
