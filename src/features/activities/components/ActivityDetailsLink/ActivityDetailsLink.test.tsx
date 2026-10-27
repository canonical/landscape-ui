import { API_URL } from "@/constants";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { activities, activityParents } from "@/tests/mocks/activity";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import ActivityDetailsLink from "./ActivityDetailsLink";

describe("ActivityDetailsLink", () => {
  it.each([false, true])(
    "opens details locally with group mode %s and preserves page filters",
    async (isActivityGroup) => {
      const activity = isActivityGroup ? activityParents[0] : activities[0];
      assert(activity);
      server.use(
        http.get(`${API_URL}activities/:id`, () =>
          HttpResponse.json({ ...activity, result_text: null }),
        ),
        http.get(`${API_URL}activities`, () =>
          HttpResponse.json({ results: [], count: 0 }),
        ),
      );
      const user = userEvent.setup();
      renderWithProviders(
        <>
          <ActivityDetailsLink
            activity={activity}
            isActivityGroup={isActivityGroup}
          >
            View activity
          </ActivityDetailsLink>
          <LocationDisplay />
        </>,
        undefined,
        "/profiles?search=retained&sidePath=view&name=profile",
      );
      await user.click(screen.getByRole("button", { name: "View activity" }));
      const heading = await screen.findByRole("heading", {
        name: activity.summary,
      });
      const panel = heading.closest("aside");
      assert(panel);
      await within(panel).findByText("Created at");
      expect(getLocationDisplay()).toHaveTextContent(
        "/profiles?search=retained",
      );
      expect(getLocationDisplay()).not.toHaveTextContent("sidePath");
      expect(getLocationDisplay()).not.toHaveTextContent("/activities");
      if (isActivityGroup) {
        expect(panel).toHaveClass("is-wide");
        expect(
          await within(panel).findByRole("heading", { name: "Activities" }),
        ).toBeInTheDocument();
        expect(
          await within(panel).findByText("There are no activities yet."),
        ).toBeInTheDocument();
      } else {
        expect(panel).not.toHaveClass("is-wide");
        expect(
          within(panel).queryByRole("heading", { name: "Activities" }),
        ).not.toBeInTheDocument();
      }
    },
  );
});
