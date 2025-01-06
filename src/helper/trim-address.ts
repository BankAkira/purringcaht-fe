export default function trimAddress(
  address?: string,
  startSubStringLength = 5,
  endSubStringLength = 4
) {
  if (!address) return '';

  if (address) {
    return `${address.substring(
      0,
      startSubStringLength
    )}....${address.substring(address.length - endSubStringLength)}`;
  }
}
