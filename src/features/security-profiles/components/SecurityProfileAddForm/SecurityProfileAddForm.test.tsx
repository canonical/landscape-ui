import { renderWithProviders } from "@/tests/render";
import { describe, it } from "vitest";
import SecurityProfileAddForm from "./SecurityProfileAddForm";

describe("SecurityProfileAddForm", () => {
  it("should render", async () => {
    renderWithProviders(
      <SecurityProfileAddForm currentDate="" onSuccess={() => undefined} />,
    );
  });
});
