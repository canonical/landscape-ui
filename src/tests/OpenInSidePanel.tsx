import type { SidePanelSize } from "@/context/sidePanel";
import useSidePanel from "@/hooks/useSidePanel";
import type { FC, ReactNode } from "react";

export const OPEN_SIDE_PANEL_LABEL = "Open side panel";

interface OpenInSidePanelProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly size?: SidePanelSize;
}

/**
 * Renders a button that opens `children` in the real side panel, so tests can
 * exercise close/back overrides that only exist inside a mounted side panel.
 */
export const OpenInSidePanel: FC<OpenInSidePanelProps> = ({
  title,
  children,
  size,
}) => {
  const { setSidePanelContent } = useSidePanel();

  return (
    <button
      type="button"
      onClick={() => {
        setSidePanelContent(title, children, size);
      }}
    >
      {OPEN_SIDE_PANEL_LABEL}
    </button>
  );
};
