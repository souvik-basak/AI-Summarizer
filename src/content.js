function getArticleText() {
  const article = document.querySelector("article");
  if (article) {
    return article.innerText;
  }
  const paragraphs = Array.from(document.querySelectorAll("p"));
  return paragraphs.map((p) => p.innerText).join("\n");
}

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if ((request.type = "GET_ARTICLE_TEXT")) {
    const articleText = getArticleText();
    sendResponse({ text: articleText });
  }
});
