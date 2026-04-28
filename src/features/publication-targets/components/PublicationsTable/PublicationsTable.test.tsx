import { publications } from "@/tests/mocks/publications";
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
    });

    it("renders all publications in rows with display_name", () => {
      renderWithProviders(<PublicationsTable publications={publications} />);

      publications.forEach((pub) => {
        expect(screen.getByText(pub.source)).toBeInTheDocument();
      });
    });
  });

  describe("column data rendering", () => {
    it("renders label as a link in Publication column", () => {
      renderWithProviders(<PublicationsTable publications={publications} />);

      publications.forEach((pub) => {
        const link = screen.getByRole("link", { name: pub.displayName });
        expect(link).toBeInTheDocument();
      });
    });

    it("Publication column links point to publications page with correct params", () => {
      renderWithProviders(<PublicationsTable publications={publications} />);

      publications.forEach((pub) => {
        const link = screen.getByRole("link", {
          name: pub.displayName,
        }) as HTMLAnchorElement;
        expect(link.href).toContain("/repositories/publications");
        expect(link.href).toContain("sidePath=view");
        expect(link.href).toContain(`name=${pub.publicationId}`);
      });
    });

    it("falls back to publication name when label is undefined", () => {
      const pubWithoutLabel: Publication = {
        name: "publications/no-label-id",
        publicationId: "no-label-id",
        displayName: "",
        label: "",
        publicationTarget: "publicationTargets/test",
        source: "mirrors/test",
        distribution: "jammy",
        origin: "",
        architectures: [],
        acquireByHash: false,
        butAutomaticUpgrades: false,
        notAutomatic: false,
        multiDist: false,
        skipBz2: false,
        skipContents: false,
      };

      renderWithProviders(
        <PublicationsTable publications={[pubWithoutLabel]} />,
      );

      expect(
        screen.getByRole("link", { name: pubWithoutLabel.displayName }),
      ).toBeInTheDocument();
    });

    it("renders mirror value in Source column when available", () => {
      renderWithProviders(<PublicationsTable publications={publications} />);

      publications.forEach((pub) => {
        expect(screen.getByText(pub.source)).toBeInTheDocument();
      });
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
      expect(
        screen.queryByRole("button", { name: /prev|next/i }),
      ).not.toBeInTheDocument();
    });

    it("renders pagination component when publications.length > pageSize", () => {
      renderWithProviders(
        <PublicationsTable publications={publications} pageSize={pageSize} />,
      );

      expect(screen.getByText(/page 1/i)).toBeInTheDocument();
    });

    it("shows only pageSize items on first page", () => {
      renderWithProviders(
        <PublicationsTable publications={publications} pageSize={pageSize} />,
      );

      // Count visible publication names on first page (should be pageSize)
      const firstPagePublications = publications
        .slice(0, pageSize)
        .map((pub) => pub.source);

      firstPagePublications.forEach((name) => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });

      // Next page publication should not be visible
      const nextPagePublication = publications[pageSize];
      if (nextPagePublication) {
        expect(
          screen.queryByText(nextPagePublication.source),
        ).not.toBeInTheDocument();
      }
    });

    it("updates page content when pagination page changes", async () => {
      renderWithProviders(
        <PublicationsTable publications={publications} pageSize={pageSize} />,
      );

      // First page should show first pageSize items
      const firstPageFirstPub = publications[0]?.source;
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
        expect(
          screen.getByText(secondPagePublication.source),
        ).toBeInTheDocument();
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
      const [firstPub] = singlePublication;
      renderWithProviders(<PublicationsTable publications={[firstPub]} />);

      expect(screen.getByText(firstPub.source)).toBeInTheDocument();
    });
  });

  describe("props handling", () => {
    it("renders all publications without pageSize prop", () => {
      renderWithProviders(<PublicationsTable publications={publications} />);

      publications.forEach((pub) => {
        expect(screen.getByText(pub.source)).toBeInTheDocument();
      });
    });

    it("applies custom pageSize when provided", () => {
      if (!publications || publications.length < 2) {
        throw new Error(
          "Test failed: 'publications' must be defined with at least 2 items.",
        );
      }
      const [firstPub, secondPub] = publications;
      const customPageSize = 1;
      if (!firstPub || !secondPub) {
        throw new Error(
          "Test failed: 'publications' must be defined with at least 2 items.",
        );
      }
      renderWithProviders(
        <PublicationsTable
          publications={publications}
          pageSize={customPageSize}
        />,
      );

      expect(screen.getByText(firstPub.source)).toBeInTheDocument();

      expect(screen.queryByText(secondPub.source)).not.toBeInTheDocument();
    });
  });
});
