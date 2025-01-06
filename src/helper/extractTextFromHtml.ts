export const extractTextFromHtml = (htmlString?: string) => {
  if (!htmlString) {
    return { boldText: '', paragraphText: '' };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  const boldElement = doc.querySelector('div');
  const boldText = boldElement ? boldElement.textContent || '' : '';

  let paragraphText = '';
  const matchSpan = htmlString.match(/<text-content>(.*?)<\/text-content>/s);
  const matchP = htmlString.match(/<p>(.*?)<\/p>/s);
  if (matchSpan) {
    paragraphText = matchSpan[1];
  } else if (matchP) {
    paragraphText = matchP[1];
  }

  return { boldText, paragraphText };
};
