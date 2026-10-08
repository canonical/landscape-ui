import { API_URL, IS_SELF_HOSTED_ENV } from "@/constants";
import useEnv from "@/hooks/useEnv";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import type { FC } from "react";
import { describe, expect, it } from "vitest";

const EnvDisplay: FC = () => {
  const { envLoading, isSaas, isSelfHosted } = useEnv();

  return (
    <p>
      {envLoading
        ? "loading"
        : `settled, saas: ${isSaas}, self-hosted: ${isSelfHosted}`}
    </p>
  );
};

describe("EnvProvider", () => {
  it("settles when the deployment cannot be read", async () => {
    server.use(
      http.get(`${API_URL}about`, () =>
        HttpResponse.json({ error: "ServerError" }, { status: 500 }),
      ),
    );

    // Only a build-time override decides the mode then; without one it is
    // neither. Vitest inherits the override from the shell and the env files.
    const isSaas = ["false", "0"].includes(IS_SELF_HOSTED_ENV ?? "");
    const isSelfHosted = ["true", "1"].includes(IS_SELF_HOSTED_ENV ?? "");

    renderWithProviders(<EnvDisplay />);

    expect(screen.getByText("loading")).toBeInTheDocument();
    expect(
      await screen.findByText(
        `settled, saas: ${isSaas}, self-hosted: ${isSelfHosted}`,
      ),
    ).toBeInTheDocument();
  });
});
