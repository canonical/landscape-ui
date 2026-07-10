import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PublishMirrorContentsBlock from "./PublishMirrorContentsBlock";
import { NO_DATA_TEXT } from "@/components/layout/NoData/constants";
import { publications } from "@/tests/mocks/publications";
import { mirrors } from "@/tests/mocks/mirrors";

const [mirror] = mirrors;
const [publication] = publications;

describe("PublishMirrorContentsBlock", () => {
  it("renders the publication's distribution and architectures when set", () => {
    renderWithProviders(
      <PublishMirrorContentsBlock mirror={mirror} publication={publication} />,
    );

    expect(
      screen.getByRole("heading", { name: "Contents" }),
    ).toBeInTheDocument();
    expect(screen.getByText(publication.distribution)).toBeInTheDocument();
    expect(screen.getByText(mirror.components.join(", "))).toBeInTheDocument();
    expect(
      screen.getByText(publication.architectures.join(", ")),
    ).toBeInTheDocument();
  });

  it("falls back to the mirror's distribution and architectures when the publication omits them", () => {
    renderWithProviders(
      <PublishMirrorContentsBlock
        mirror={mirror}
        publication={{
          ...publication,
          distribution: undefined,
          architectures: undefined,
        }}
      />,
    );

    expect(screen.getByText(mirror.distribution)).toBeInTheDocument();
    expect(
      screen.getByText(mirror.architectures.join(", ")),
    ).toBeInTheDocument();
  });

  it("renders no data for architectures when neither the publication nor the mirror define them", () => {
    renderWithProviders(
      <PublishMirrorContentsBlock
        mirror={{ ...mirror, architectures: undefined }}
        publication={{ ...publication, architectures: undefined }}
      />,
    );

    expect(screen.getByText(NO_DATA_TEXT)).toBeInTheDocument();
  });
});
