export interface FormProps {
  title: string;
  access_group: string;
  instanceType: string;
  customImageName: string;
  description: string;
  rootfsImage: string;
  cloudInitType: string;
  cloudInit: File | string | null;
  all_computers: boolean;
  tags: string[];
}
