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
import { AUTOMATIC_LABELS } from "../../constants";
import { expectLoadingState } from "@/tests/helpers";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { resetLroProgress } from "@/tests/server/handlers/operations";

describe("PublicationDetails", () => {
  const user = userEvent.setup();
  const [publication, publicationWithKey, manualPublication] = publications;

  const sourceDisplayName =
    mirrors.find((m) => m.name === publication.source)?.displayName ??
    publication.source;
  const publicationTargetDisplayName =
    publicationTargets.find((t) => t.name === publication.publicationTarget)
      ?.displayName ?? publication.publicationTarget;

  it("renders all info sections and values", async () => {
    const { container } = renderWithProviders(
      <PublicationDetails
        publication={publication}
        sourceDisplayName={sourceDisplayName}
        publicationTargetDisplayName={publicationTargetDisplayName}
      />,
    );

    await expectLoadingState();

    const infoItems = [
      { label: "Name", value: publication.displayName },
      { label: "Source type", value: getSourceType(publication.source) },
      { label: "Source", value: sourceDisplayName },
      { label: "Publication target", value: publicationTargetDisplayName },
      { label: "Status", value: "Published" },
      {
        label: "Last published",
        value: moment(publication.publishTime).format(DISPLAY_DATE_TIME_FORMAT),
      },
      { label: "Distribution", value: publication.distribution },
      {
        label: "Architectures",
        value: publication.architectures.join(", "),
      },
      { label: "Hash indexing", value: "Yes" },
      {
        label: "Installs and upgrades",
        value: AUTOMATIC_LABELS.automatic,
      },
      { label: "Skip bz2", value: "No" },
      { label: "Skip content indexing", value: "No" },
    ];

    for (const { label, value } of infoItems) {
      expect(container).toHaveInfoItem(label, value);
    }
  });

  it("renders unpublished values", async () => {
    const { container } = renderWithProviders(
      <PublicationDetails
        publication={{
          ...publication,
          lastOperation: undefined,
          publishTime: undefined,
        }}
        sourceDisplayName={sourceDisplayName}
        publicationTargetDisplayName={publicationTargetDisplayName}
      />,
    );

    const infoItems = [
      { label: "Status", value: "Not yet published" },
      {
        label: "Last published",
        value: NO_DATA_TEXT,
      },
    ];

    for (const { label, value } of infoItems) {
      expect(container).toHaveInfoItem(label, value);
    }

    expect(
      screen.queryByRole("heading", { name: "Publishing failed" }),
    ).not.toBeInTheDocument();
  });

  it("renders failed publication notification", async () => {
    renderWithProviders(
      <PublicationDetails
        publication={manualPublication}
        sourceDisplayName={sourceDisplayName}
        publicationTargetDisplayName={publicationTargetDisplayName}
      />,
    );

    expect(
      await screen.findByRole("heading", { name: "Publishing failed" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Your last publication was not completed successfully."),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("button", { name: "View logs" })).toHaveLength(
      2,
    );
  });

  it("renders disabled button while publishing", async () => {
    resetLroProgress();

    renderWithProviders(
      <PublicationDetails
        publication={publicationWithKey}
        sourceDisplayName={sourceDisplayName}
        publicationTargetDisplayName={publicationTargetDisplayName}
      />,
    );

    await expectLoadingState();

    expect(
      screen.queryByRole("button", { name: "Republish" }),
    ).not.toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Publishing" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("renders GPG key fingerprint when it exists", async () => {
    const { container } = renderWithProviders(
      <PublicationDetails
        publication={publicationWithKey}
        sourceDisplayName={sourceDisplayName}
        publicationTargetDisplayName={publicationTargetDisplayName}
      />,
    );

    await expectLoadingState();

    expect(container).toHaveInfoItem(
      "Signing GPG Key",
      publicationWithKey.gpgKey?.fingerprint,
    );
  });

  it("renders automatic upgrades value for installs and upgrades field", async () => {
    const { container } = renderWithProviders(
      <PublicationDetails
        publication={publicationWithKey}
        sourceDisplayName={sourceDisplayName}
        publicationTargetDisplayName={publicationTargetDisplayName}
      />,
    );

    await expectLoadingState();

    expect(container).toHaveInfoItem(
      "Installs and upgrades",
      AUTOMATIC_LABELS.autoUpgrades,
    );
  });

  it("renders manual value for installs and upgrades field", async () => {
    const { container } = renderWithProviders(
      <PublicationDetails
        publication={manualPublication}
        sourceDisplayName={sourceDisplayName}
        publicationTargetDisplayName={publicationTargetDisplayName}
      />,
    );

    await expectLoadingState();

    expect(container).toHaveInfoItem(
      "Installs and upgrades",
      AUTOMATIC_LABELS.manual,
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

    await expectLoadingState();

    await user.click(screen.getByRole("button", { name: "Republish" }));

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

    await expectLoadingState();

    await user.click(screen.getByRole("button", { name: "Remove" }));

    expect(
      screen.getByRole("heading", { name: `Remove ${publicationDisplayName}` }),
    ).toBeInTheDocument();
  });
});
