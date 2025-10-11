export function strHtmlHasTextContent(htmlString: string) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;

  function hasText(node: any) {
    if (node.nodeType === 3 && node.nodeValue.trim() !== '') {
      return true;
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      if (hasText(node.childNodes[i])) {
        return true;
      }
    }

    return false;
  }

  return hasText(tempDiv);
}
