import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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
    expect(
      screen.getByText(publication.architectures.join(", ")),
    ).toBeInTheDocument();
  });
});
