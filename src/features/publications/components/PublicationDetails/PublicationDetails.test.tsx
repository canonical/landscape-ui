import { publications } from "@/tests/mocks/publications";
import { publicationTargets } from "@/tests/mocks/publicationTargets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PublicationDetails from "./PublicationDetails";
import { mirrors } from "@/tests/mocks/mirrors";
import { getSourceType } from "../..";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import moment from "moment";

describe("PublicationDetails", () => {
  const user = userEvent.setup();
  const [publication, publicationWithKey] = publications;

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
      { label: "Name", value: publication.displayName },
      { label: "Source type", value: getSourceType(publication.source) },
      { label: "Source", value: sourceDisplayName },
      { label: "Publication target", value: publicationTargetDisplayName },
      {
        label: "Date published",
        value: moment(publication.publishTime).format(DISPLAY_DATE_TIME_FORMAT),
      },
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

  it("renders GPG key fingerprint when it exists", async () => {
    const { container } = renderWithProviders(
      <PublicationDetails
        publication={publicationWithKey}
        sourceDisplayName={sourceDisplayName}
        publicationTargetDisplayName={publicationTargetDisplayName}
      />,
    );

    expect(container).toHaveInfoItem(
      "Signing GPG Key",
      publicationWithKey.gpgKey?.fingerprint,
    );
  });

  it("opens republish modal", async () => {
    renderWithProviders(
      <PublicationDetails
        publication={publication}
        sourceDisplayName={sourceDisplayName}
        publicationTargetDisplayName={publicationTargetDisplayName}
      />,
    );
    const publicationDisplayName = publication.displayName;

    await user.click(
      screen.getByRole("button", {
        name: `Republish ${publicationDisplayName}`,
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: `Republish ${publicationDisplayName}`,
      }),
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
    const publicationDisplayName = publication.displayName;

    await user.click(
      screen.getByRole("button", { name: `Remove ${publicationDisplayName}` }),
    );

    expect(
      screen.getByRole("heading", { name: `Remove ${publicationDisplayName}` }),
    ).toBeInTheDocument();
  });
});
