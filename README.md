
# 🧠 ConciseAI

**ConciseAI** is a lightweight, customizable, and powerful tool that uses Google Gemini’s models to convert articles into smart summaries. It supports multiple summary styles, tones, and reading levels. With chat integration and tag generation, this tool is ideal for readers, students, content creators, and researchers.

---

## 📁 File Structure

```

AI_SUMMARIZER/
├── node_modules/
├── src/
│ ├── background.js
│ ├── content.js
│ ├── input.css
│ ├── output.css
│ ├── popup.html
│ └── popup.js
├── .gitignore
├── icon.png
├── manifest.json
├── options.html
├── options.js
├── package-lock.json
└── package.json


````

---

## 🚀 Features

- 🔍 **Smart Summarization**  
  Multiple formats including:
  - Brief  
  - Detailed  
  - Bullet  
  - Analytical  
  - Simplified  
  - Question-Based  
  - Tweet Thread  

- 🎯 **Adjustable Tone**: Neutral, Casual, Formal, Witty, Persuasive  
- 📖 **Reading Levels**: Basic, Intermediate, Advanced  
- 🌍 **Multilingual**: English, Hindi, Bengali, Spanish, French, German, Chinese, Arabic, Japanese  
- 💬 **Ask AI**: Embedded ChatGPT-style interaction  
- 🏷️ **Generate Hashtags**: AI-generated relevant tags  
- 📋 **Copy Summary**: One-click copy feature  
- ✨ **Shimmer Loader**: Elegant loading animation  
- 🌗 **Dark Mode Toggle (Planned)** 

---

## 🎯 Purpose

The tool is designed to:
- Help users quickly understand long-form content
- Save time for researchers, bloggers, and busy readers
- Provide content in multiple formats, including tweet threads
- Allow further exploration of content via interactive Q&A
- Adjust tone, reading level, and language preferences.

---

## 📦 Installation

1. **Clone the Repository**

```bash
git clone https://github.com/your-username/ai-summarizer.git
cd ai-summarizer
````

2. **Install Dependencies**

```bash
npm install
```

3. **Build Tailwind CSS**

```bash
npx tailwindcss -i ./input.css -o ./output.css --watch
```

---

## 🧩 Chrome Extension Setup

You can use this as a Chrome Extension:

1. Go to `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load Unpacked**
4. Select your `ai-summarizer` directory
5. It will open the option page, and you have to put the Gemini Api key only for the first time

   ![image](https://github.com/user-attachments/assets/c18921ef-32b2-4990-96d1-1309c297f660)


---

## 🛠 Usage Guide

1. Open or load an article in the browser and open the extension.
   
2. Choose:

   * Summary Type
   * Tone
   * Reading Level
   * Language

3. Click:

   * **Generate** to get your summary
   * **🏷️ Generate Tags** for smart hashtags
   * **💬 Ask AI** to chat about the content
   * **📋 Copy** to copy the summary

---

## 📌 Example Prompts

![image](https://github.com/user-attachments/assets/014d002e-cc68-48f0-aa69-591ae7045d03)

![image](https://github.com/user-attachments/assets/6f62c686-98fa-4247-83cb-fc67883789ec)

![image](https://github.com/user-attachments/assets/4f3141fd-df78-4427-b06b-f017ab6f1c66)

---

## 📅 What's Next?

* [ ] Add Dark/Light Mode toggle
* [ ] Store user preferences 
* [ ] Export summary to PDF/Markdown
* [ ] Save summary/chat history in `localStorage`
* [ ] Add login support for saving summaries

---

## 🤝 Contributing

Contributions are welcome!
If you have suggestions or would like to improve something, please feel free to fork and PR.

---

## 📄 License

Licensed under the MIT License.

---

## 🧠 Built With

* [Gemini API](https://ai.google.dev/gemini-api/docs)
* [Tailwind CSS](https://tailwindcss.com/)
* Vanilla JavaScript
* HTML5

---

## 📬 Contact

For questions, ideas or feedback:
📧 [souvik.basak2404@gmail.com](mailto:souvik.basak2404@gmail.com)
🐦 [@souvikbasak0](https://x.com/souvikbasak0)
