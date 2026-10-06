import { API_URL, DEBOUNCE_DELAY } from "@/constants";
import { PATHS } from "@/libs/routes";
import { setEndpointStatus } from "@/tests/controllers/controller";
import server from "@/tests/server";
import { availableSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import type { FC } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGetAvailableSnaps } from "@/features/snaps";
import SnapDropdownSearch from "./SnapDropdownSearch";

const props = {
  selectedItems: [],
  setSelectedItems: vi.fn(),
  setConfirming: vi.fn(),
};

describe("SnapDropdownSearch", () => {
  beforeEach(async () => {
    renderWithProviders(
      <SnapDropdownSearch {...props} />,
      {},
      "/instances/1",
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );
  });

  it("renders snap dropdown search component", () => {
    const searchBox = screen.getByRole("searchbox");
    expect(searchBox).toBeInTheDocument();
  });

  it("debounces rapid typing into a single API request", async () => {
    let requestCount = 0;
    server.use(
      http.get(`${API_URL}computers/:instanceId/snaps/available`, () => {
        requestCount++;
        return HttpResponse.json({ results: availableSnaps });
      }),
    );

    const searchBox = screen.getByRole("searchbox");
    await userEvent.type(searchBox, "testsnap");

      await waitFor(() => {
        expect(requestCount).toBeGreaterThan(0);
      });
      await new Promise((resolve) =>
        setTimeout(resolve, DEBOUNCE_DELAY * 2),
      );
      expect(requestCount).toBe(1);
  });

  it("cancels a pending debounced request when the field is cleared", async () => {
    let requestCount = 0;
    server.use(
      http.get(`${API_URL}computers/:instanceId/snaps/available`, () => {
        requestCount++;
        return HttpResponse.json({ results: availableSnaps });
      }),
    );

    const searchBox = screen.getByRole("searchbox");
    await userEvent.type(searchBox, "testsnap");

    const clearButton = screen.getByRole("button", {
      name: /clear search field/i,
    });
    await userEvent.click(clearButton);

    // Wait past the debounce window to ensure the cancelled request does not fire.
    await new Promise((resolve) => setTimeout(resolve, DEBOUNCE_DELAY * 2));
    expect(requestCount).toBe(0);
  });

  it("closes the dropdown suggestions when the search field is cleared", async () => {
    const searchBox = screen.getByRole("searchbox");
    await userEvent.type(searchBox, "Snap 1");

    expect(await screen.findByRole("listbox")).toBeInTheDocument();

    const clearButton = screen.getByRole("button", {
      name: /clear search field/i,
    });
    await userEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  describe("snap selection flow", () => {
    it("shows matching snaps after searching", async () => {
      const searchBox = screen.getByRole("searchbox");
      await userEvent.type(searchBox, "Snap 1");
      expect(searchBox).toHaveValue("Snap 1");

      const snaps = await screen.findAllByText("Snap 1");
      const matchingSnaps = availableSnaps.filter((snap) =>
        snap.name.includes("Snap 1"),
      );
      //expected length 2, since Snap 1 and Snap 11 should be returned
      expect(snaps).toHaveLength(matchingSnaps.length);
    });

    it("shows error if no matching snap found", async () => {
      const searchBox = screen.getByRole("searchbox");
      await userEvent.type(searchBox, "checking for error");
      expect(searchBox).toHaveValue("checking for error");

      const errorText = await screen.findByText(/No snaps found by/i);
      expect(errorText).toBeVisible();
    });

    it("reopens search dropdown after canceling a snap addition", async () => {
      const searchBox = screen.getByRole("searchbox");
      await userEvent.type(searchBox, "Snap 2");
      expect(searchBox).toHaveValue("Snap 2");

      const snap = await screen.findByText("Snap 2");
      expect(snap).toBeInTheDocument();

      await userEvent.click(snap);
      const form = await screen.findByRole("form");
      expect(form).not.toBeNull();
      const cancelButton = within(form).getByRole("button", {
        name: /cancel/i,
      });

      expect(cancelButton).toBeInTheDocument();

      await userEvent.click(cancelButton);
      const helperText = screen.queryByText(/min 3. characters/i);
      expect(helperText).not.toBeInTheDocument();

      expect(searchBox.focus).toBeTruthy();

      const reappearingSnap = await screen.findByText("Snap 2");
      expect(reappearingSnap).toBeInTheDocument();
    });
  });
});

// `SnapDropdownSearch` gates the request behind `enabled: search.length > 0`,
// so the empty-query guard (`params.query || undefined`) can only be exercised
// by driving the hook directly. This minimal consumer forces the request to
// fire with an empty query and asserts `name_startswith` is omitted.
const EmptyQueryConsumer: FC = () => {
  useGetAvailableSnaps({ instance_id: 1, query: "" });
  return null;
};

describe("Available snaps request params", () => {
  let capturedUrl: URL | undefined;

  beforeEach(() => {
    capturedUrl = undefined;
    setEndpointStatus("default");

    server.use(
      http.get(
        `${API_URL}computers/:instanceId/snaps/available`,
        ({ request }) => {
          capturedUrl = new URL(request.url);
          return HttpResponse.json({
            results: availableSnaps,
          });
        },
      ),
    );
  });

  it("does not send name_startswith when the query is empty", async () => {
    renderWithProviders(<EmptyQueryConsumer />);

    await vi.waitFor(() => {
      expect(capturedUrl).toBeDefined();
    });

    expect(capturedUrl?.searchParams.has("name_startswith")).toBe(false);
  });
});
