import { FC, ReactNode } from "react";

interface InstanceStatusLabelProps {
  icon: ReactNode;
  label: string;
}

const InstanceStatusLabel: FC<InstanceStatusLabelProps> = ({ icon, label }) => {
  return (
    <span>
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
};

export default InstanceStatusLabel;
