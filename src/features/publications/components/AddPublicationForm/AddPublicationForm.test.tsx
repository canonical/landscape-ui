import LoadingState from "@/components/layout/LoadingState";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suspense } from "react";
import { describe, expect, it } from "vitest";
import AddPublicationForm from "./AddPublicationForm";

const renderForm = () =>
  renderWithProviders(
    <Suspense fallback={<LoadingState />}>
      <AddPublicationForm />
    </Suspense>,
  );

describe("AddPublicationForm", () => {
  const selectMirrorSource = async (
    user: ReturnType<typeof userEvent.setup>,
  ) => {
    const sourceTypeSelect = await screen.findByRole("combobox", {
      name: "Source type",
    });
    const sourceSelect = screen.getByRole("combobox", { name: "Source" });

    await user.selectOptions(sourceTypeSelect, "Mirror");

    await waitFor(() => {
      expect(sourceSelect).toBeEnabled();
    });

    await user.selectOptions(sourceSelect, "ubuntu-archive-mirror");
  };

  const selectLocalSource = async (
    user: ReturnType<typeof userEvent.setup>,
  ) => {
    const sourceTypeSelect = await screen.findByRole("combobox", {
      name: "Source type",
    });
    const sourceSelect = screen.getByRole("combobox", { name: "Source" });

    await user.selectOptions(sourceTypeSelect, "Local repository");

    await waitFor(() => {
      expect(sourceSelect).toBeEnabled();
    });

    await user.selectOptions(sourceSelect, "aaaa-bbbb-cccc");
  };

  it("updates uploader fields when a mirror source is selected", async () => {
    const user = userEvent.setup();

    renderForm();

    await selectMirrorSource(user);

    expect(screen.getByText("jammy")).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "Architectures" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "amd64" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "arm64" })).toBeInTheDocument();
  });

  it("updates mirror publication fields based on the selected source", async () => {
    const user = userEvent.setup();

    renderForm();

    await user.type(
      await screen.findByRole("textbox", { name: "Publication name" }),
      "new-mirror-publication",
    );
    await selectMirrorSource(user);

    const publicationTargetSelect = screen.getByRole("combobox", {
      name: "Publication target",
    });

    await waitFor(() => {
      expect(publicationTargetSelect).toBeEnabled();
    });

    await user.selectOptions(
      publicationTargetSelect,
      "aaaaaaaa-0000-0000-0000-000000000001",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Architectures" }),
      "amd64",
    );
    await user.type(
      screen.getByRole("textbox", { name: "Directory prefix" }),
      "edge",
    );
    await user.click(
      screen.getByRole("checkbox", {
        name: /Preserve mirror signing key/i,
      }),
    );
    await user.type(
      screen.getByRole("textbox", { name: "Signing GPG key" }),
      "-----BEGIN PGP PRIVATE KEY BLOCK-----test-key",
    );
    await user.click(
      screen.getByRole("checkbox", { name: /Hash based indexing/i }),
    );
    await user.click(
      screen.getByRole("checkbox", { name: /Automatic installation/i }),
    );
    await user.click(
      screen.getByRole("checkbox", { name: /Automatic upgrades/i }),
    );
    await user.click(screen.getByRole("checkbox", { name: /Skip bz2/i }));
    await user.click(
      screen.getByRole("checkbox", { name: /Skip content indexing/i }),
    );

    expect(publicationTargetSelect).toHaveValue(
      "aaaaaaaa-0000-0000-0000-000000000001",
    );
    expect(screen.getByRole("combobox", { name: "Architectures" })).toHaveValue(
      "amd64",
    );
    expect(
      screen.getByRole("textbox", { name: "Directory prefix" }),
    ).toHaveValue("edge");
    expect(
      screen.getByRole("textbox", { name: "Signing GPG key" }),
    ).toHaveValue("-----BEGIN PGP PRIVATE KEY BLOCK-----test-key");
  });

  it("uses static local-source fields without uploader architectures", async () => {
    const user = userEvent.setup();

    renderForm();

    await user.type(
      await screen.findByRole("textbox", { name: "Publication name" }),
      "new-local-publication",
    );
    await selectLocalSource(user);

    expect(screen.getByText("repo 1")).toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", { name: "Architectures" }),
    ).not.toBeInTheDocument();

    const publicationTargetSelect = screen.getByRole("combobox", {
      name: "Publication target",
    });

    await waitFor(() => {
      expect(publicationTargetSelect).toBeEnabled();
    });

    await user.selectOptions(
      publicationTargetSelect,
      "bbbbbbbb-0000-0000-0000-000000000002",
    );

    expect(publicationTargetSelect).toHaveValue(
      "bbbbbbbb-0000-0000-0000-000000000002",
    );
  });

  it("hides preserve mirror signing key when local source is selected", async () => {
    const user = userEvent.setup();

    renderForm();

    await selectMirrorSource(user);

    const preserveKeyCheckbox = screen.getByRole("checkbox", {
      name: /Preserve mirror signing key/i,
    });

    expect(preserveKeyCheckbox).toBeInTheDocument();

    await selectLocalSource(user);

    expect(
      screen.queryByRole("checkbox", {
        name: /Preserve mirror signing key/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("resets preserve_mirror_signing_key to default when switching source type", async () => {
    const user = userEvent.setup();

    renderForm();

    await selectMirrorSource(user);

    const preserveKeyCheckbox = screen.getByRole("checkbox", {
      name: /Preserve mirror signing key/i,
    });

    await user.click(preserveKeyCheckbox);
    expect(preserveKeyCheckbox).not.toBeChecked();

    await selectLocalSource(user);

    const sourceTypeSelect = screen.getByRole("combobox", {
      name: "Source type",
    });
    await user.selectOptions(sourceTypeSelect, "Mirror");

    await waitFor(() => {
      expect(
        screen.getByRole("checkbox", { name: /Preserve mirror signing key/i }),
      ).toBeChecked();
    });
  });

  it("resets mirror_signing_key when switching source type", async () => {
    const user = userEvent.setup();

    renderForm();

    await selectMirrorSource(user);

    await user.click(
      screen.getByRole("checkbox", { name: /Preserve mirror signing key/i }),
    );

    const signingKeyTextarea = screen.getByRole("textbox", {
      name: "Signing GPG key",
    });
    await user.type(signingKeyTextarea, "my-signing-key");
    expect(signingKeyTextarea).toHaveValue("my-signing-key");

    await selectLocalSource(user);

    expect(
      screen.getByRole("textbox", { name: "Signing GPG key" }),
    ).toHaveValue("");
  });
});
