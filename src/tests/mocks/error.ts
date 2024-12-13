const testErrorMessage = "Test error message";

export const getTestErrorParams = () => {
  const testError = new Error(testErrorMessage);
  testError.cause = "test";

  return { testError, testErrorMessage };
};
