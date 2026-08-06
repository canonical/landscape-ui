import { renderWithProviders } from "@/tests/render";
import { describe, it } from "vitest";
import MirrorPackagesCount from "./MirrorPackagesCount";
import { mirrors } from "@/tests/mocks/mirrors";
import { screen } from "@testing-library/react";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { NO_DATA_TEXT } from "@/components/layout/NoData/constants";

const mirrorName = mirrors[0].name;

describe("MirrorPackagesCount", () => {
  it("shows an exact count", async () => {
    setEndpointStatus({
      status: "variant",
      path: "mirrors/packages",
      response: {
        mirrorPackages: ["package-1", "package-2", "package-3"],
        nextPageToken: undefined,
      },
    });

    renderWithProviders(<MirrorPackagesCount mirrorName={mirrorName} />);

    expect(await screen.findByText("3 packages")).toBeInTheDocument();
  });

  it("shows a limited count", async () => {
    setEndpointStatus({
      status: "variant",
      path: "mirrors/packages",
      response: {
        mirrorPackages: ["package-1", "package-2", "package-3"],
        nextPageToken: "1",
      },
    });

    renderWithProviders(<MirrorPackagesCount mirrorName={mirrorName} />);

    expect(await screen.findByText("3+ packages")).toBeInTheDocument();
  });

  it("shows 0 packages", async () => {
    setEndpointStatus({
      status: "empty",
      path: "mirrors/packages",
    });

    renderWithProviders(<MirrorPackagesCount mirrorName={mirrorName} />);

    expect(await screen.findByText("0 packages")).toBeInTheDocument();
  });

  it("shows no data fallback with error", async () => {
    setEndpointStatus({
      status: "error",
      path: "mirrors/packages",
    });

    renderWithProviders(<MirrorPackagesCount mirrorName={mirrorName} />);

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();

    expect(await screen.findByText(NO_DATA_TEXT)).toBeInTheDocument();
  });

  it("shows no data fallback for empty name", async () => {
    renderWithProviders(<MirrorPackagesCount mirrorName="" />);

    expect(await screen.findByText(NO_DATA_TEXT)).toBeInTheDocument();
  });
});
