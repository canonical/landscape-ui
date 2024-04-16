export interface ActivityProps {
  title: string;
  description: string;
  acceptButton: {
    label: string;
    onClick: () => void;
  };
}
