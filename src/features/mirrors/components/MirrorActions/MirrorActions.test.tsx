import { mirrors } from "@/tests/mocks/mirrors";
import { publications } from "@/tests/mocks/publications";
import { renderWithProviders } from "@/tests/render";
import { assert, describe, it } from "vitest";
import MirrorActions from "./MirrorActions";

const [mirror] = mirrors;
assert(mirror);

const mirrorWithNoPublications = mirrors.find(
  (m) => !publications.some((p) => p.source === m.name),
);
assert(mirrorWithNoPublications);

describe("MirrorActions", () => {
  it("renders", () => {
    renderWithProviders(
      <MirrorActions
        mirrorDisplayName="Mirror display name"
        mirrorName="mirrors/name"
      />,
    );
  });
});
