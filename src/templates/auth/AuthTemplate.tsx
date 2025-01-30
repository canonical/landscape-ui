import type { FC, ReactNode } from "react";
import { LoginPageLayout, Notification } from "@canonical/react-components";
import Logo from "@/assets/images/logo-white-character.svg";
import { APP_TITLE } from "@/constants";
import classes from "./AuthTemplate.module.scss";
import { useInvitation } from "@/features/auth";

interface AuthTemplateProps {
  readonly children: ReactNode;
  readonly title: string;
}

const AuthTemplate: FC<AuthTemplateProps> = ({ title, children }) => {
  const { invitationAccount } = useInvitation();

  return (
    <div className={classes.root}>
      <LoginPageLayout
        title={title}
        logo={{
          src: Logo,
          title: APP_TITLE,
          url: "/",
        }}
      >
        {invitationAccount?.account_title && (
          <Notification severity="information">
            {`You've been invited to ${invitationAccount?.account_title}`}
          </Notification>
        )}
        {children}
      </LoginPageLayout>
    </div>
  );
};

export default AuthTemplate;
