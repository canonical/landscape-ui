import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it, assert } from "vitest";
import PublishMirrorContentsBlock from "./PublishMirrorContentsBlock";
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
    assert(publication.architectures);
    expect(
      screen.getByText(publication.architectures.join(", ")),
    ).toBeInTheDocument();
  });

  it("falls back to the mirror's distribution when the publication omits it", () => {
    renderWithProviders(
      <PublishMirrorContentsBlock
        mirror={mirror}
        publication={{
          ...publication,
          distribution: undefined,
        }}
      />,
    );

    expect(screen.getByText(mirror.distribution)).toBeInTheDocument();
    assert(publication.architectures);
    expect(
      screen.getByText((publication.architectures ?? []).join(", ")),
    ).toBeInTheDocument();
  });

  it("falls back to the mirror's architectures when the publication omits them", () => {
    renderWithProviders(
      <PublishMirrorContentsBlock
        mirror={mirror}
        publication={{
          ...publication,
          architectures: undefined,
        }}
      />,
    );

    expect(
      screen.getByText(mirror.architectures.join(", ")),
    ).toBeInTheDocument();
  });
});
