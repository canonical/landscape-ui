import type { PageParams } from "@/libs/pageParamsManager";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, useLocation } from "react-router";
import { describe, expect, it } from "vitest";
import usePageParams from "./usePageParams";

const renderPageParams = (url: string) => {
  const wrapper = ({ children }: { readonly children: ReactNode }) => (
    <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
  );

  const { result } = renderHook(
    () => ({ pageParams: usePageParams(), location: useLocation() }),
    { wrapper },
  );

  const set = (params: Partial<PageParams>) => {
    act(() => {
      result.current.pageParams.setPageParams(params);
    });
  };

  const search = () => decodeURIComponent(result.current.location.search);

  return { result, set, search };
};

describe("usePageParams tab slots", () => {
  it("exposes the page tab and slot values separately", () => {
    const { result } = renderPageParams(
      "/scripts?tab=profiles&tab=panel:code",
    );

    expect(result.current.pageParams.tab).toBe("profiles");
    expect(result.current.pageParams.tabSlots).toEqual({ panel: "code" });
  });

  it("merges slot changes without touching other params", () => {
    const { set, search } = renderPageParams(
      "/scripts?tab=profiles&tab=panel:code&search=x",
    );

    set({ tabSlots: { upgrades: "packages" } });
    expect(search()).toBe(
      "?tab=profiles&tab=panel:code&tab=upgrades:packages&search=x",
    );

    set({ tabSlots: { panel: "" } });
    expect(search()).toBe("?tab=profiles&tab=upgrades:packages&search=x");
  });

  it("keeps slot values when other params change", () => {
    const { set, search } = renderPageParams(
      "/scripts?tab=profiles&tab=upgrades:packages",
    );

    set({ search: "x" });

    expect(search()).toBe("?tab=profiles&tab=upgrades:packages&search=x");
  });

  it("resets the URL when the page tab changes", () => {
    const { set, search } = renderPageParams(
      "/scripts?tab=scripts&tab=panel:code&search=x",
    );

    set({ tab: "profiles" });

    expect(search()).toBe("?tab=profiles");
  });

  it("keeps slot values when the page tab is set to its current value", () => {
    const { set, search } = renderPageParams(
      "/scripts?tab=scripts&tab=upgrades:packages",
    );

    set({ tab: "scripts", search: "x" });

    expect(search()).toBe("?tab=scripts&tab=upgrades:packages&search=x");
  });

  it("resets the panel slot when the side path changes", () => {
    const { result, set, search } = renderPageParams(
      "/scripts?tab=panel:code&tab=upgrades:packages&sidePath=view&name=1",
    );

    set({ sidePath: ["view", "edit"] });
    expect(search()).toBe(
      "?tab=upgrades:packages&sidePath=view,edit&name=1",
    );

    set({ sidePath: ["view"], tabSlots: { panel: "history" } });
    expect(search()).toBe(
      "?tab=panel:history&tab=upgrades:packages&sidePath=view&name=1",
    );

    act(() => {
      result.current.pageParams.closeSidePanel();
    });
    expect(search()).toBe("?tab=upgrades:packages");
  });
});
