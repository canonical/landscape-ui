import { FC, ReactNode } from "react";

interface PageMainProps {
  children: ReactNode;
}

const PageMain: FC<PageMainProps> = ({ children }) => {
  return (
    <main className="l-main">
      <div className="p-panel">{children}</div>
    </main>
  );
};

export default PageMain;
