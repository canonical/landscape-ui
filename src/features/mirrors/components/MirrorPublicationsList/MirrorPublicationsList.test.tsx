import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import MirrorPublicationsList from "./MirrorPublicationsList";
import { publications } from "@/tests/mocks/publications";

describe("MirrorPublicationsList", () => {
  it("renders", () => {
    renderWithProviders(<MirrorPublicationsList publications={publications} />);
  });
});
