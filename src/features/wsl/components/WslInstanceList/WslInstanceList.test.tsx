import { windowsInstance } from "@/tests/mocks/instance";
import { instanceChildren } from "@/tests/mocks/wsl";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import WslInstanceList from "./WslInstanceList";

describe("WslInstanceList", () => {
  it("should group by compliance", async () => {
    renderWithProviders(
      <WslInstanceList
        windowsInstance={windowsInstance}
        wslInstances={instanceChildren}
      />,
      undefined,
      "/profiles/wsl?groupBy=compliance",
    );

    expect(
      screen.getByText(
        `Not compliant (${
          instanceChildren.filter(
            (instanceChild) => instanceChild.compliance === "noncompliant",
          ).length
        })`,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        `Not installed (${
          instanceChildren.filter(
            (instanceChild) => instanceChild.compliance === "uninstalled",
          ).length
        })`,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        `Compliant (${
          instanceChildren.filter(
            (instanceChild) => instanceChild.compliance === "compliant",
          ).length
        })`,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        `Created by Landscape (${
          instanceChildren.filter((instanceChild) => instanceChild.registered)
            .length
        })`,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        `Not created by Landscape (${
          instanceChildren.filter(
            (instanceChild) => instanceChild.compliance === "unregistered",
          ).length
        })`,
      ),
    ).toBeInTheDocument();
  });
});
