import { setupWorker } from 'msw/browser';
import { createBrowserHandlers } from './authTesting/browserHandlers';
import { getAuthTestingConfig } from './authTesting/config';
import { ROOT_PATH } from '@/constants';
import { MOCK_INVITATION_ID } from './authTesting/handlers';

const authTestingConfig = getAuthTestingConfig(import.meta.env);
if (authTestingConfig?.invitationEnabled) {
  console.info(
    'MSW authentication testing invitation:',
    new URL(
      `${ROOT_PATH}accept-invitation/${MOCK_INVITATION_ID}`,
      window.location.origin,
    ).href,
  );
}

export const worker = setupWorker(...createBrowserHandlers(authTestingConfig));
