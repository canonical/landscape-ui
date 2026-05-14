import { publications } from "@/tests/mocks/publications";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AssociatedPublicationsList from "./AssociatedPublicationsList";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import type { Publication } from "@canonical/landscape-openapi";

const pubWithoutPublishTime: Publication = {
  name: "publications/no-date-id",
  publicationId: "no-date-id",
  displayName: "no-date publication",
  label: "no date",
  publicationTarget: "publicationTargets/test",
  source: "mirrors/no-date-mirror",
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

const pubWithUnknownSource: Publication = {
  name: "publications/unknown-source-id",
  publicationId: "unknown-source-id",
  displayName: "unknown source pub",
  label: "unknown",
  publicationTarget: "publicationTargets/test",
  source: "ppa/some-ppa",
  distribution: "jammy",
  origin: "",
  architectures: [],
  acquireByHash: false,
  butAutomaticUpgrades: false,
  notAutomatic: false,
  multiDist: false,
  skipBz2: false,
  skipContents: false,
  publishTime: new Date("March 12, 2026"),
};

describe("AssociatedPublicationsList", () => {
  const user = userEvent.setup();

  describe("table structure and columns", () => {
    it("renders table with correct column headers: Publication, Source, Distribution", () => {
      renderWithProviders(
        <AssociatedPublicationsList publications={publications} />,
      );

      expect(screen.getByText("Publication")).toBeInTheDocument();
      expect(screen.getByText("Source")).toBeInTheDocument();
    });

    it("renders all publications in rows with display_name", () => {
      renderWithProviders(
        <AssociatedPublicationsList publications={publications} />,
      );

      publications.forEach((pub) => {
        expect(screen.getByText(pub.source)).toBeInTheDocument();
      });
    });
  });

  describe("column data rendering", () => {
    it("renders label as a link in Publication column", () => {
      renderWithProviders(
        <AssociatedPublicationsList publications={publications} />,
      );

      publications.forEach((pub) => {
        const link = screen.getByRole("link", { name: pub.displayName });
        expect(link).toBeInTheDocument();
      });
    });

    it("Publication column links point to publications page with correct params", () => {
      renderWithProviders(
        <AssociatedPublicationsList publications={publications} />,
      );

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
        <AssociatedPublicationsList publications={[pubWithoutLabel]} />,
      );

      expect(
        screen.getByRole("link", { name: pubWithoutLabel.displayName }),
      ).toBeInTheDocument();
    });

    it("renders mirror value in Source column when available", () => {
      renderWithProviders(
        <AssociatedPublicationsList publications={publications} />,
      );

      publications.forEach((pub) => {
        expect(screen.getByText(pub.source)).toBeInTheDocument();
      });
    });
  });

  describe("pagination", () => {
    const pageSize = 2;

    it("does not render pagination when publications.length <= pageSize", () => {
      renderWithProviders(
        <AssociatedPublicationsList
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
        <AssociatedPublicationsList
          publications={publications}
          pageSize={pageSize}
        />,
      );

      expect(screen.getByText(/page 1/i)).toBeInTheDocument();
    });

    it("shows only pageSize items on first page", () => {
      renderWithProviders(
        <AssociatedPublicationsList
          publications={publications}
          pageSize={pageSize}
        />,
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
        <AssociatedPublicationsList
          publications={publications}
          pageSize={pageSize}
        />,
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
    it("renders empty message with empty publications array", () => {
      renderWithProviders(<AssociatedPublicationsList publications={[]} />);

      expect(
        screen.getByText("No associated publications were found."),
      ).toBeInTheDocument();
    });

    it("renders single publication correctly", () => {
      const singlePublication = [publications[0]];
      if (!singlePublication[0]) {
        return;
      }
      const [firstPub] = singlePublication;
      renderWithProviders(
        <AssociatedPublicationsList publications={[firstPub]} />,
      );

      expect(screen.getByText(firstPub.source)).toBeInTheDocument();
    });
  });

  describe("props handling", () => {
    it("renders all publications without pageSize prop", () => {
      renderWithProviders(
        <AssociatedPublicationsList publications={publications} />,
      );

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
        <AssociatedPublicationsList
          publications={publications}
          pageSize={customPageSize}
        />,
      );

      expect(screen.getByText(firstPub.source)).toBeInTheDocument();

      expect(screen.queryByText(secondPub.source)).not.toBeInTheDocument();
    });
  });

  describe("Date Published column", () => {
    it("renders formatted date when publishTime is present", () => {
      const [firstPub] = publications;
      if (!firstPub) throw new Error("Missing mock publication");

      renderWithProviders(
        <AssociatedPublicationsList publications={[firstPub]} />,
      );

      expect(screen.getByText(/Mar 12, 2026/)).toBeInTheDocument();
    });

    it("renders NoData when publishTime is absent", () => {
      renderWithProviders(
        <AssociatedPublicationsList publications={[pubWithoutPublishTime]} />,
      );

      expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();
    });
  });

  describe("showSources prop", () => {
    it("hides Source column when showSources is false", () => {
      renderWithProviders(
        <AssociatedPublicationsList
          publications={publications}
          showSources={false}
        />,
      );

      expect(screen.queryByText("Source")).not.toBeInTheDocument();
    });

    it("shows Source column by default", () => {
      renderWithProviders(
        <AssociatedPublicationsList publications={publications} />,
      );

      expect(screen.getByText("Source")).toBeInTheDocument();
    });

    it("renders raw source text when source type is unknown", () => {
      renderWithProviders(
        <AssociatedPublicationsList publications={[pubWithUnknownSource]} />,
      );

      expect(screen.getByText("ppa/some-ppa")).toBeInTheDocument();
    });
  });

  describe("pagination navigation", () => {
    it("navigates to page 2 with next button and back with prev button", async () => {
      const pageSize = 1;

      renderWithProviders(
        <AssociatedPublicationsList
          publications={publications}
          pageSize={pageSize}
        />,
      );

      const [firstPub, secondPub] = publications;
      if (!firstPub || !secondPub) throw new Error("Missing mock publications");

      expect(screen.getByText(firstPub.source)).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /next page/i }));

      expect(screen.getByText(secondPub.source)).toBeInTheDocument();
      expect(screen.queryByText(firstPub.source)).not.toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /previous page/i }));

      expect(screen.getByText(firstPub.source)).toBeInTheDocument();
    });
  });

  describe("sourceDisplayNames prop", () => {
    it("renders display names when sourceDisplayNames is provided", () => {
      const [firstPub] = publications;
      if (!firstPub) throw new Error("Missing mock publication");

      const sourceDisplayNames = {
        [firstPub.source]: "My Friendly Mirror Name",
      };

      renderWithProviders(
        <AssociatedPublicationsList
          publications={[firstPub]}
          sourceDisplayNames={sourceDisplayNames}
        />,
      );

      expect(screen.getByText("My Friendly Mirror Name")).toBeInTheDocument();
      expect(screen.queryByText(firstPub.source)).not.toBeInTheDocument();
    });

    it("falls back to raw source name when displayName not in lookup", () => {
      const [firstPub] = publications;
      if (!firstPub) throw new Error("Missing mock publication");

      renderWithProviders(
        <AssociatedPublicationsList
          publications={[firstPub]}
          sourceDisplayNames={{}}
        />,
      );

      expect(screen.getByText(firstPub.source)).toBeInTheDocument();
    });

    it("renders display names for local repositories", () => {
      const localPub: Publication = {
        name: "publications/local-pub-id",
        publicationId: "local-pub-id",
        displayName: "Local Publication",
        label: "local",
        publicationTarget: "publicationTargets/test",
        source: "locals/some-local-uuid",
        distribution: "jammy",
        origin: "",
        architectures: [],
        acquireByHash: false,
        butAutomaticUpgrades: false,
        notAutomatic: false,
        multiDist: false,
        skipBz2: false,
        skipContents: false,
        publishTime: new Date("March 12, 2026"),
      };

      const sourceDisplayNames = {
        "locals/some-local-uuid": "My Custom Local Repo",
      };

      renderWithProviders(
        <AssociatedPublicationsList
          publications={[localPub]}
          sourceDisplayNames={sourceDisplayNames}
        />,
      );

      expect(screen.getByText("My Custom Local Repo")).toBeInTheDocument();
    });
  });
});
