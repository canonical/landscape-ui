import { publicationTargets } from "@/tests/mocks/publication-targets";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import FetchProvider from "@/api/fetch";
import AuthProvider from "@/context/auth";
import usePublicationTargets from "../usePublicationTargets";

describe("usePublicationTargets", () => {
  function createWrapper() {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

    return function Wrapper({ children }: { readonly children: ReactNode }) {
      return (
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <FetchProvider>{children}</FetchProvider>
            </AuthProvider>
          </QueryClientProvider>
        </MemoryRouter>
      );
    };
  }

  it("returns createPublicationTargetQuery mutation", () => {
    const { result } = renderHook(() => usePublicationTargets(), {
      wrapper: createWrapper(),
    });

    expect(result.current.createPublicationTargetQuery).toBeDefined();
    expect(result.current.createPublicationTargetQuery.mutateAsync).toBeDefined();
  });

  it("returns editPublicationTargetQuery mutation", () => {
    const { result } = renderHook(() => usePublicationTargets(), {
      wrapper: createWrapper(),
    });

    expect(result.current.editPublicationTargetQuery).toBeDefined();
    expect(result.current.editPublicationTargetQuery.mutateAsync).toBeDefined();
  });

  it("returns removePublicationTargetQuery mutation", () => {
    const { result } = renderHook(() => usePublicationTargets(), {
      wrapper: createWrapper(),
    });

    expect(result.current.removePublicationTargetQuery).toBeDefined();
    expect(result.current.removePublicationTargetQuery.mutateAsync).toBeDefined();
  });

  it("returns getPublicationTargetsQuery function", () => {
    const { result } = renderHook(() => usePublicationTargets(), {
      wrapper: createWrapper(),
    });

    expect(result.current.getPublicationTargetsQuery).toBeDefined();
    expect(typeof result.current.getPublicationTargetsQuery).toBe("function");
  });
});
