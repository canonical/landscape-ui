import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { mirrors } from "@/tests/mocks/mirrors";
import { publications } from "@/tests/mocks/publications";
import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import MirrorActions from "./MirrorActions";

const [mirror] = mirrors;
assert(mirror);

const mirrorWithNoPublications = mirrors.find(
  (m) => !publications.some((p) => p.source === m.name),
);
assert(mirrorWithNoPublications);

const renderActions = (m: Mirror = mirror, route?: string) =>
  renderWithProviders(
    <Suspense fallback={<LoadingState />}>
      <MirrorActions
        mirrorDisplayName={m.displayName ?? ""}
        mirrorName={m.name ?? ""}
      />
    </Suspense>,
    undefined,
    route,
  );

const openMenu = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button"));
};

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
