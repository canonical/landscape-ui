import { renderWithProviders } from "@/tests/render";
import { assert, beforeEach, describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Mirror } from "@canonical/landscape-openapi";
import { mirrors } from "@/tests/mocks/mirrors";
import { inProgressOperation } from "@/tests/mocks/operations";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import MirrorDetailsActionBlock from "./MirrorDetailsActionBlock";

const typedMirrors = mirrors as Mirror[];

const nonPreserveMirror = typedMirrors.find(
  ({ preserveSignatures }) => !preserveSignatures,
);
assert(nonPreserveMirror, "Missing mock mirror without preserve signatures");

const preserveMirror = typedMirrors.find(
  ({ preserveSignatures }) => preserveSignatures,
);
assert(preserveMirror, "Missing mock mirror with preserve signatures");

describe("MirrorDetailsActionBlock", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("renders edit, update, publish, and remove actions", () => {
    renderWithProviders(
      <MirrorDetailsActionBlock
        mirror={nonPreserveMirror}
        operation={undefined}
      />,
      undefined,
      `?name=${nonPreserveMirror.name}`,
    );

    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });

  describe("Edit action", () => {
    it("opens the edit form when clicked", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <>
          <MirrorDetailsActionBlock
            mirror={nonPreserveMirror}
            operation={undefined}
          />
          <LocationDisplay />
        </>,
        undefined,
        `?name=${nonPreserveMirror.name}`,
      );

      await user.click(screen.getByRole("button", { name: "Edit" }));

      await waitFor(() => {
        expect(getLocationDisplay()).toHaveTextContent("sidePath=edit");
      });
    });
  });

  describe("Update action", () => {
    it("is hidden for preserve-signatures mirrors", () => {
      renderWithProviders(
        <MirrorDetailsActionBlock
          mirror={preserveMirror}
          operation={undefined}
        />,
        undefined,
        `?name=${preserveMirror.name}`,
      );

      expect(
        screen.queryByRole("button", { name: "Update" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Updating" }),
      ).not.toBeInTheDocument();
    });

    it("shows a disabled updating action while an update is in progress", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <MirrorDetailsActionBlock
          mirror={nonPreserveMirror}
          operation={inProgressOperation}
        />,
        undefined,
        `?name=${nonPreserveMirror.name}`,
      );

      const updatingButton = screen.getByRole("button", { name: "Updating" });
      expect(updatingButton).toHaveAttribute("aria-disabled", "true");
      expect(
        screen.queryByRole("button", { name: "Update" }),
      ).not.toBeInTheDocument();

      await user.hover(updatingButton);

      expect(
        await screen.findByText(
          "You must wait for this action to be completed to trigger a new update.",
        ),
      ).toBeInTheDocument();
    });

    it("opens the update modal when clicked", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <MirrorDetailsActionBlock
          mirror={nonPreserveMirror}
          operation={undefined}
        />,
        undefined,
        `?name=${nonPreserveMirror.name}`,
      );

      await user.click(screen.getByRole("button", { name: "Update" }));

      expect(
        await screen.findByRole("heading", {
          name: `Update ${nonPreserveMirror.displayName}`,
        }),
      ).toBeInTheDocument();
    });

    it("opens and closes the update modal from the updateModal query param", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <MirrorDetailsActionBlock
          mirror={nonPreserveMirror}
          operation={undefined}
        />,
        undefined,
        `?name=${nonPreserveMirror.name}&updateModal=true`,
      );

      expect(
        await screen.findByRole("heading", {
          name: `Update ${nonPreserveMirror.displayName}`,
        }),
      ).toBeInTheDocument();

      const closeButton = screen.getByRole("button", { name: "Cancel" });
      await user.click(closeButton);

      expect(
        screen.queryByRole("heading", {
          name: `Update ${nonPreserveMirror.displayName}`,
        }),
      ).not.toBeInTheDocument();
    });

    it("does not open the update modal from the query param for preserve-signatures mirrors", async () => {
      renderWithProviders(
        <>
          <MirrorDetailsActionBlock
            mirror={preserveMirror}
            operation={undefined}
          />
          <LocationDisplay />
        </>,
        undefined,
        `?name=${preserveMirror.name}&updateModal=true`,
      );

      expect(
        screen.queryByRole("heading", {
          name: `Update ${preserveMirror.displayName}`,
        }),
      ).not.toBeInTheDocument();

      await waitFor(() => {
        expect(getLocationDisplay()).not.toHaveTextContent("updateModal=true");
      });
    });
  });

  describe("Publish action", () => {
    it("opens the no publication targets modal when clicked with no targets", async () => {
      const user = userEvent.setup();

      setEndpointStatus({ status: "empty", path: "publicationTargets" });

      renderWithProviders(
        <MirrorDetailsActionBlock
          mirror={nonPreserveMirror}
          operation={undefined}
        />,
        undefined,
        `?name=${nonPreserveMirror.name}`,
      );

      await user.click(await screen.findByRole("button", { name: "Publish" }));

      expect(
        await screen.findByRole("heading", {
          name: "No publication targets have been added",
        }),
      ).toBeInTheDocument();
    });

    it("opens the publish form when clicked with publication targets available", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <>
          <MirrorDetailsActionBlock
            mirror={nonPreserveMirror}
            operation={undefined}
          />
          <LocationDisplay />
        </>,
        undefined,
        `?name=${nonPreserveMirror.name}`,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Publish" }),
        ).not.toHaveAttribute("aria-disabled", "true");
      });

      await user.click(screen.getByRole("button", { name: "Publish" }));

      await waitFor(() => {
        expect(getLocationDisplay()).toHaveTextContent("sidePath=publish");
      });
      expect(
        screen.queryByRole("heading", {
          name: "No publication targets have been added",
        }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Remove action", () => {
    it("opens the remove modal when clicked", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <MirrorDetailsActionBlock
          mirror={nonPreserveMirror}
          operation={undefined}
        />,
        undefined,
        `?name=${nonPreserveMirror.name}`,
      );

      await user.click(screen.getByRole("button", { name: "Remove" }));

      expect(
        await screen.findByRole("heading", {
          name: `Remove ${nonPreserveMirror.displayName}`,
        }),
      ).toBeInTheDocument();
    });
  });
});
