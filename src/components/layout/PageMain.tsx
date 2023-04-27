import { FC, ReactNode } from "react";

interface PageMainProps {
  children: ReactNode;
}

const PageMain: FC<PageMainProps> = ({ children }) => {
  return <div className="p-panel">{children}</div>;
};

export default PageMain;
