import { FC, ReactNode } from "react";
import classes from "./AuthTemplate.module.scss";
import Logo from "../../assets/images/logo-dark-full.svg";
import { APP_TITLE } from "../../constants";
import NotifyProvider from "../../context/notify";

interface AuthTemplateProps {
  title: string;
  children: ReactNode;
}

const AuthTemplate: FC<AuthTemplateProps> = ({ title, children }) => {
  return (
    <NotifyProvider>
      <div className={classes.root}>
        <div>
          <img src={Logo} alt={APP_TITLE} width={175} height={56} />
        </div>
        <div className={classes.inner}>
          <h1 className={classes.title}>{title}</h1>
          <div>{children}</div>
        </div>
      </div>
    </NotifyProvider>
  );
};

export default AuthTemplate;
