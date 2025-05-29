import { autoinstallFiles } from "@/tests/mocks/autoinstallFiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe } from "vitest";
import AutoinstallFilesListActions from "./AutoinstallFilesListActions";

describe("AutoinstallFilesListContextualMenu", () => {
  const [file] = autoinstallFiles;

  const props: ComponentProps<typeof AutoinstallFilesListActions> = {
    edit: vi.fn(),
    file: { ...file, is_default: false },
    remove: vi.fn(),
    setAsDefault: vi.fn(),
    viewDetails: vi.fn(),
  };

  beforeEach(async () => {
    renderWithProviders(<AutoinstallFilesListActions {...props} />);
    await userEvent.click(screen.getByLabelText(`${file.filename} actions`));
  });

  it("should have an edit button", async () => {
    await userEvent.click(screen.getByLabelText(`Edit ${file.filename}`));

    expect(props.edit).toHaveBeenCalled();
  });

  it("should have a remove button", async () => {
    await userEvent.click(screen.getByLabelText(`Remove ${file.filename}`));

    expect(props.remove).toHaveBeenCalled();
  });

  it("should have a set as default button", async () => {
    await userEvent.click(
      screen.getByLabelText(`Set ${file.filename} as default`),
    );

    expect(props.setAsDefault).toHaveBeenCalled();
  });

  it("should have a view details button", async () => {
    await userEvent.click(
      screen.getByLabelText(`View ${file.filename} details`),
    );

    expect(props.viewDetails).toHaveBeenCalled();
  });
});
