import React from "react";
import { Select } from "@canonical/react-components";
import useAuth from "../../hooks/useAuth";
import classes from "./OrganisationSwitch.module.scss";
import classNames from "classnames";
import { useState } from "react";
import useDebug from "../../hooks/useDebug";
import useSidePanel from "../../hooks/useSidePanel";
import { AxiosResponse } from "axios";
import { API_URL } from "../../constants";
import useFetch from "../../hooks/useFetch";

interface SwitchAccountParams {
  account_name: string;
}

interface SwitchAccountResponse {
  token: string;
}

const OrganisationSwitch = () => {
  const debug = useDebug();
  const authFetch = useFetch();
  const { closeSidePanel } = useSidePanel();
  const { user, switchAccount } = useAuth();
  const [account, setAccount] = useState(user?.current_account);
  const organizations =
    user?.accounts.map((item) => ({
      label: item.title,
      value: item.name,
    })) ?? [];

  if (!user || organizations.length === 1) {
    return null;
  }

  const handleOrganisationChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    try {
      setAccount(event.target.value);
      const { data } = await authFetch!.post<
        SwitchAccountResponse,
        AxiosResponse<SwitchAccountResponse>,
        SwitchAccountParams
      >(`${API_URL}switch-account`, {
        account_name: event.target.value,
      });
      switchAccount(data.token, event.target.value);
      closeSidePanel();
    } catch (error) {
      debug(error);
    }
  };

  return (
    <div className={classes.container}>
      <Select
        label="organisation"
        labelClassName={classNames(
          classes.selectLabel,
          "p-text--small p-text--small-caps",
        )}
        options={organizations}
        value={account}
        onChange={handleOrganisationChange}
      />
    </div>
  );
};

export default OrganisationSwitch;
