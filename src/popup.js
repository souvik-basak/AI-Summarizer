const generateBtn = document.getElementById("generate-btn");
const summaryOutput = document.getElementById("summary-output");

function stripMarkdown(markdownText) {
  return markdownText
    .replace(/[*_~`#>\[\]()\-!+]|(?:\*\*|__)(.*?)\1/g, "") // bold/italic/symbols
    .trim();
}

function showSkeleton() {
  summaryOutput.textContent = "";
  summaryOutput.classList.add("animate-pulse");
  summaryOutput.innerHTML = `
    <div class="flex flex-col gap-[20px] -mt-10">
      <div class="h-3 rounded w-3/4 shimmer"></div>
      <div class="h-3 rounded w-full shimmer"></div>
      <div class="h-3 rounded w-1/2 shimmer"></div>
      <div class="h-3 rounded w-5/6 shimmer"></div>
      <div class="h-3 rounded w-4/5 shimmer"></div>
      <div class="h-3 rounded w-3/4 shimmer"></div>
      <div class="h-3 rounded w-2/3 shimmer"></div>
    </div>
  `;
}

async function getGeminiSummary(
  text,
  summaryType,
  tone,
  level,
  language,
  apiKey
) {
  const maxLength = 20000;
  const truncatedText =
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  let promptIntro = "";
  switch (summaryType) {
    case "brief":
      promptIntro = "Summarize the following article in 2-3 concise sentences.";
      break;
    case "detailed":
      promptIntro =
        "Write a detailed summary covering all key points and arguments from the article.";
      break;
    case "bullet":
      promptIntro =
        "Summarize the article into 5-7 bullet points, each starting with '•'. Be clear and concise.";
      break;
    case "simplified":
      promptIntro =
        "Simplify the following article so it's easily understood by the general public.";
      break;
    case "analytical":
      promptIntro =
        "Analyze and summarize the article with a focus on key insights, implications, and conclusions.";
      break;
    case "question-based":
      promptIntro =
        "Create a question-and-answer style summary of the article, capturing the key information.";
      break;
    case "tweet-like":
      promptIntro =
        "Convert the following article into a Twitter thread with 5–8 engaging tweets. Each tweet should be concise (under 280 characters), informative, and written in a clear and impactful tone. Use hooks, emojis (if appropriate), and make sure the thread flows naturally. Add a compelling opening tweet and a strong conclusion. you can use newlines to separate tweets.";
    default:
      promptIntro = "Summarize the following article.";
  }

  if (tone) promptIntro += ` Use a ${tone} tone.`;
  if (level) promptIntro += ` Make it suitable for a ${level} reader.`;
  if (language) promptIntro += ` Write in ${language}.`;

  const prompt = `${promptIntro}\n\n${truncatedText}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 },
      }),
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error?.message || "API request failed");
  }

  const data = await res.json();
  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary available."
  );
}

generateBtn.addEventListener("click", async () => {
  showSkeleton();

  const summaryType = document.getElementById("summary-type").value;
  const tone = document.getElementById("tone")?.value || "";
  const level = document.getElementById("reading-level")?.value || "";
  const language = document.getElementById("language")?.value || "";

  chrome.storage.sync.get(["geminiApiKey"], async (result) => {
    if (!result.geminiApiKey) {
      showSummary(
        "❌ API key not found. Please set it in the extension options."
      );
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.sendMessage(
        tab.id,
        { type: "GET_ARTICLE_TEXT" },
        async (res) => {
          if (!res || !res.text) {
            showSummary("❌ Could not extract article text from this page.");
            return;
          }

          try {
            const summary = await getGeminiSummary(
              res.text,
              summaryType,
              tone,
              level,
              language,
              result.geminiApiKey
            );
            showSummary(stripMarkdown(summary));
          } catch (error) {
            showSummary(
              `❌ Error: ${error.message || "Failed to generate summary."}`
            );
          }
        }
      );
    });
  });
});

document.getElementById("copy-btn").addEventListener("click", () => {
  const summaryText = summaryOutput.innerText.trim();
  const btn = document.getElementById("copy-btn");

  if (summaryText) {
    btn.disabled = true;
    btn.innerText = "Copying...";
    navigator.clipboard
      .writeText(summaryText)
      .then(() => {
        const originalText = "📋 Copy";
        btn.innerText = "✅ Copied!";
        btn.style.backgroundColor = "#4CAF50";
        btn.style.color = "#fff";
        setTimeout(() => {
          btn.innerText = originalText;
          btn.style.backgroundColor = "";
          btn.style.color = "";
          btn.disabled = false;
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        btn.disabled = false;
      });
  }
});

const askBtn = document.getElementById("ask-btn");
const chatUI = document.getElementById("chat-ui");
const askControls = document.getElementById("ask-ai-controls");
const chatInput = document.getElementById("chat-input");

askBtn.addEventListener("click", () => {
  const isHidden = chatUI.classList.contains("hidden");
  chatUI.classList.toggle("hidden");
  askBtn.textContent = isHidden ? "❌ Close Ask AI" : "💬 Ask AI";
  askBtn.style.backgroundColor = isHidden ? "#ba4949" : "";
  chatInput.value = "";
});

function appendMessage(sender, text) {
  const chatBox = document.getElementById("chat-ui");
  const msg = document.createElement("div");
  msg.className = `max-w-[75%] px-4 py-2 m-2 rounded-lg whitespace-pre-wrap ${
    sender === "user"
      ? "text-blue-900 self-end ml-auto text-right"
      : "bg-gray-200 text-gray-900 self-start mr-auto text-left"
  }`;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById("chat-send").addEventListener("click", async () => {
  const question = chatInput.value.trim();
  if (!question) return;

  const summary = document.getElementById("summary-output").innerText.trim();
  if (!summary) return alert("Generate summary first.");

  appendMessage("user", question); // ⬅️ Show user's message
  chatInput.value = "";

  const prompt = `Here is the summary: ${summary}\n\nUser question: ${question}`;

  chrome.storage.sync.get(["geminiApiKey"], async ({ geminiApiKey }) => {
    if (!geminiApiKey) {
      appendMessage("ai", "❌ Missing API key");
      return;
    }

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3 },
          }),
        }
      );

      const data = await res.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply.";
      appendMessage("ai", reply); // ⬅️ Show AI's message
    } catch (error) {
      appendMessage("ai", `❌ Error: ${error.message}`);
    }
  });
});

// Tag button click handler
let lastSummaryText = "";

function showSummary(text) {
  const summaryOutput = document.getElementById("summary-output");
  summaryOutput.classList.remove("animate-pulse");
  lastSummaryText = text;
  summaryOutput.innerHTML = `
    <div class="text-gray-800 mb-2 whitespace-pre-wrap">${text}</div>
    <div id="tags-box" class="hidden mt-3 flex flex-wrap gap-2"></div>
  `;
}

document.getElementById("tags-btn").addEventListener("click", async () => {
  const tagsBox = document.getElementById("tags-box");
  if (!tagsBox) return;

  if (!lastSummaryText) {
    alert("❗ Generate a summary first to extract tags.");
    return;
  }

  if (!tagsBox.classList.contains("hidden")) {
    tagsBox.classList.add("hidden");
    return;
  }

  tagsBox.classList.remove("hidden");
  tagsBox.innerHTML = `<span class="text-gray-500 text-sm">Generating tags...</span>`;

  chrome.storage.sync.get(["geminiApiKey"], async ({ geminiApiKey }) => {
    if (!geminiApiKey) {
      tagsBox.innerHTML = `<span class="text-red-600 text-sm">❌ Missing API key</span>`;
      return;
    }

    const prompt = `Based on the following summary, generate 5–7 concise tags or keywords that best represent the main topics. Only return the tags in a comma-separated list.\n\nSummary:\n${lastSummaryText}`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3 },
          }),
        }
      );

      const data = await res.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No tags found.";
      const tags = reply
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length);

      if (tags.length === 0) {
        tagsBox.innerHTML = `<span class="text-gray-500 text-sm">No tags generated.</span>`;
      } else {
        tagsBox.innerHTML = tags
          .map(
            (tag) =>
              `<span class="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">#${tag.replace(
                /^#/,
                ""
              )}</span>`
          )
          .join("");
      }
    } catch (error) {
      console.error(error);
      tagsBox.innerHTML = `<span class="text-red-600 text-sm">❌ Failed to generate tags.</span>`;
    }
  });
});
