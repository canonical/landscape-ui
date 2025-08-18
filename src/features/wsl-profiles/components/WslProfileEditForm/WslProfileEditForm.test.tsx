import { wslProfiles } from "@/tests/mocks/wsl-profiles";
import { renderWithProviders } from "@/tests/render";
import { describe, expect, it } from "vitest";
import WslProfileEditForm from "./WslProfileEditForm";

describe("WslProfileEditForm", () => {
  const testProfile = wslProfiles[0];

  it("renders the form with correct fields and values for edit action", async () => {
    const { container } = renderWithProviders(<WslProfileEditForm />);

    expect(container).toHaveInputValues([
      testProfile.title,
      testProfile.description,
    ]);
  });
});
