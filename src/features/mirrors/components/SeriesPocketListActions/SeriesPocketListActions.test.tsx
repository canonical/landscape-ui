import { distributions } from "@/tests/mocks/distributions";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import type { PullPocket } from "../../types/Pocket";
import SeriesPocketListActions from "./SeriesPocketListActions";

const propsWithMirrorPocket: ComponentProps<typeof SeriesPocketListActions> = {
  distributionName: "Ubuntu",
  pocket:
    distributions
      .find((d) => d.series.length > 0)
      ?.series.find((s) => s.pockets.some((p) => p.mode === "mirror"))
      ?.pockets.find((p) => p.mode === "mirror") ??
    distributions[0].series[0].pockets[0],
  seriesName: "Focal Fossa",
  syncPocketRefs: [],
};

const propsWithPullPocket: ComponentProps<typeof SeriesPocketListActions> = {
  distributionName: "Ubuntu",
  pocket:
    distributions
      .find((d) => d.series.length > 0)
      ?.series.find((s) => s.pockets.some((p) => p.mode === "pull"))
      ?.pockets.find((p) => p.mode === "pull") ??
    distributions[0].series[0].pockets[0],
  seriesName: "Focal Fossa",
  syncPocketRefs: [],
};

const propsWithUploadPocket: ComponentProps<typeof SeriesPocketListActions> = {
  distributionName: "Ubuntu",
  pocket:
    distributions
      .find((d) => d.series.length > 0)
      ?.series.find((s) => s.pockets.some((p) => p.mode === "upload"))
      ?.pockets.find((p) => p.mode === "upload") ??
    distributions[0].series[0].pockets[0],
  seriesName: "Focal Fossa",
  syncPocketRefs: [],
};

const checkEditAndDeleteButtons = async (
  pocketName: string,
  seriesName: string,
  distributionName: string,
) => {
  await userEvent.click(
    screen.getByLabelText(
      `${pocketName} pocket of ${distributionName}/${seriesName} actions`,
    ),
  );

  const editButton = screen.getByRole("button", {
    name: `Edit ${pocketName} pocket of ${distributionName}/${seriesName}`,
  });
  expect(editButton).toBeInTheDocument();

  await userEvent.click(editButton);

  const formHeader = await screen.findByText(`Edit ${pocketName} pocket`);
  expect(formHeader).toBeInTheDocument();

  await userEvent.click(
    screen.getByRole("button", { name: /close side panel/i }),
  );

  await userEvent.click(
    screen.getByLabelText(
      `${pocketName} pocket of ${distributionName}/${seriesName} actions`,
    ),
  );

  const deleteButton = screen.getByRole("button", {
    name: `Remove ${pocketName} pocket of ${distributionName}/${seriesName}`,
  });
  expect(deleteButton).toBeInTheDocument();
  await userEvent.click(deleteButton);

  expect(
    screen.getByText(
      `Do you really want to delete ${pocketName} pocket from ${seriesName} series of ${distributionName} distribution?`,
    ),
  ).toBeVisible();
  await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
};

describe("SeriesPocketListActions", () => {
  it("renders correct buttons for mirror pockets", async () => {
    renderWithProviders(<SeriesPocketListActions {...propsWithMirrorPocket} />);

    await userEvent.click(
      screen.getByLabelText(
        `${propsWithMirrorPocket.pocket.name} pocket of ${propsWithMirrorPocket.distributionName}/${propsWithMirrorPocket.seriesName} actions`,
      ),
    );

    const syncButton = screen.getByRole("button", {
      name: `Synchronize ${propsWithMirrorPocket.pocket.name} pocket of ${propsWithMirrorPocket.distributionName}/${propsWithMirrorPocket.seriesName}`,
    });
    expect(syncButton).toBeInTheDocument();

    await userEvent.click(syncButton);
    expect(
      screen.getByText("Do you want to synchronize packages?"),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    await checkEditAndDeleteButtons(
      propsWithMirrorPocket.pocket.name,
      propsWithMirrorPocket.seriesName,
      propsWithMirrorPocket.distributionName,
    );
  });

  it("renders correct buttons for pull pockets", async () => {
    renderWithProviders(<SeriesPocketListActions {...propsWithPullPocket} />);

    await userEvent.click(
      screen.getByLabelText(
        `${propsWithPullPocket.pocket.name} pocket of ${propsWithPullPocket.distributionName}/${propsWithPullPocket.seriesName} actions`,
      ),
    );

    const pullButton = screen.getByRole("button", {
      name: `Pull packages to ${propsWithPullPocket.pocket.name} pocket of ${propsWithPullPocket.distributionName}/${propsWithPullPocket.seriesName}`,
    });
    expect(pullButton).toBeInTheDocument();

    await userEvent.click(pullButton);
    expect(
      screen.getByText(
        `Do you want to pull packages from ${(propsWithPullPocket.pocket as PullPocket).pull_pocket}?`,
      ),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    await checkEditAndDeleteButtons(
      propsWithPullPocket.pocket.name,
      propsWithPullPocket.seriesName,
      propsWithPullPocket.distributionName,
    );
  });

  it("renders correct buttons for upload pockets", async () => {
    renderWithProviders(<SeriesPocketListActions {...propsWithUploadPocket} />);

    await userEvent.click(
      screen.getByLabelText(
        `${propsWithUploadPocket.pocket.name} pocket of ${propsWithUploadPocket.distributionName}/${propsWithUploadPocket.seriesName} actions`,
      ),
    );

    const buttonsLength = screen.getAllByRole("button").length;
    expect(buttonsLength).toBe(3);

    await userEvent.click(
      screen.getByLabelText(
        `${propsWithUploadPocket.pocket.name} pocket of ${propsWithUploadPocket.distributionName}/${propsWithUploadPocket.seriesName} actions`,
      ),
    );

    await checkEditAndDeleteButtons(
      propsWithUploadPocket.pocket.name,
      propsWithUploadPocket.seriesName,
      propsWithUploadPocket.distributionName,
    );
  });
});
