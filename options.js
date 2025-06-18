document.addEventListener("DOMContentLoaded", () => {
  const apiKeyInput = document.getElementById("apiKey");
  const successMessage = document.getElementById("successMessage");
  const form = document.getElementById("optionsForm");

  // Pre-fill API key if already saved
  chrome.storage.sync.get(["geminiApiKey"], (result) => {
    if (result.geminiApiKey) {
      apiKeyInput.value = result.geminiApiKey;
    }
  });

  // Handle save
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) return;

    chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
      successMessage.classList.remove("hidden");

      setTimeout(() => {
        // Try to close the tab
        window.close();

        chrome.tabs.getCurrent((tab) => {
          if (tab) {
            chrome.tabs.remove(tab.id);
          }
        });
      }, 1000);
    });
  });
});
