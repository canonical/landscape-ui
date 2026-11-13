import { browserTracingIntegrationShim, feedbackIntegrationShim, spanStreamingIntegrationShim, fetchStreamPerformanceIntegrationShim } from '@sentry-internal/integration-shims';
export * from './index.bundle.base';
export { logger, consoleLoggingIntegration } from '@sentry/core/browser';
export { replayIntegration, getReplay } from '@sentry/replay';
export { elementTimingIntegration } from '@sentry/browser-utils';
export { browserTracingIntegrationShim as browserTracingIntegration, feedbackIntegrationShim as feedbackAsyncIntegration, feedbackIntegrationShim as feedbackIntegration, spanStreamingIntegrationShim as spanStreamingIntegration, fetchStreamPerformanceIntegrationShim as fetchStreamPerformanceIntegration, };
//# sourceMappingURL=index.bundle.replay.logs.metrics.d.ts.map