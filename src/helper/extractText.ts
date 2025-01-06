/**
 * Extracts the ID part of a string, given a search text.
 *
 * @param {string} value The string to extract the ID from.
 * @param {string} searchText The text to search for in the string.
 * @returns {string | null} The extracted ID, or null if not found.
 */
export function extractId(value: string, searchText: string): string | null {
  // Check if the provided value contains the specified searchText
  if (value.includes(searchText)) {
    // Extract and return the last part of the string after splitting by '/'
    const id = value.split('/').pop();

    // Return the ID if it exists, otherwise return null
    return id || null;
  }

  // Return null if the searchText is not found in the value
  return null;
}
export function shortenAddress(
  address: string | undefined,
  startLength: number = 6,
  endLength: number = 4
): string {
  if (!address) return '';
  if (address.length <= startLength + endLength) {
    return address; // Return the full address if it's too short to shorten
  }

  const start = address.slice(0, startLength);
  const end = address.slice(-endLength);

  return `${start}...${end}`;
}
