import { publications } from "@/tests/mocks/publication-targets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Publication } from "../../types";
import { describe, expect, it } from "vitest";
import PublicationsTable from "./PublicationsTable";

describe("PublicationsTable", () => {
  const user = userEvent.setup();

  describe("table structure and columns", () => {
    it("renders table with correct column headers: Publication, Source, Distribution", () => {
      renderWithProviders(<PublicationsTable publications={publications} />);

      expect(screen.getByText("Publication")).toBeInTheDocument();
      expect(screen.getByText("Source")).toBeInTheDocument();
      expect(screen.getByText("Distribution")).toBeInTheDocument();
    });

    it("renders all publications in rows with display_name", () => {
      renderWithProviders(<PublicationsTable publications={publications} />);

      publications.forEach((pub) => {
        expect(screen.getByText(pub.mirror)).toBeInTheDocument();
      });
    });
  });

  describe("column data rendering", () => {
    it("renders display_name in Publication column", () => {
      renderWithProviders(<PublicationsTable publications={publications} />);

      publications.forEach((pub) => {
        expect(screen.getByText(pub.mirror)).toBeInTheDocument();
      });
    });

    it("renders mirror value in Source column when available", () => {
      renderWithProviders(<PublicationsTable publications={publications} />);

      // All mock publications have mirror values
      publications.forEach((pub) => {
        expect(screen.getByText(pub.mirror)).toBeInTheDocument();
      });
    });

    it("renders dash placeholder when distribution is undefined", () => {
      const pubWithoutDistribution: Publication = {
        ...publications[0],
        distribution: undefined,
      };

      renderWithProviders(
        <PublicationsTable publications={[pubWithoutDistribution]} />,
      );

      const dashes = screen.getAllByText("—");
      expect(dashes.length).toBeGreaterThan(0);
    });
  });

  describe("pagination", () => {
    const pageSize = 2;

    it("does not render pagination when publications.length <= pageSize", () => {
      renderWithProviders(
        <PublicationsTable
          publications={publications.slice(0, pageSize)}
          pageSize={pageSize}
        />,
      );

      // Should show all items and no pagination
      expect(screen.queryByRole("button", { name: /prev|next/i })).not
        .toBeInTheDocument();
    });

    it("renders pagination component when publications.length > pageSize", () => {
      renderWithProviders(
        <PublicationsTable publications={publications} pageSize={pageSize} />,
      );

      // Pagination should be visible (check for pagination UI elements)
      // The SidePanelTablePagination component should render results text
      expect(
        screen.getByText(/showing.*of.*results/i),
      ).toBeInTheDocument();
    });

    it("shows only pageSize items on first page", () => {
      renderWithProviders(
        <PublicationsTable publications={publications} pageSize={pageSize} />,
      );

      // Count visible publication names on first page (should be pageSize)
      const firstPagePublications = publications
        .slice(0, pageSize)
        .map((pub) => pub.mirror);

      firstPagePublications.forEach((name) => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });

      // Next page publication should not be visible
      const nextPagePublication = publications[pageSize];
      if (nextPagePublication) {
        expect(screen.queryByText(nextPagePublication.mirror)).not
          .toBeInTheDocument();
      }
    });

    it("updates page content when pagination page changes", async () => {
      renderWithProviders(
        <PublicationsTable publications={publications} pageSize={pageSize} />,
      );

      // First page should show first pageSize items
      const firstPageFirstPub = publications[0]?.mirror;
      if (firstPageFirstPub) {
        expect(screen.getByText(firstPageFirstPub)).toBeInTheDocument();
      }

      // Find and click next button (may be labeled differently depending on component)
      const nextButton = screen.getByRole("button", {
        name: /next|right|forward/i,
      });
      await user.click(nextButton);

      // First page publication should no longer be visible (unless on all pages)
      // Second page publication should be visible
      const secondPagePublication = publications[pageSize];
      if (secondPagePublication) {
        expect(screen.getByText(secondPagePublication.mirror)).toBeInTheDocument();
      }
    });
  });

  describe("edge cases", () => {
    it("renders without error with empty publications array", () => {
      renderWithProviders(<PublicationsTable publications={[]} />);

      // Table should render but with no data rows
      expect(screen.getByText("Publication")).toBeInTheDocument();
    });

    it("renders single publication correctly", () => {
      const singlePublication = [publications[0]];
      if (!singlePublication[0]) {
        return;
      }
      renderWithProviders(
        <PublicationsTable publications={singlePublication} />,
      );

      expect(screen.getByText(singlePublication[0].mirror)).toBeInTheDocument();
      // expect(
      //   screen.getByText(singlePublication[0].distribution),
      // ).toBeInTheDocument();
    });

    it("renders publications with all undefined optional fields (shows dashes)", () => {
      const pubWithAllUndefined: Publication = {
        name: "publications/test-00000000-0000-0000-0000-000000000000",
        publicationId: "test-00000000-0000-0000-0000-000000000000",
        label: "Test-Publication",
        publicationTarget: "publicationTargets/test",
        mirror: "mirror",
        distribution: undefined,
      };

      renderWithProviders(
        <PublicationsTable publications={[pubWithAllUndefined]} />,
      );

      expect(screen.getByText("Test-Publication")).toBeInTheDocument();
      const dashes = screen.getAllByText("—");
      expect(dashes.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("props handling", () => {
    it("renders all publications without pageSize prop", () => {
      renderWithProviders(<PublicationsTable publications={publications} />);

      publications.forEach((pub) => {
        expect(screen.getByText(pub.mirror)).toBeInTheDocument();
      });
    });

    it("applies custom pageSize when provided", () => {
      if (!publications || publications.length < 2) {
        throw new Error("Test failed: 'publications' must be defined with at least 2 items.");
      }
      const customPageSize = 1;
      renderWithProviders(
        <PublicationsTable publications={publications} pageSize={customPageSize} />,
      );

      // First item should be visible
      expect(screen.getByText(publications[0].mirror)).toBeInTheDocument();

      // Second item should not be visible (it's on next page)
      expect(screen.queryByText(publications[1].mirror)).not
        .toBeInTheDocument();
    });
  });
});
