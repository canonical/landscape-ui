import { FC, ReactNode } from "react";

interface PageContentProps {
  children: ReactNode;
}

const PageContent: FC<PageContentProps> = ({ children }) => {
  return (
    <div className="p-panel__content">
      <div className="p-panel__inner">{children}</div>
    </div>
  );
};

export default PageContent;
