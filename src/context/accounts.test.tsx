import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import type { FC } from "react";
import { describe, expect, it } from "vitest";
import { API_URL } from "@/constants";
import useAuth from "@/hooks/useAuth";
import useSwitchAccount from "@/hooks/useSwitchAccount";
import { authResponse, authUser } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";

const SWITCH_DELAY_MS = 100;
const OTHER_ACCOUNT = "second-account";
const SIGNED_OUT = "Signed out";

/** Serves `GET /me` as signed in until `signOut` is called. */
const serveSession = () => {
  let signedIn = true;

  server.use(
    http.get(`${API_URL}me`, () =>
      HttpResponse.json(signedIn ? authResponse : {}),
    ),
  );

  return {
    signOut: () => {
      signedIn = false;
    },
  };
};

/** Switches account and signs out, logging the account of every render. */
const Session: FC<{ readonly seen: string[] }> = ({ seen }) => {
  const { user, logout } = useAuth();
  const { switchAccount } = useSwitchAccount();
  const account = user ? `In ${user.current_account}` : SIGNED_OUT;

  seen.push(account);

  return (
    <>
      <p>{account}</p>
      <button
        type="button"
        onClick={() => {
          void switchAccount(OTHER_ACCOUNT);
        }}
      >
        Switch
      </button>
      <button type="button" onClick={logout}>
        Sign out
      </button>
    </>
  );
};

describe("AccountsProvider", () => {
  it("applies a switch to the session it lands in", async () => {
    serveSession();
    const user = userEvent.setup();

    renderWithProviders(<Session seen={[]} />);

    await user.click(await screen.findByRole("button", { name: "Switch" }));

    expect(await screen.findByText(`In ${OTHER_ACCOUNT}`)).toBeInTheDocument();
  });

  it("does not sign the person back in when a switch lands after sign-out", async () => {
    const session = serveSession();
    server.use(
      http.post(`${API_URL}switch-account`, async () => {
        await delay(SWITCH_DELAY_MS);
        return HttpResponse.json({ token: "late-token" });
      }),
    );
    const user = userEvent.setup();
    const seen: string[] = [];

    renderWithProviders(<Session seen={seen} />);

    expect(
      await screen.findByText(`In ${authUser.current_account}`),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Switch" }));
    session.signOut();
    await user.click(screen.getByRole("button", { name: "Sign out" }));

    expect(await screen.findByText(SIGNED_OUT)).toBeInTheDocument();

    // Long enough for the switch to land.
    await delay(SWITCH_DELAY_MS * 2);
    await waitFor(() => {
      expect(screen.getByText(SIGNED_OUT)).toBeInTheDocument();
    });
    expect(seen).not.toContain(`In ${OTHER_ACCOUNT}`);
  });
});
