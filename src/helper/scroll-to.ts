export function scrollToTop() {
  const mainDiv = document.querySelector('#app-main');

  if (mainDiv) {
    mainDiv.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  } else {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}

export function scrollToBottom(elementId: string) {
  const element = document.querySelector(`#${elementId}`);
  if (element) {
    element.scrollTo({
      top: element.scrollHeight,
    });
  }
}
