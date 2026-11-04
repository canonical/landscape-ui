import FetchProvider from "@/api/fetch";
import { API_URL } from "@/constants";
import server from "@/tests/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import type { ReactNode } from "react";
import { useEditUser } from "./useEditUser";

it("preserves empty user strings for clearing", async () => {
  server.use(
    http.post(`${API_URL}users:edit`, async ({ request }) =>
      HttpResponse.json(await request.json()),
    ),
  );
  const queryClient = new QueryClient();
  const { result } = renderHook(() => useEditUser(), {
    wrapper: ({ children }: { readonly children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <FetchProvider>{children}</FetchProvider>
      </QueryClientProvider>
    ),
  });
  const payload = {
    computer_ids: [1],
    username: "test",
    name: "",
    location: "",
    home_phone: "",
    work_phone: "",
  };

  await act(async () => {
    const response = await result.current.editUser(payload);

    expect(response.data).toEqual(payload);
  });
});
