import { OperationProvider } from "@/features/operations";
import { mirrors } from "@/tests/mocks/mirrors";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import MirrorActions from "./MirrorActions";

const [mirror] = mirrors;
const operationName = "operations/pppp-gggg-ssss";

describe("MirrorActions", () => {
  it("opens menu with mirror actions", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <MirrorActions
        mirrorDisplayName={mirror.displayName}
        mirrorName={mirror.name}
      />,
    );

    await user.click(await screen.findByRole("button"));

    expect(
      screen.getByRole("menuitem", { name: "View details" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Update" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Publish" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Remove" }),
    ).toBeInTheDocument();
  });

  it("disables update button while updating", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <OperationProvider operationNames={[operationName]}>
        <MirrorActions
          mirrorDisplayName={mirror.displayName}
          mirrorName={mirror.name}
          operationName={operationName}
        />
      </OperationProvider>,
    );

    await user.click(await screen.findByRole("button"));

    expect(
      screen.queryByRole("menuitem", { name: "Update" }),
    ).not.toBeInTheDocument();

    expect(screen.getByRole("menuitem", { name: "Updating" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});
