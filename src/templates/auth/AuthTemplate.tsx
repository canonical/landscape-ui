import Logo from "@/assets/images/logo-white-character.svg";
import { APP_TITLE } from "@/constants";
import { LoginPageLayout } from "@canonical/react-components";
import type { FC, ReactNode } from "react";
import classes from "./AuthTemplate.module.scss";

interface AuthTemplateProps {
  readonly children: ReactNode;
  readonly title: string;
}

const AuthTemplate: FC<AuthTemplateProps> = ({ title, children }) => {
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
        <>{children}</>
      </LoginPageLayout>
    </div>
  );
};

export default AuthTemplate;
