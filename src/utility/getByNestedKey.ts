export default function getByNestedKey(obj: Record<string, any>, key: string)
  : string | Record<any, string> {
  let o = obj;
  let s = key;
  s = s.replace(/\[(\w+)]/g, '.$1'); // convert indexes to properties
  // eslint-disable-next-line no-param-reassign
  s = s.replace(/^\./, ''); // strip a leading dot
  const a = s.split('.');
  // eslint-disable-next-line no-plusplus
  for (let i = 0, n = a.length; i < n && o; ++i) {
    const k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  // eslint-disable-next-line consistent-return
  return o;
}
