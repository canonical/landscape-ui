import FetchProvider from "@/api/fetch";
import FetchOldProvider from "@/api/fetchOld";
import { API_URL } from "@/constants";
import { useEditInstance } from "@/features/instances";
import { usePackageProfiles } from "@/features/package-profiles";
import { useRepositoryProfiles } from "@/features/repository-profiles";
import server from "@/tests/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import type { ReactNode } from "react";

const renderUpdates = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });

  return renderHook(
    () => ({
      instance: useEditInstance(),
      packageProfile: usePackageProfiles(),
      repositoryProfile: useRepositoryProfiles(),
    }),
    {
      wrapper: ({ children }: { readonly children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          <FetchProvider>
            <FetchOldProvider>{children}</FetchOldProvider>
          </FetchProvider>
        </QueryClientProvider>
      ),
    },
  );
};

beforeEach(() => {
  const echoBody = async ({ request }: { request: Request }) =>
    HttpResponse.json(await request.json());

  server.use(
    http.put(`${API_URL}computers/:id`, echoBody),
    http.put(`${API_URL}packageprofiles/:name`, echoBody),
    http.put(`${API_URL}packageprofiles/:name/constraints/:id`, echoBody),
    http.put(`${API_URL}repositoryprofiles/:name`, echoBody),
  );
});

describe("update payload empty strings", () => {
  it.each(["", "unchanged", "  ", undefined])(
    "normalizes only empty instance strings (%j)",
    async (value) => {
      const { result } = renderUpdates();
      const expected = value === "" ? null : value;

      await act(async () => {
        const response = await result.current.instance.editInstance({
          instanceId: 1,
          title: value,
          access_group: value,
          comment: value,
          tags: [],
        });

        expect(response.data).toEqual(
          value === undefined
            ? { tags: [] }
            : {
                title: expected,
                access_group: expected,
                comment: expected,
                tags: [],
              },
        );
      });
    },
  );

  it.each(["", "unchanged", "  ", undefined])(
    "normalizes only empty package profile strings (%j)",
    async (value) => {
      const { result } = renderUpdates();
      const expected = value === "" ? null : value;

      await act(async () => {
        const response =
          await result.current.packageProfile.editPackageProfileQuery.mutateAsync(
            {
              name: "test",
              title: value,
              description: value,
              tags: [],
              all_computers: false,
            },
          );

        expect(response.data).toEqual(
          value === undefined
            ? { tags: [], all_computers: false }
            : {
                title: expected,
                description: expected,
                tags: [],
                all_computers: false,
              },
        );
      });
    },
  );

  it.each(["", "unchanged", "  "])(
    "normalizes only empty constraint strings (%j)",
    async (value) => {
      const { result } = renderUpdates();

      await act(async () => {
        const response =
          await result.current.packageProfile.editPackageProfileConstraintQuery.mutateAsync(
            {
              name: "test",
              id: 1,
              constraint: "depends",
              package: "bash",
              rule: value,
              version: value,
            },
          );

        expect(response.data).toEqual({
          constraint: "depends",
          package: "bash",
          rule: value === "" ? null : value,
          version: value === "" ? null : value,
        });
      });
    },
  );

  it("preserves empty repository profile strings for clearing", async () => {
    const { result } = renderUpdates();

    await act(async () => {
      const response =
        await result.current.repositoryProfile.editRepositoryProfileQuery.mutateAsync(
          {
            name: "test",
            title: "Test",
            description: "",
            access_group: "global",
            tags: [],
            all_computers: false,
          },
        );

      expect(response.data).toMatchObject({ description: "" });
    });
  });
});
