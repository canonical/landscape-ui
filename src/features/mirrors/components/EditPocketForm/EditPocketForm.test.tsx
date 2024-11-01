import { pockets } from "@/tests/mocks/pockets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { ComponentProps } from "react";
import EditPocketForm from "./EditPocketForm";
import { DEFAULT_SNAPSHOT_URI } from "../../constants";

const mirrorPocketProps: ComponentProps<typeof EditPocketForm> = {
  distributionName: "Ubuntu",
  seriesName: "Focal Fossa",
  pocket:
    pockets.find(
      (p) =>
        p.mode === "mirror" && !p.mirror_uri.startsWith(DEFAULT_SNAPSHOT_URI),
    ) ?? pockets[0],
};

const uploadPocketProps: ComponentProps<typeof EditPocketForm> = {
  distributionName: "Ubuntu",
  seriesName: "Focal Fossa",
  pocket: pockets.find((p) => p.mode === "upload") ?? pockets[0],
};

const pullPocketWithFilterTypeProps: ComponentProps<typeof EditPocketForm> = {
  distributionName: "Ubuntu",
  seriesName: "Focal Fossa",
  pocket: pockets.find((p) => p.mode === "pull" && p.filter_type) ?? pockets[0],
};

const pullPocketWithoutFilterTypeProps: ComponentProps<typeof EditPocketForm> =
  {
    distributionName: "Ubuntu",
    seriesName: "Focal Fossa",
    pocket:
      pockets.find((p) => p.mode === "pull" && p.filter_type === null) ??
      pockets[0],
  };

describe("EditPocketForm", () => {
  it("renders form fields for mirror pocket", () => {
    const { container } = renderWithProviders(
      <EditPocketForm {...mirrorPocketProps} />,
    );
    expect(container).toHaveTexts([
      "Components",
      "Architectures",
      "GPG Key",
      "Mirror URI",
      "Mirror suite",
      "Mirror GPG key",
    ]);

    expect(screen.getByText("Include .udeb packages")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /save changes/i,
      }),
    ).toBeVisible();
  });

  it("renders form fields for upload pocket", () => {
    const { container } = renderWithProviders(
      <EditPocketForm {...uploadPocketProps} />,
    );
    expect(container).toHaveTexts([
      "Components",
      "Architectures",
      "GPG Key",
      "Allow uploaded packages to be unsigned",
      "Uploader GPG keys",
    ]);

    expect(screen.getByText("Include .udeb packages")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /save changes/i,
      }),
    ).toBeVisible();
  });

  it("renders form fields for pull pocket with filter type", () => {
    const { container } = renderWithProviders(
      <EditPocketForm {...pullPocketWithFilterTypeProps} />,
    );
    expect(container).toHaveTexts([
      "Components",
      "Architectures",
      "GPG Key",
      "Filter packages",
    ]);

    expect(screen.getByText("Include .udeb packages")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /save changes/i,
      }),
    ).toBeVisible();
  });

  it("renders form fields for pull pocket without filter type", () => {
    const { container } = renderWithProviders(
      <EditPocketForm {...pullPocketWithoutFilterTypeProps} />,
    );
    expect(container).toHaveTexts(["Components", "Architectures", "GPG Key"]);

    expect(screen.getByText("Include .udeb packages")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /save changes/i,
      }),
    ).toBeVisible();
  });
});
