public link 
https://research-summarizer-citation-database.ai.studio/

screen shots
<img width="1080" height="2400" alt="1000420307" src="https://github.com/user-attachments/assets/278b2af9-bfa9-483a-97a1-10c716b407f4" />
<img width="1080" height="2400" alt="1000420308" src="https://github.com/user-attachments/assets/08b2537b-9282-4b27-a9de-69a1efaa1dd4" />
<img width="1080" height="2400" alt="1000420309" src="https://github.com/user-attachments/assets/6723d91a-12e1-4e0f-aa27-b9869b9427aa" />
<img width="1080" height="2400" alt="1000420307" src="https://github.com/user-attachments/assets/35c55037-5098-4514-a863-2d6ad36af5fd" />
<img width="1080" height="2400" alt="1000420306" src="https://github.com/user-attachments/assets/0af938c1-4ce8-4c7c-81ce-d2a2e26c7c19" />
<img width="1080" height="2400" alt="1000420305" src="https://github.com/user-attachments/assets/6c566350-0872-4ad9-bc89-4abe45c07520" />
<img width="1080" height="2400" alt="1000420304" src="https://github.com/user-attachments/assets/90349d46-c574-4493-bb8c-6cd826ed708c" />
Research Summarizer & Citation Database
name: scholar plus Ai
> An AI-powered research assistant that condenses academic papers into structured summaries and automatically organizes formatted citations into a searchable database.

---

 Project Overview

 **The Problem**
Students, researchers, and academics spend countless hours reading through dense, complex research papers and manually formatting citations for their reference lists. Keeping track of dozens of source documents across different subjects often leads to disorganized notes and lost sources.

 **The Solution**
**Research Summarizer & Citation Database** solves this by automating the tedious parts of academic research:
1. **Instant AI Summarization:** Uses tailored Google Gemini instructions to break down research text into clear key takeaways, methodology, and conclusions.
2. **Automated Citation Generator:** Extracts bibliographic metadata and formats citations accurately across major academic styles (APA, MLA, Chicago).
3. **Centralized Citation Library:** Stores your summarized papers and citations in a searchable, organized database for quick retrieval.

---

Live Demo

* **Deployed Web App:** [https://research-summarizer-citation-database.ai.studio](https://research-summarizer-citation-database.ai.studio)

---

 Features

* **AI-Powered Paper Summarization:** Instantly transforms long academic articles or notes into structured, easy-to-read executive summaries.
* **Smart Citation Extraction:** Automatically extracts paper details (Authors, Title, Year, Journal/Publisher) and formats them into APA 7, MLA 9, or Chicago styles.
* **Searchable Personal Database:** Save, search, and filter your summarized research and citations by keyword or citation style.
* **One-Click Citation Copy:** Easily copy pre-formatted citations directly to your clipboard for use in bibliographies.
* **User Authentication & Persistence:** Secure user sign-in ensuring your saved research database remains private and accessible across devices.

---

AI Implementation

This app utilizes **Google Gemini** models via custom-crafted system instructions:
* **Custom Prompts:** Structured system prompts instruct the model to rigorously parse text, separate key findings from methodology, and output clean JSON/data structures containing author details, publication years, and core takeaways.
* **Accuracy & Focus:** The prompts enforce strict extraction guidelines to minimize AI hallucinations and ensure academic fidelity.

---

 Tech Stack & Architecture

* **Frontend / UI:** HTML5 / React / Tailwind CSS
* **Backend & Storage:** Firebase Firestore & Authentication (or Cloud SQL / Google Cloud integrations)
* **AI Engine:** Google Gemini API (via Google AI Studio)
* **Hosting / Deployment:** Google AI Studio App Platform

---

Local Setup & Installation

To run this project locally:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git)
   cd YOUR_REPOSITORY_NAME
 How to Run the Project

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/khanzadawum11-beep/Scholar-plus-Ai.git](https://github.com/khanzadawum11-beep/Scholar-plus-Ai.git)
   cd Scholar-plus-Ai
   npm install
   Set up Environment Variables:
 Code snippet NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here 
 Run the development server:
npm run dev 

The public live link of app ([https://research-summarizer-citation-database.ai.studio](https://research-summarizer-citation-database.ai.studio)

## 📁 Project Structure

```text
Scholar-plus-Ai/
├── public/                # Static assets and icons
├── src/
│   ├── components/        # UI components (Summarizer, Citation Generator)
│   ├── services/          # Gemini API & Firebase configuration
│   ├── utils/             # Citation formatting helpers (APA, MLA, Chicago)
│   └── App.js             # Main application entry point
├── .env.local             # Environment variables (API Keys)
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation and report

