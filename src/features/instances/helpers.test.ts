import { instances } from "@/tests/mocks/instance";
import { describe } from "vitest";
import { currentInstanceCan } from "./helpers";

describe("currentInstanceCan", () => {
  describe("runScripts", () => {
    it("should return true for an Ubuntu instance", async () => {
      assert(currentInstanceCan("runScripts", instances[0]));
    });

    it("should return false for a Windows instance", async () => {
      assert(!currentInstanceCan("runScripts", instances[10]));
    });
  });

  it("should return false for an unknown capability", async () => {
    assert(!currentInstanceCan("sayHello" as "runScripts", instances[0]));
  });
});
