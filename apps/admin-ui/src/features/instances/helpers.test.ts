import {
  ubuntuCoreInstance,
  ubuntuInstance,
  windowsInstance,
} from "@/tests/mocks/instance";
import { describe } from "vitest";
import { currentInstanceCan, currentInstanceIs } from "./helpers";

describe("currentInstanceCan", () => {
  describe("runScripts", () => {
    it("should return true for an Ubuntu instance", async () => {
      assert(currentInstanceCan("runScripts", ubuntuInstance));
    });

    it("should return true for an Ubuntu Core instance", async () => {
      assert(currentInstanceCan("runScripts", ubuntuCoreInstance));
    });

    it("should return false for a Windows instance", async () => {
      assert(!currentInstanceCan("runScripts", windowsInstance));
    });
  });

  it("should return false for an unknown capability", async () => {
    assert(!currentInstanceCan("sayHello" as "runScripts", ubuntuInstance));
  });
});

describe("currentInstanceIs", () => {
  describe("ubuntu", () => {
    it("should return true for an Ubuntu instance", async () => {
      assert(currentInstanceIs("ubuntu", ubuntuInstance));
    });

    it("should return true for an Ubuntu Core instance", async () => {
      assert(currentInstanceIs("ubuntu", ubuntuCoreInstance));
    });

    it("should return false for a Windows instance", async () => {
      assert(!currentInstanceIs("ubuntu", windowsInstance));
    });
  });

  it("should return false for an unknown distribution", async () => {
    assert(!currentInstanceIs("mac" as "ubuntu", ubuntuInstance));
  });
});
