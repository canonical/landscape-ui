import { API_URL, API_URL_OLD } from "@/constants";
import FetchProvider from "@/api/fetch";
import FetchOldProvider from "@/api/fetchOld";
import useAuth from "@/hooks/useAuth";
import { AuthContext } from "@/context/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { MemoryRouter } from "react-router";
import type { ReactNode } from "react";
import { describe, it, vi } from "vitest";
import server from "@/tests/server";
import { isAction } from "@/tests/server/handlers/_helpers";
import { useRemoveInstancesFromLandscape } from "./useRemoveInstancesFromLandscape";

vi.mock("@/hooks/useAuth");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
  },
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{
          authLoading: false,
          authorized: true,
          hasAccounts: true,
          logout: vi.fn(),
          redirectToExternalUrl: vi.fn(),
          safeRedirect: vi.fn(),
          setUser: vi.fn(),
          user: null,
          isFeatureEnabled: vi.fn(),
        }}
      >
        <FetchOldProvider>
          <FetchProvider>{children}</FetchProvider>
        </FetchOldProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  </MemoryRouter>
);

describe("useRemoveInstancesFromLandscape", () => {
  it("calls computers:delete endpoint when computer-soft-deletion feature is enabled", async () => {
    let newEndpointCalled = false;
    let legacyEndpointCalled = false;

    vi.mocked(useAuth).mockReturnValue({
      isFeatureEnabled: (key: string) => key === "computer-soft-deletion",
    } as never);

    server.use(
      http.post(`${API_URL}computers\\:delete`, async () => {
        newEndpointCalled = true;
        return HttpResponse.json([]);
      }),
      http.get(API_URL_OLD, ({ request }) => {
        if (!isAction(request, "RemoveComputers")) {
          return;
        }

        legacyEndpointCalled = true;
        return HttpResponse.json([]);
      }),
    );

    const { result } = renderHook(() => useRemoveInstancesFromLandscape(), {
      wrapper,
    });

    await result.current.removeInstancesFromLandscape({ computer_ids: [1] });

    await waitFor(() => {
      expect(newEndpointCalled).toBe(true);
      expect(legacyEndpointCalled).toBe(false);
    });
  });

  it("calls RemoveComputers legacy endpoint when computer-soft-deletion feature is disabled", async () => {
    let newEndpointCalled = false;
    let legacyEndpointCalled = false;

    vi.mocked(useAuth).mockReturnValue({
      isFeatureEnabled: (key: string) => key === "not-computer-soft-deletion",
    } as never);

    server.use(
      http.post(`${API_URL}computers\\:delete`, async () => {
        newEndpointCalled = true;
        return HttpResponse.json([]);
      }),
      http.get(API_URL_OLD, ({ request }) => {
        if (!isAction(request, "RemoveComputers")) {
          return;
        }

        legacyEndpointCalled = true;
        return HttpResponse.json([]);
      }),
    );

    const { result } = renderHook(() => useRemoveInstancesFromLandscape(), {
      wrapper,
    });

    await result.current.removeInstancesFromLandscape({ computer_ids: [1] });

    await waitFor(() => {
      expect(newEndpointCalled).toBe(false);
      expect(legacyEndpointCalled).toBe(true);
    });
  });
});
