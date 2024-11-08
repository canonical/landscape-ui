import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  EditUserForm,
  useUserGeneralSettings,
} from "@/features/general-settings";
import useEnv from "@/hooks/useEnv";
import { Link } from "@canonical/react-components";
import classNames from "classnames";
import { FC } from "react";
import { useMediaQuery } from "usehooks-ts";
import classes from "./GeneralSettings.module.scss";

const GeneralSettings: FC = () => {
  const isSmallerScreen = useMediaQuery("(max-width: 619px)");
  const { isSaas } = useEnv();
  const { getUserDetails } = useUserGeneralSettings();
  const { data: userData, isLoading } = getUserDetails();

  const user = userData?.data;

  return (
    <PageMain>
      <PageHeader
        title="General"
        helperContent={
          isSaas ? (
            <span
              className={classNames("u-text--muted", classes.helperContent, {
                "u-no-padding--bottom": isSmallerScreen,
              })}
            >
              listed from{" "}
              <Link
                className={classes.link}
                href="https://login.ubuntu.com/"
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                Ubuntu One
              </Link>
            </span>
          ) : null
        }
      />
      <PageContent container="medium">
        {isLoading && <LoadingState />}
        {user && <EditUserForm user={user} />}
      </PageContent>
    </PageMain>
  );
};

export default GeneralSettings;
