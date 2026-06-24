import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import MirrorsList from "./MirrorsList";
import { mirrors } from "@/tests/mocks/mirrors";
import moment from "moment";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { screen } from "@testing-library/react";
import { NO_DATA_TEXT } from "@/components/layout/NoData";

describe("MirrorsList", () => {
  it("renders with data", () => {
    const mirror = mirrors.find(
      ({ name, lastDownloadDate }) => name && lastDownloadDate,
    );

    assert(mirror);

    renderWithProviders(<MirrorsList mirrors={[mirror]} />);

    expect(
      screen.getByText(
        moment(mirror.lastDownloadDate).format(DISPLAY_DATE_TIME_FORMAT),
      ),
    ).toBeInTheDocument();
  });

  it("renders without data", () => {
    const mirror = {
      ...mirrors[0],
      name: undefined,
      lastDownloadDate: undefined,
    };

    renderWithProviders(<MirrorsList mirrors={[mirror]} />);

    expect(screen.getAllByText(NO_DATA_TEXT)).toHaveLength(4);
  });
});
