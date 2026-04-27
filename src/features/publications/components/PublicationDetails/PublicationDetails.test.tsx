import { publications } from "@/tests/mocks/publications";
import { publicationTargets } from "@/tests/mocks/publicationTargets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PublicationDetails from "./PublicationDetails";
import { mirrors } from "@/tests/mocks/mirrors";

describe("PublicationDetails", () => {
  const user = userEvent.setup();
  const [publication] = publications;

  const sourceDisplayName =
    mirrors.find((m) => m.name === publication.source)?.displayName ??
    publication.source;
  const publicationTargetDisplayName =
    publicationTargets.find((t) => t.name === publication.publicationTarget)
      ?.displayName ?? publication.publicationTarget;

  it("renders all info sections and values", () => {
    const { container } = renderWithProviders(
      <PublicationDetails
        publication={publication}
        sourceDisplayName={sourceDisplayName}
        publicationTargetDisplayName={publicationTargetDisplayName}
      />,
    );

    const infoItems = [
      { label: "Name", value: publication.label },
      { label: "Source", value: sourceDisplayName },
      { label: "Publication target", value: publicationTargetDisplayName },
      { label: "Distribution", value: publication.distribution },
      { label: "Label", value: publication.label },
      { label: "Origin", value: publication.origin },
      {
        label: "Architectures",
        value: publication.architectures.join(", "),
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
    renderWithProviders(
      <PublicationDetails
        publication={publication}
        sourceDisplayName={sourceDisplayName}
        publicationTargetDisplayName={publicationTargetDisplayName}
      />,
    );
    const publicationLabel = publication.label;

    await user.click(
      screen.getByRole("button", { name: `Republish ${publicationLabel}` }),
    );

    expect(
      screen.getByRole("heading", { name: `Republish ${publicationLabel}` }),
    ).toBeInTheDocument();
  });

  it("opens remove modal", async () => {
    renderWithProviders(
      <PublicationDetails
        publication={publication}
        sourceDisplayName={sourceDisplayName}
        publicationTargetDisplayName={publicationTargetDisplayName}
      />,
    );
    const publicationLabel = publication.label;

    await user.click(
      screen.getByRole("button", { name: `Remove ${publicationLabel}` }),
    );

    expect(
      screen.getByRole("heading", { name: `Remove ${publicationLabel}` }),
    ).toBeInTheDocument();
  });
});
