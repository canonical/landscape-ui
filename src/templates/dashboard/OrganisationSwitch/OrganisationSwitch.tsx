import useAuth from "@/hooks/useAuth";
import { Select } from "@canonical/react-components";
import classNames from "classnames";
import classes from "./OrganisationSwitch.module.scss";
import { useAuthHandle } from "@/features/auth";
import useDebug from "@/hooks/useDebug";
import { ChangeEvent } from "react";

const OrganisationSwitch = () => {
  const { account } = useAuth();
  const debug = useDebug();
  const { switchAccountQuery } = useAuthHandle();

  if (!account.switchable) {
    return null;
  }

  const { mutateAsync: switchAccount } = switchAccountQuery;

  const handleOrganisationChange = async (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const account_name = event.target.value;

    try {
      const { data } = await switchAccount({ account_name });

      account.switch(data.token, account_name);
    } catch (error) {
      debug(error);
    }
  };

  return (
    <div className={classes.container}>
      <Select
        label="Organisation"
        labelClassName={classNames(
          classes.selectLabel,
          "p-text--small p-text--small-caps",
        )}
        options={account.options}
        value={account.current}
        onChange={handleOrganisationChange}
      />
    </div>
  );
};

export default OrganisationSwitch;
