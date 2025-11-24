export const getKeyList = <T extends Record<string, any>>(obj: T) => {
    return Object.keys(obj) as Array<keyof T>;
  };

  export const getKeyObject = <T extends Record<string, any>>(obj: T) => {
    return Object.keys(obj).reduce(
      (acc, key) => {
        acc[key as keyof T] = key as keyof T;
        return acc;
      },
      {} as { [K in keyof T]: K }
    );
  };