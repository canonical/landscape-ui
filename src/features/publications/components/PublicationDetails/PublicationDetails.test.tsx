import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { publications } from "@/tests/mocks/publications";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment";
import { describe, expect, it } from "vitest";
import PublicationDetails from "./PublicationDetails";

describe("PublicationDetails", () => {
  const user = userEvent.setup();
  const [publication] = publications;

  it("renders all info sections and values", () => {
    const { container } = renderWithProviders(
      <PublicationDetails publication={publication} />,
    );

    const infoItems = [
      { label: "Name", value: publication.name },
      { label: "Source type", value: publication.source_type },
      { label: "Source", value: publication.source },
      { label: "Publication target", value: publication.publication_target },
      {
        label: "Date published",
        value: `${moment(publication.date_published).format(DISPLAY_DATE_TIME_FORMAT)} UTC`,
      },
      { label: "Prefix", value: publication.prefix },
      { label: "Distribution", value: publication.uploaders.distribution },
      {
        label: "Components",
        value: publication.uploaders.components.join(", "),
      },
      {
        label: "Architectures",
        value: publication.uploaders.architectures.join(", "),
      },
      { label: "Hash indexing", value: "No" },
      { label: "Automatic installation", value: "No" },
      { label: "Automatic upgrades", value: "No" },
      { label: "Skip bz2", value: "No" },
      { label: "Skip content indexing", value: "No" },
    ];

    for (const { label, value } of infoItems) {
      expect(container).toHaveInfoItem(label, value);
    }
  });

  it("opens republish modal", async () => {
    renderWithProviders(<PublicationDetails publication={publication} />);

    await user.click(
      screen.getByRole("button", { name: `Republish ${publication.name}` }),
    );

    expect(
      screen.getByRole("heading", { name: `Republish ${publication.name}` }),
    ).toBeInTheDocument();
  });

  it("opens remove modal", async () => {
    renderWithProviders(<PublicationDetails publication={publication} />);

    await user.click(
      screen.getByRole("button", { name: `Remove ${publication.name}` }),
    );

    expect(
      screen.getByRole("heading", { name: "Remove publication" }),
    ).toBeInTheDocument();
  });
});
