import React, { useState } from "react";
import { AxiosResponse } from "axios";
import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import useFetch from "@/hooks/useFetch";
import useSidePanel from "@/hooks/useSidePanel";
import { Select } from "@canonical/react-components";
import { SwitchAccountParams, SwitchAccountResponse } from "./types";
import classNames from "classnames";
import classes from "./OrganisationSwitch.module.scss";

const OrganisationSwitch = () => {
  const debug = useDebug();
  const authFetch = useFetch();
  const { closeSidePanel } = useSidePanel();
  const { user, switchAccount } = useAuth();

  const [account, setAccount] = useState<string>();

  if (!account && user) {
    setAccount(user.current_account);
  }

  const organisations =
    user?.accounts.map((item) => ({
      label: item.title,
      value: item.name,
    })) ?? [];

  const handleOrganisationChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    try {
      setAccount(event.target.value);

      const { data } = await authFetch!.post<
        SwitchAccountResponse,
        AxiosResponse<SwitchAccountResponse>,
        SwitchAccountParams
      >("switch-account", {
        account_name: event.target.value,
      });

      switchAccount(data.token, event.target.value);

      closeSidePanel();
    } catch (error) {
      debug(error);
    }
  };

  return organisations.length > 1 ? (
    <div className={classes.container}>
      <Select
        label="organisation"
        labelClassName={classNames(
          classes.selectLabel,
          "p-text--small p-text--small-caps",
        )}
        options={organisations}
        value={account}
        onChange={handleOrganisationChange}
      />
    </div>
  ) : null;
};

export default OrganisationSwitch;
