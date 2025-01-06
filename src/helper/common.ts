export function isBase64(str: string) {
  if (str.length % 4 !== 0 || /[^A-Za-z0-9+/=]/.test(str)) {
    return false;
  }

  try {
    atob(str);
    return true;
  } catch (e) {
    return false;
  }
}
