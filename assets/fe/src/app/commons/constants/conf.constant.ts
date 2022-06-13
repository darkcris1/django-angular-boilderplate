//@ts-ignore
// import moment from 'moment';

/* 18 random characters that will represent as the
 * key name of the user token in the client side.
 */
export const AUTH_KEY = 'FDZeQCcykQpQMWNYtAQ';

/* API URL
 */
export const API_URL = '/api/';

/* HOST
 */
export const HOST = `${(window as any).location?.host}`;
export const PROTOCOL = (window as Window).location.protocol === 'https:' ? 'wss://': 'ws://';


/* STREAM URL
 */
export const STREAM_URL = '/stream/';
export const API_STREAM = `${PROTOCOL}${HOST}${STREAM_URL}`;

// export const currentDateTime = moment.utc();

// export const timezone = () => {
//   const t_ = moment.utc();
//   const t_str = t_.format('YYYY-M-D');

//   function __obj(_dt: string) {
//     const dt = _dt.split('-').map(Number);
//     return {year: dt[0], month: dt[1], day: dt[2]};
//   }
//   return {now: t_, strnow: t_str, obj: __obj(t_str)}
// };