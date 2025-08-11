import usePageParams from "@/hooks/usePageParams";
import { Button, Icon } from "@canonical/react-components";
import type { ComponentProps } from "react";
import { type FC } from "react";
import { useGetScriptProfileLimits, useGetScriptProfiles } from "../../api";

interface AddScriptProfileButtonProps {
  readonly appearance?: ComponentProps<typeof Button>["appearance"];
}

const AddScriptProfileButton: FC<AddScriptProfileButtonProps> = ({
  appearance,
}) => {
  const { setPageParams } = usePageParams();

  const { scriptProfilesCount: activeScriptProfilesCount } =
    useGetScriptProfiles({ listenToUrlParams: false }, { archived: "active" });
  const { scriptProfileLimits } = useGetScriptProfileLimits();

  const addProfile = () => {
    setPageParams({ action: "add", scriptProfile: -1 });
  };

  return (
    <Button
      type="button"
      appearance={appearance}
      onClick={addProfile}
      className="u-no-margin--bottom"
      hasIcon
      disabled={
        (activeScriptProfilesCount ?? 0) >=
        (scriptProfileLimits?.max_num_profiles ?? 0)
      }
    >
      <Icon name="plus" light={appearance === "positive"} />
      <span>Add profile</span>
    </Button>
  );
};

export default AddScriptProfileButton;
