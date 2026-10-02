import { setupWorker } from 'msw/browser';
import { createBrowserHandlers } from './authTesting/browserHandlers';
import { getAuthTestingConfig } from './authTesting/config';

export const worker = setupWorker(
  ...createBrowserHandlers(getAuthTestingConfig(import.meta.env)),
);
