import { act, renderHook, waitFor } from "@testing-library/react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import type { FC, ReactNode } from "react";
import { API_URL } from "@/constants";
import server from "@/tests/server";
import { useCreateStandaloneAccount } from "./useCreateStandaloneAccount";

describe("useCreateStandaloneAccount", () => {
  it("invalidates the account query without refetching during creation", async () => {
    let accountExists = false;
    const fetchAccount = vi.fn(async () => ({ exists: accountExists }));
    server.use(
      http.post(`${API_URL}standalone-account`, () => {
        accountExists = true;
        return HttpResponse.json({}, { status: 201 });
      }),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
    const Wrapper: FC<{ readonly children: ReactNode }> = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(
      () => {
        const { createStandaloneAccount } = useCreateStandaloneAccount();
        const { data } = useQuery({
          queryKey: ["standaloneAccount"],
          queryFn: fetchAccount,
        });
        return { createStandaloneAccount, data };
      },
      { wrapper: Wrapper },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual({ exists: false });
    });
    expect(fetchAccount).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.createStandaloneAccount({
        name: "First Admin",
        email: "admin@example.com",
        password: "Password1234",
      });
    });

    expect(accountExists).toBe(true);
    expect(fetchAccount).toHaveBeenCalledTimes(1);
    expect(
      queryClient.getQueryState(["standaloneAccount"])?.isInvalidated,
    ).toBe(true);
  });
});
