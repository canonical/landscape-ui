import { useContext } from 'react';
import { SidePanelContext } from '../SidePanelContext';

export default function useSidePanel() {
  return useContext(SidePanelContext);
}
