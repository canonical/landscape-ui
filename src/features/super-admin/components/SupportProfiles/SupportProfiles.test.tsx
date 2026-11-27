import { ProfileTypes } from "@/features/profiles";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SupportProfiles from "./SupportProfiles";

describe("SupportProfiles", () => {
  it.each([ProfileTypes.script, ProfileTypes.usg, ProfileTypes.wsl])(
    "renders nothing for %s profiles, which a support session does not show",
    (type) => {
      const { container } = render(<SupportProfiles type={type} />);

      expect(container).toBeEmptyDOMElement();
    },
  );
});
