import { useContext } from 'react';
import { NotifyContext } from '../NotifyContext';

export default function useNotify() {
  return useContext(NotifyContext);
}
