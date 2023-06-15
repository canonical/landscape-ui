interface TestObject<T> {
  test: (value: T) => boolean;
  message: string;
}

export const testLowercaseAlphaNumeric: TestObject<string> = {
  test: (str) => {
    return /^[a-z0-9][-+a-z0-9]*$/.test(str);
  },
  message:
    "It has to start with an alphanumeric character and only contain lowercase letters, numbers and - or + signs.",
};
