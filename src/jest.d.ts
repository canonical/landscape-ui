declare namespace jest {
  interface AsymmetricMatchers {
    toBeOffScreen(): void;
  }

  interface Matchers<R> {
    toBeOffScreen(): R;
    toHaveTexts: (texts: string[]) => R;
  }
}
