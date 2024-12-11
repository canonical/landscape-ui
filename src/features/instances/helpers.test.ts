import { instances } from "@/tests/mocks/instance";
import { describe } from "vitest";
import { canRunScripts } from "./helpers";

describe("canRunScripts", () => {
  it("should return true for an Ubuntu instance", async () => {
    assert(canRunScripts(instances[0]));
  });

  it("should return false for a Windows instance", async () => {
    assert(!canRunScripts(instances[10]));
  });
});
