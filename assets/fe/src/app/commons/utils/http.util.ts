/* transform a list of strings into url path
 * separated by trailing slash
 */
export let urlsafe = (url: string, ...params: any[]): string => {
    return url.concat(params.join('/'), '/');
  };
  
/* transform an object data into URLencoded string
  */
export let encodeURL = (url: string, data: any): string => {
  let params = new URLSearchParams(data);

  return `${url}?${params.toString()}`;
}