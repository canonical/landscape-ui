import { FC, useState } from "react";
import { Button } from "@canonical/react-components";
import { SelectOption } from "../../../../../../types/SelectOption";
import { Administrator } from "../../../../../../types/Administrator";
import useAccessGroup from "../../../../../../hooks/useAccessGroup";
import useDebug from "../../../../../../hooks/useDebug";
import useNotify from "../../../../../../hooks/useNotify";
import classes from "./AdministratorRolesCell.module.scss";
import MultiSelectField from "../../../../../../components/form/MultiSelectField";

interface AdministratorRolesCellProps {
  administrator: Administrator;
  roleOptions: SelectOption[];
}

const AdministratorRolesCell: FC<AdministratorRolesCellProps> = ({
  administrator,
  roleOptions,
}) => {
  const [currentRoles, setCurrentRoles] = useState(administrator.roles);

  const debug = useDebug();
  const { notify } = useNotify();
  const { addPersonsToRoleQuery, removePersonsFromRoleQuery } =
    useAccessGroup();

  const { mutateAsync: addPersonsToRole } = addPersonsToRoleQuery;
  const { mutateAsync: removePersonsFromRole } = removePersonsFromRoleQuery;

  const handleAdministratorRolesChange = async () => {
    const addRolesPromises = currentRoles
      .filter((role) => !administrator.roles.includes(role))
      .map((role) =>
        addPersonsToRole({ name: role, persons: [administrator.email] }),
      );

    const removeRolesPromises = administrator.roles
      .filter((role) => !currentRoles.includes(role))
      .map((role) =>
        removePersonsFromRole({ name: role, persons: [administrator.email] }),
      );

    try {
      await Promise.all([...addRolesPromises, ...removeRolesPromises]);

      notify.success({
        title: "Permission changes have been queued",
        message: `You changed ${administrator.name}'s roles`,
      });
    } catch (error) {
      debug(error);
    }
  };

  return (
    <MultiSelectField
      variant="condensed"
      className={classes.multiSelect}
      items={roleOptions}
      selectedItems={roleOptions.filter(({ value }) =>
        currentRoles.includes(value),
      )}
      onItemsUpdate={(items) =>
        setCurrentRoles(items.map(({ value }) => value as string))
      }
      placeholder="Select roles"
      dropdownFooter={
        <div className={classes.footer}>
          <Button
            type="button"
            dense
            small
            appearance="positive"
            className="u-no-margin--bottom"
            disabled={
              currentRoles.length === administrator.roles.length &&
              administrator.roles.every((role) => currentRoles.includes(role))
            }
            onClick={handleAdministratorRolesChange}
          >
            Save changes
          </Button>
          <Button
            type="button"
            dense
            small
            className="u-no-margin--bottom"
            disabled={
              currentRoles.length === administrator.roles.length &&
              administrator.roles.every((role) => currentRoles.includes(role))
            }
            onClick={() => setCurrentRoles(administrator.roles)}
          >
            Revert
          </Button>
        </div>
      }
    />
  );
};

export default AdministratorRolesCell;
