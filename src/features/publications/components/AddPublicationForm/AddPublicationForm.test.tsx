import LoadingState from "@/components/layout/LoadingState";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor, within } from "@testing-library/react";
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
    mirrorId = "ubuntu-archive-mirror",
  ) => {
    const sourceTypeSelect = await screen.findByRole("combobox", {
      name: "Source type",
    });
    const sourceSelect = screen.getByRole("combobox", { name: "Source" });

    await user.selectOptions(sourceTypeSelect, "Mirror");

    await waitFor(() => {
      expect(sourceSelect).toBeEnabled();
    });

    await user.selectOptions(sourceSelect, mirrorId);
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

  it("updates contents fields when a mirror source is selected", async () => {
    const user = userEvent.setup();

    renderForm();

    await selectMirrorSource(user);

    expect(screen.getByLabelText(/^distribution$/i)).toHaveValue("jammy");
    expect(
      screen.getByRole("combobox", { name: "Architectures" }),
    ).toBeInTheDocument();
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
    await user.type(
      screen.getByRole("textbox", { name: "Directory prefix" }),
      "edge",
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
    const archCombobox = screen.getByRole("combobox", {
      name: "Architectures",
    });
    await user.click(archCombobox);
    await user.click(await screen.findByRole("checkbox", { name: "amd64" }));

    expect(publicationTargetSelect).toHaveValue(
      "aaaaaaaa-0000-0000-0000-000000000001",
    );
    expect(screen.getByRole("checkbox", { name: "amd64" })).toBeChecked();
    expect(
      screen.getByRole("textbox", { name: "Directory prefix" }),
    ).toHaveValue("edge");
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

  it("shows signing key field when mirror has preserveSignatures=false", async () => {
    const user = userEvent.setup();

    renderForm();

    await selectMirrorSource(user);

    expect(
      screen.getByRole("heading", { name: "Signing GPG Key" }),
    ).toBeInTheDocument();
  });

  it("hides signing key field when mirror has preserveSignatures=true", async () => {
    const user = userEvent.setup();

    renderForm();

    await selectMirrorSource(user, "ubuntu-security-mirror");

    expect(
      screen.queryByRole("heading", { name: "Signing GPG Key" }),
    ).not.toBeInTheDocument();
  });

  it("locks distribution field when mirror has preserveSignatures=true", async () => {
    const user = userEvent.setup();
    renderForm();

    await selectMirrorSource(user, "ubuntu-security-mirror");

    expect(screen.getByText("noble")).toBeInTheDocument();
  });

  it("locks distribution field when local repository is selected", async () => {
    const user = userEvent.setup();
    renderForm();

    await selectLocalSource(user);

    expect(screen.getByText("distribution 1")).toBeInTheDocument();
  });

  it("hides signing key field when local repository is selected", async () => {
    const user = userEvent.setup();

    renderForm();

    await selectLocalSource(user);

    expect(
      screen.queryByRole("heading", { name: "Signing GPG Key" }),
    ).not.toBeInTheDocument();
  });

  it("shows validation error when all architectures are deselected", async () => {
    const user = userEvent.setup();

    renderForm();

    await selectMirrorSource(user);

    const archCombobox = screen.getByRole("combobox", {
      name: "Architectures",
    });
    await user.click(archCombobox);

    const amd64Checkbox = await screen.findByRole("checkbox", {
      name: "amd64",
    });
    await user.click(amd64Checkbox);
    await user.click(amd64Checkbox);

    await waitFor(() => {
      expect(screen.getAllByText("This field is required")).not.toHaveLength(0);
    });
  });

  it("shows success notification after submitting a valid local source publication", async () => {
    const user = userEvent.setup();

    renderForm();

    await user.type(
      await screen.findByRole("textbox", { name: "Publication name" }),
      "new-local-publication",
    );
    await selectLocalSource(user);

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

    await user.click(screen.getByRole("button", { name: "Add publication" }));

    expect(
      await screen.findByText(
        'Publication "new-local-publication" has been created.',
      ),
    ).toBeInTheDocument();
  });

  it("shows success notification after submitting a mirror publication with a custom signing key", async () => {
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

    const signingKeySection = screen
      .getByRole("heading", { name: "Signing GPG Key" })
      .closest("section");
    if (!signingKeySection)
      throw new Error("Signing GPG Key section not found");
    await user.type(
      within(signingKeySection).getByRole("textbox"),
      "-----BEGIN PGP PRIVATE KEY BLOCK-----test-key",
    );

    const archCombobox = screen.getByRole("combobox", {
      name: "Architectures",
    });
    await user.click(archCombobox);
    await user.click(await screen.findByRole("checkbox", { name: "amd64" }));

    await user.click(screen.getByRole("button", { name: "Add publication" }));

    expect(
      await screen.findByText(
        'Publication "new-mirror-publication" has been created.',
      ),
    ).toBeInTheDocument();
  });

  it("allows selecting multiple architectures simultaneously", async () => {
    const user = userEvent.setup();

    renderForm();

    await selectMirrorSource(user);

    const archCombobox = screen.getByRole("combobox", {
      name: "Architectures",
    });
    await user.click(archCombobox);

    await user.click(await screen.findByRole("checkbox", { name: "amd64" }));
    await user.click(screen.getByRole("checkbox", { name: "arm64" }));

    expect(screen.getByRole("checkbox", { name: "amd64" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "arm64" })).toBeChecked();
  });
});
