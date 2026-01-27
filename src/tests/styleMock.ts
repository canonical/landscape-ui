const styles = new Proxy<Record<string, string>>(
  {},
  {
    get: (target, prop) => {
      if (typeof prop === "string") {
        return prop;
      }
      return target[prop as unknown as keyof typeof target];
    },
  },
);

export default styles;
