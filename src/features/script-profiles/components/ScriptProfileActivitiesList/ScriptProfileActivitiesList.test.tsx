import { activities } from "@/tests/mocks/activity";
import { renderWithProviders } from "@/tests/render";
import { describe, it } from "vitest";
import ScriptProfileActivitiesList from "./ScriptProfileActivitiesList";
import { DISPLAY_DATE_FORMAT } from "@/constants";
import moment from "moment";
import { ACTIVITY_STATUSES } from "@/features/activities";

describe("ScriptProfileActivitiesList", () => {
  it("should render", () => {
    renderWithProviders(
      <ScriptProfileActivitiesList activities={activities} />,
    );

    const table = document.querySelector("table");
    expect(table).toBeInTheDocument();
    expect(table).toHaveTextContent("Run");
    expect(table).toHaveTextContent("Status");

    for (const activity of activities) {
      expect(table).toHaveTextContent(
        moment(activity.creation_time).utc().format(DISPLAY_DATE_FORMAT),
      );
      expect(table).toHaveTextContent(
        ACTIVITY_STATUSES[activity.activity_status].label,
      );
    }
  });
});
