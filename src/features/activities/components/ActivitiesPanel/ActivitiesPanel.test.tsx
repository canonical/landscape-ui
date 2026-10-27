import { API_URL } from "@/constants";
import sidePanelClasses from "@/components/layout/SidePanel/SidePanel.module.scss";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { activities } from "@/tests/mocks/activity";
import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import ActivitiesPanel from "./ActivitiesPanel";

const children = Array.from({ length: 21 }, (_, index) => ({
  ...activities[1],
  id: index + 100,
  summary: `Overview child ${index + 1}`,
  activity_status: "unapproved" as const,
}));

describe("ActivitiesPanel", () => {
  afterEach(resetScreenSize);

  it("paginates and filters children locally and preserves list state while small details are open", async () => {
    setScreenSize("xxl");
    const requests = vi.fn();
    server.use(
      http.get(`${API_URL}activities`, ({ request }) => {
        const { searchParams } = new URL(request.url);
        requests(Object.fromEntries(searchParams));
        return HttpResponse.json(
          generatePaginatedResponse({
            data: children,
            limit: Number(searchParams.get("limit")),
            offset: Number(searchParams.get("offset")),
          }),
        );
      }),
      http.get(`${API_URL}activities/:id`, ({ params }) =>
        HttpResponse.json(children.find(({ id }) => id === Number(params.id))),
      ),
    );
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <ActivitiesPanel initialStatus="unapproved" />
        <LocationDisplay />
      </>,
      undefined,
      "/overview?query=underlying-page",
    );

    await screen.findByRole("columnheader", { name: "Instance" });
    expect(screen.getByText("Status: Unapproved")).toBeInTheDocument();
    expect(requests).toHaveBeenLastCalledWith({
      query: "status:unapproved",
      limit: "20",
      offset: "0",
    });
    await user.type(screen.getByRole("searchbox"), "computer:id:6");
    await user.click(screen.getByRole("button", { name: "Search" }));
    await waitFor(() => {
      expect(requests).toHaveBeenLastCalledWith({
        query: "computer:id:6 status:unapproved",
        limit: "20",
        offset: "0",
      });
    });
    await user.click(screen.getByRole("button", { name: "Next page" }));
    const activity = children.at(-1);
    assert(activity);
    await user.click(
      await screen.findByRole("checkbox", { name: activity.summary }),
    );
    await user.click(screen.getByRole("button", { name: activity.summary }));
    const heading = await screen.findByRole("heading", {
      name: activity.summary,
    });
    const panel = heading.closest("aside");
    assert(panel);
    expect(panel).not.toHaveClass(sidePanelClasses.large);
    expect(panel).not.toHaveClass(sidePanelClasses.medium);
    expect(panel).not.toHaveClass("is-wide");
    await within(panel).findByText("Created at");
    await user.click(within(panel).getByRole("button", { name: "Close" }));

    expect(
      screen.getByRole("checkbox", { name: activity.summary }),
    ).toBeChecked();
    expect(screen.getByRole("searchbox")).toHaveValue("computer:id:6");
    expect(requests).toHaveBeenLastCalledWith({
      query: "computer:id:6 status:unapproved",
      limit: "20",
      offset: "20",
    });
    expect(getLocationDisplay()).toHaveTextContent(
      "/overview?query=underlying-page",
    );

    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    await waitFor(() => {
      expect(requests).toHaveBeenLastCalledWith({
        query: "computer:id:6",
        limit: "20",
        offset: "0",
      });
    });
    await user.click(
      screen.getByRole("button", { name: "Clear search field" }),
    );
    await waitFor(() => {
      expect(requests).toHaveBeenLastCalledWith({
        query: "",
        limit: "20",
        offset: "0",
      });
    });
  });
});
