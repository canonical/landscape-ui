import { buildFeedbackIntegration } from '@sentry/feedback';
import { lazyLoadIntegration } from './utils/lazyLoadIntegration.js';

const feedbackAsyncIntegration = buildFeedbackIntegration({
  lazyLoadIntegration
});

export { feedbackAsyncIntegration };
//# sourceMappingURL=feedbackAsync.js.map
