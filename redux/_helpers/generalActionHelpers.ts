/**
 * 
 * @param minutesFromNow - Minutes from now for cookie to expire
 * @returns string
 */
export const setCookieExpiration = (minutesFromNow: number): string => {
  const dateNow: Date = new Date();
  const timeNow: number = dateNow.getTime();
  const expireTime: number = timeNow + (minutesFromNow * 60000);
  dateNow.setTime(expireTime);
  return dateNow.toUTCString();
};