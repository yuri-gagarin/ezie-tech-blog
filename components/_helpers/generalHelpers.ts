export const randomIntFromInterval = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min)
};

export const deepCopyObject = <T>(object: T & Object): T => {
  if (!object) {
    throw new Error(`Undefined argument. Expected argument to be an <object>`);
  }
  if (typeof object !== "object") {
    throw new TypeError(`Expected argument to be a TYPE: <object>, got: ${typeof object}`);
  }
  return JSON.parse(JSON.stringify(object));
};

export const generatePassword = (passLength: number = 8): string => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";
  for (let i = 0, n = charset.length; i < passLength; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}


export const clearClientSessionCookie = ({ cookieName, path, domain }: { cookieName: string; path?: string; domain?: string; }): void => {
  function checkCookie(name: string) {
    return document.cookie.split(";").some((s) => {
      return s.trim().startsWith(name + "=")
    })
  };
  if (checkCookie(cookieName) && window) {
    console.log(window.location.hostname)
    document.cookie = cookieName +`=null; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;}`;
  }
  
}