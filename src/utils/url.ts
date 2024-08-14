export const queryStringToObject = <T>(): Partial<T> =>
  inputQueryStringToObject(global.window.location.search);

export const inputQueryStringToObject = <T>(qs: string): Partial<T> => {
  if (qs.startsWith("?")) qs = qs.substring(1);
  try {
    const innerObject = decodeURI(qs)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"');
    return JSON.parse(`{"${innerObject}"}`);
  } catch (e) {
    return {};
  }
};

export const objectToQueryString = (obj: object): string => {
  let qs = "?";
  let keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    if (i > 0) {
      qs += ",";
    }
    // @ts-ignore
    let value = encodeURI(String(obj[keys[i]]));
    qs += `${keys[i]}=${value}`;
  }
  return qs;
};
