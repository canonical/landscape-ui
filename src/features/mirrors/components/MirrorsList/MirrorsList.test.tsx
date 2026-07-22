import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import MirrorsList from "./MirrorsList";
import { mirrors } from "@/tests/mocks/mirrors";
import date from "@/libs/date";
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
        date(mirror.lastDownloadDate).format(DISPLAY_DATE_TIME_FORMAT),
      ),
    ).toBeInTheDocument();
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

  describe("pagination", () => {
    it("shows only the first page of mirrors when there are more than the page size", () => {
      renderWithProviders(<MirrorsList mirrors={[...mirrors]} />);

      const lastMirror = mirrors.at(-1);
      assert(lastMirror);

      expect(screen.getByText(mirrors[0].displayName)).toBeInTheDocument();
      expect(
        screen.queryByText(lastMirror.displayName),
      ).not.toBeInTheDocument();
    });

    it("renders pagination controls when mirrors exceed page size", () => {
      renderWithProviders(<MirrorsList mirrors={[...mirrors]} />);

      expect(
        screen.getByRole("navigation", { name: /pagination/i }),
      ).toBeInTheDocument();
    });

    it("does not render pagination controls when all mirrors fit on one page", () => {
      renderWithProviders(<MirrorsList mirrors={mirrors.slice(0, 3)} />);

      expect(
        screen.queryByRole("navigation", { name: /pagination/i }),
      ).not.toBeInTheDocument();
    });
  });
});
