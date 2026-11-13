import { buildFeedbackIntegration, feedbackScreenshotIntegration, feedbackModalIntegration } from '@sentry/feedback';

const feedbackSyncIntegration = buildFeedbackIntegration({
  getModalIntegration: () => feedbackModalIntegration,
  getScreenshotIntegration: () => feedbackScreenshotIntegration
});

export { feedbackSyncIntegration };
//# sourceMappingURL=feedbackSync.js.map
