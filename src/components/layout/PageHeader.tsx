import { FC, ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  actions?: ReactNode[];
}

const PageHeader: FC<PageHeaderProps> = ({ title, actions = [] }) => {
  return (
    <div className="p-panel__header">
      <h1 className="p-panel__title">{title}</h1>
      {actions.length > 0 && <div className="p-panel__controls">{actions}</div>}
    </div>
  );
};

export default PageHeader;
