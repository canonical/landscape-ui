import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { pageParamsManager } from "@/libs/pageParamsManager";
import useSetDynamicFilterValidation from "./useSetDynamicFilterValidation";

describe("useSetDynamicFilterValidation", () => {
  it("clears a page's allowed values when it unmounts", () => {
    const pageA = renderHook(() => {
      useSetDynamicFilterValidation("sidePath", ["view"]);
    });
    const pageB = renderHook(() => {
      useSetDynamicFilterValidation("sidePath", ["export"]);
    });

    pageB.unmount();

    expect(
      pageParamsManager
        .sanitizeSearchParams(new URLSearchParams("sidePath=view"))
        .has("sidePath"),
    ).toBe(true);

    pageA.unmount();
  });

  it("preserves sidePath when page A is remounted after page B", () => {
    const pageA = renderHook(() => {
      useSetDynamicFilterValidation("sidePath", ["view"]);
    });
    const pageB = renderHook(() => {
      useSetDynamicFilterValidation("sidePath", ["export"]);
    });

    pageB.unmount();
    pageA.unmount();

    const remountedPageA = renderHook(() => {
      useSetDynamicFilterValidation("sidePath", ["view"]);
    });

    expect(
      pageParamsManager
        .sanitizeSearchParams(new URLSearchParams("sidePath=view"))
        .get("sidePath"),
    ).toBe("view");

    remountedPageA.unmount();
    pageParamsManager.clearDynamicAllowedValues("sidePath");
  });
});
