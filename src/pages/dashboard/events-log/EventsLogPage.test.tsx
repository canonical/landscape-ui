import { API_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EventsLogPage from "./EventsLogPage";
import { eventsLog } from "@/tests/mocks/eventsLog";

describe("EventsLogPage", () => {
  it("renders empty state", async () => {
    setEndpointStatus("empty");
    renderWithProviders(<EventsLogPage />);

    const emptyStateTitle = await screen.findByText(
      "No events found according to your search parameters.",
    );
    expect(emptyStateTitle).toBeInTheDocument();
  });

  it("renders filtered list of events", async () => {
    renderWithProviders(<EventsLogPage />);

    const searchBox = await screen.findByRole("searchbox");
    await userEvent.type(searchBox, `${eventsLog[0].message}{enter}`);

    const messageCell = await screen.findByText(eventsLog[0].message);
    expect(messageCell).toBeInTheDocument();
  });
});

describe("EventsLog request params", () => {
  let capturedUrl: URL | undefined;

  beforeEach(() => {
    capturedUrl = undefined;
    setEndpointStatus("default");

    server.use(
      http.get(`${API_URL}events`, ({ request }) => {
        capturedUrl = new URL(request.url);
        return HttpResponse.json({
          results: eventsLog,
          count: eventsLog.length,
          next: null,
          previous: null,
        });
      }),
    );
  });

  it("omits search entirely when the page param is empty", async () => {
    renderWithProviders(<EventsLogPage />, undefined, "/events");

    await vi.waitFor(() => {
      expect(capturedUrl).toBeDefined();
    });

    expect(capturedUrl?.searchParams.has("search")).toBe(false);
  });
});
