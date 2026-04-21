import { publications } from "@/tests/mocks/publications";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
      { label: "Source", value: publication.source },
      {
        label: "Publication target",
        value: publication.publicationTarget,
      },
      { label: "Distribution", value: publication.distribution },
      { label: "Label", value: publication.label },
      { label: "Origin", value: publication.origin },
      {
        label: "Architectures",
        value: publication.architectures?.join(", "),
      },
      { label: "Hash indexing", value: "Yes" },
      { label: "Automatic installation", value: "Yes" },
      { label: "Automatic upgrades", value: "No" },
      { label: "Multi dist", value: "No" },
      { label: "Skip bz2", value: "No" },
      { label: "Skip content indexing", value: "No" },
    ];

    for (const { label, value } of infoItems) {
      expect(container).toHaveInfoItem(label, value);
    }
  });

  it("opens republish modal", async () => {
    renderWithProviders(<PublicationDetails publication={publication} />);
    const publicationLabel = publication.name;

    await user.click(
      screen.getByRole("button", { name: `Republish ${publicationLabel}` }),
    );

    expect(
      screen.getByRole("heading", { name: `Republish ${publicationLabel}` }),
    ).toBeInTheDocument();
  });

  it("opens remove modal", async () => {
    renderWithProviders(<PublicationDetails publication={publication} />);
    const publicationLabel = publication.name;

    await user.click(
      screen.getByRole("button", { name: `Remove ${publicationLabel}` }),
    );

    expect(
      screen.getByRole("heading", { name: "Remove publication" }),
    ).toBeInTheDocument();
  });
});
