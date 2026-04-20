import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type * as Yup from "yup";
import { installedSnaps } from "@/tests/mocks/snap";
import { EditSnapType } from "../../helpers";
import {
  getEditSnapValidationSchema,
  getSnapMessage,
  getSuccessMessage,
} from "./helpers";

const SNAP_COUNT = 3;

describe("EditSnap helpers", () => {
  it("requires release for switch actions", async () => {
    const schema = getEditSnapValidationSchema(EditSnapType.Switch);
    const releaseSchema = schema.release as Yup.StringSchema;

    await expect(releaseSchema.validate("")).rejects.toThrowError(
      /release is required/i,
    );
    await expect(releaseSchema.validate("stable")).resolves.toBe("stable");
  });

  it("does not require release for non-switch actions", () => {
    const holdSchema = getEditSnapValidationSchema(EditSnapType.Hold);
    expect(holdSchema.release).toBeUndefined();
  });

  it("falls back to common schema for unsupported edit types", () => {
    const schema = getEditSnapValidationSchema("unsupported" as EditSnapType);

    expect(schema.release).toBeUndefined();
    expect(schema.hold).toBeUndefined();
  });

  it("validates hold_until date values for hold actions", async () => {
    const schema = getEditSnapValidationSchema(EditSnapType.Hold);
    const holdUntilSchema = schema.hold_until as Yup.StringSchema;

    await expect(holdUntilSchema.validate("")).resolves.toBe("");
    await expect(holdUntilSchema.validate("not-a-date")).rejects.toThrowError(
      /valid date and time/i,
    );
    await expect(
      holdUntilSchema.validate("2030-01-01T00:00:00Z"),
    ).resolves.toBe("2030-01-01T00:00:00Z");
  });

  it("returns null message for switch actions", () => {
    expect(getSnapMessage(EditSnapType.Switch, [...installedSnaps])).toBeNull();
  });

  it("renders single-snap message with snap name interpolation", () => {
    const node = getSnapMessage(EditSnapType.Refresh, [installedSnaps[0]]);

    render(<>{node}</>);

    expect(
      screen.getByText(/update Snap 1 to the latest version available/i),
    ).toBeInTheDocument();
  });

  it("renders multi-snap hold summary when held and unheld snaps are mixed", () => {
    const node = getSnapMessage(EditSnapType.Hold, [...installedSnaps]);

    const { container } = render(<>{node}</>);

    expect(
      screen.getByText(/holding a snap will pause automatic updates/i),
    ).toBeInTheDocument();
    expect(container).toHaveTextContent("You selected 4 snaps. This will:");
    expect(container).toHaveTextContent("hold 2 snaps");
    expect(container).toHaveTextContent("leave 2 snaps held");
  });

  it("renders compact multi-snap message when all selected snaps are already held", () => {
    const allHeldSnaps = installedSnaps.map((snap) => ({
      ...snap,
      held_until: "2030-01-01T00:00:00Z",
    }));

    const node = getSnapMessage(EditSnapType.Hold, allHeldSnaps);

    const { container } = render(<>{node}</>);

    expect(container).toHaveTextContent(
      "Holding a snap will pause automatic updates for that particular snap.",
    );
    expect(screen.queryByText(/you selected/i)).not.toBeInTheDocument();
  });

  it("renders multi-snap unhold summary when held and unheld snaps are mixed", () => {
    const node = getSnapMessage(EditSnapType.Unhold, [...installedSnaps]);

    const { container } = render(<>{node}</>);

    expect(container).toHaveTextContent("You selected 4 snaps. This will:");
    expect(container).toHaveTextContent("unhold 2 snaps");
    expect(container).toHaveTextContent("leave 2 snaps unheld");
  });

  it("builds success copy for each action", () => {
    expect(getSuccessMessage(SNAP_COUNT, EditSnapType.Refresh)).toContain(
      "to be refreshed",
    );
    expect(getSuccessMessage(SNAP_COUNT, EditSnapType.Uninstall)).toContain(
      "to be uninstalled",
    );
    expect(getSuccessMessage(SNAP_COUNT, EditSnapType.Hold)).toContain(
      "to be held",
    );
    expect(getSuccessMessage(SNAP_COUNT, EditSnapType.Unhold)).toContain(
      "to be unheld",
    );
  });

  it("falls back to an empty verb for unsupported actions", () => {
    expect(getSuccessMessage(1, "Unsupported" as EditSnapType)).toBe(
      "You queued 1 snap to be updated.",
    );
  });
});
