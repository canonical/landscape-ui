import { act, render, renderHook, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import usePageParams from "@/hooks/usePageParams";
import { pageParamsManager } from "@/libs/pageParamsManager";
import useSetDynamicFilterValidation from "./useSetDynamicFilterValidation";

// Call order matters: usePageParams() sanitizes before useSetDynamicFilterValidation re-registers (the bug geometry).
const ProfilesPage = () => {
  const { sidePath, name } = usePageParams();
  useSetDynamicFilterValidation("sidePath", ["add", "edit", "view"]);

  return (
    <div data-testid="profiles-state">{`${sidePath.join(",")}|${name}`}</div>
  );
};

const InstancesPage = () => {
  usePageParams();
  useSetDynamicFilterValidation("sidePath", ["export"]);

  return <div>Instances</div>;
};

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
    // then page A is still mounted, so its rule must be back in force: junk rejected
    expect(
      pageParamsManager
        .sanitizeSearchParams(new URLSearchParams("sidePath=garbage"))
        .has("sidePath"),
    ).toBe(false);

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

  it("restores the still-mounted page's rule when an overlapping registrar unmounts", () => {
    // given a main table and a co-mounted modal table registering the same param
    const mainTable = renderHook(() => {
      useSetDynamicFilterValidation("currentPage", ["1", "2", "3"]);
    });
    const modalTable = renderHook(() => {
      useSetDynamicFilterValidation("currentPage", ["1"]);
    });

    // when the modal closes, the main table's rule is back in force
    modalTable.unmount();

    expect(
      pageParamsManager
        .sanitizeSearchParams(new URLSearchParams("currentPage=3"))
        .get("currentPage"),
    ).toBe("3");
    expect(
      pageParamsManager
        .sanitizeSearchParams(new URLSearchParams("currentPage=9"))
        .has("currentPage"),
    ).toBe(false);

    // when the main table also unmounts, the restriction is gone entirely
    mainTable.unmount();
    expect(
      pageParamsManager
        .sanitizeSearchParams(new URLSearchParams("currentPage=9"))
        .get("currentPage"),
    ).toBe("9");
  });
});

describe("integration: navigating away and clicking browser Back", () => {
  afterEach(() => {
    pageParamsManager.clearDynamicAllowedValues("sidePath");
  });

  it("preserves sidePath=view so the profile panel remounts", async () => {
    pageParamsManager.clearDynamicAllowedValues("sidePath");

    const router = createMemoryRouter(
      [
        { path: "/profiles/wsl", element: <ProfilesPage /> },
        { path: "/instances", element: <InstancesPage /> },
      ],
      { initialEntries: ["/profiles/wsl?sidePath=view&name=profile-1"] },
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("profiles-state").textContent).toBe(
      "view|profile-1",
    );

    // "All instances" link: InstancesPage's allow-list overwrites the singleton
    await act(async () => {
      await router.navigate("/instances");
    });

    // Browser Back: ProfilesPage remounts and its sanitize effect runs before
    // it re-registers its allow-list, so the stale list must already be gone
    await act(async () => {
      await router.navigate(-1);
    });

    expect(router.state.location.search).toContain("sidePath=view");
    expect(router.state.location.search).toContain("name=profile-1");
    expect(screen.getByTestId("profiles-state").textContent).toBe(
      "view|profile-1",
    );
  });
});
