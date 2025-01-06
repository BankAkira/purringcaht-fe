/**
 * Converts URLs in a given text to clickable links.
 *
 * @param {string} text - The text to convert URLs in.
 * @return {JSX.Element[]} An array of JSX elements representing the converted text.
 */
const ConvertToLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          className="cursor-pointer underline text-blue-500 hover:text-blue-700"
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    return part;
  });
};

export default ConvertToLinks;
