import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { publications } from "@/tests/mocks/publications";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment";
import { describe, expect, it } from "vitest";
import PublicationsList from "./PublicationsList";

describe("PublicationsList", () => {
  const user = userEvent.setup();
  const [publication] = publications;

  it("renders list columns and row data", () => {
    renderWithProviders(<PublicationsList publications={publications} />);

    expect(screen.getByRole("columnheader", { name: "name" })).toBeVisible();
    expect(
      screen.getByRole("columnheader", { name: "source type" }),
    ).toBeVisible();
    expect(screen.getByRole("columnheader", { name: "source" })).toBeVisible();
    expect(
      screen.getByRole("columnheader", { name: "publication target" }),
    ).toBeVisible();
    expect(
      screen.getByRole("columnheader", { name: "date published" }),
    ).toBeVisible();

    expect(
      screen.getByRole("button", { name: publication.name }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: publication.source }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: publication.publication_target }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `${moment(publication.date_published).format(DISPLAY_DATE_TIME_FORMAT)} UTC`,
      ),
    ).toBeInTheDocument();
  });

  it("opens publication details side panel", async () => {
    renderWithProviders(<PublicationsList publications={publications} />);

    await user.click(screen.getByRole("button", { name: publication.name }));

    expect(
      screen.getByRole("heading", { name: publication.name }),
    ).toBeInTheDocument();
  });

  it("shows empty message with search query", () => {
    renderWithProviders(
      <PublicationsList publications={[]} />,
      undefined,
      "/?search=test-publication",
    );

    expect(
      screen.getByText('No profiles found with the search: "test-publication"'),
    ).toBeInTheDocument();
  });
});
