import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import MirrorsList from "./MirrorsList";
import { mirrors } from "@/tests/mocks/mirrors";
import moment from "moment";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { screen } from "@testing-library/react";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import type { Mirror } from "@canonical/landscape-openapi";

describe("MirrorsList", () => {
  it("renders with data", async () => {
    const mirror = (mirrors as Mirror[]).find(
      ({ name, lastOperation, lastDownloadDate }) =>
        name &&
        lastOperation === "operations/ssss-cccc-dddd" &&
        lastDownloadDate,
    );

    assert(mirror);

    renderWithProviders(<MirrorsList mirrors={[mirror]} />);

    expect(
      screen.getByText(
        moment(mirror.lastDownloadDate).format(DISPLAY_DATE_TIME_FORMAT),
      ),
    ).toBeInTheDocument();
    expect(await screen.findByText("Updated")).toBeInTheDocument();
  });

  it("renders without data", () => {
    const mirror = {
      ...mirrors[0],
      name: undefined,
      lastDownloadDate: undefined,
      distribution: undefined,
    };

    renderWithProviders(<MirrorsList mirrors={[mirror]} />);

    expect(screen.getAllByText(NO_DATA_TEXT)).toHaveLength(5);
  });

  it("renders status cell for no operation", () => {
    const mirror = {
      ...mirrors[0],
      lastOperation: undefined,
    };

    renderWithProviders(<MirrorsList mirrors={[mirror]} />);

    expect(screen.getByText("Not yet updated")).toBeInTheDocument();
  });
});
