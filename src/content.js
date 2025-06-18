function getArticleText() {
  // Try <article>
  const article = document.querySelector("article");
  if (article && article.innerText.trim().length > 200) {
    return article.innerText.trim();
  }

  // Try <main>
  const main = document.querySelector("main");
  if (main && main.innerText.trim().length > 200) {
    return main.innerText.trim();
  }

  // Try grouping <div> blocks with enough text
  const divs = Array.from(document.querySelectorAll("div"))
    .filter((div) => div.innerText.trim().length > 200)
    .sort((a, b) => b.innerText.length - a.innerText.length);

  if (divs.length > 0) {
    return divs[0].innerText.trim();
  }

  // Fallback to collecting all <p> tags
  const paragraphs = Array.from(document.querySelectorAll("p"))
    .map((p) => p.innerText.trim())
    .filter((p) => p.length > 0);

  if (paragraphs.length > 0) {
    return paragraphs.join("\n\n");
  }

  // Final fallback: whole body
  return document.body.innerText.trim();
}

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if ((request.type = "GET_ARTICLE_TEXT")) {
    const articleText = getArticleText();
    sendResponse({ text: articleText });
  }
});
