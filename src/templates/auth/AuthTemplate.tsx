import { FC, ReactNode } from "react";
import { LoginPageLayout, Notification } from "@canonical/react-components";
import Logo from "@/assets/images/logo-white-character.svg";
import { APP_TITLE, ROOT_PATH } from "@/constants";
import classes from "./AuthTemplate.module.scss";

interface AuthTemplateProps {
  children: ReactNode;
  title: string;
  invitationAccount?: string;
}

const AuthTemplate: FC<AuthTemplateProps> = ({
  title,
  children,
  invitationAccount,
}) => {
  return (
    <div className={classes.root}>
      <LoginPageLayout
        title={title}
        logo={{
          src: Logo,
          title: APP_TITLE,
          url: ROOT_PATH,
        }}
      >
        {invitationAccount && (
          <Notification severity="information">
            {`You've been invited to ${invitationAccount}`}
          </Notification>
        )}
        {children}
      </LoginPageLayout>
    </div>
  );
};

export default AuthTemplate;
