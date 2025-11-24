import get from 'lodash/get';

const interpolate = (template: string, vars: object) => {
  return JSON.parse(template, (_, rawValue) => {
    if (rawValue !== null) {
      if (rawValue[0] !== '$') {
        return rawValue;
      }

      const name = rawValue.slice(2, -1);
      const value = get(vars, name);

      if (typeof value === 'undefined') {
        throw new ReferenceError(`Variable ${name} is not defined`);
      }

      return value;
    }
  });
};

export default interpolate;
