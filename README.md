# Career Copilot 🚀

**One Stop Personalized AI-Powered Career & Education Advisor**

---

## 💡 Overview
Career Copilot is a dynamic, modern website designed to guide students in their career and education journey. This project uses the Google Gemini API to provide a **personalized roadmap** and curated **courses** based on user input, and includes a **task reminder system**.

---

## 🖥️ Features

1.  **Dynamic Onboarding**
    -   Collects user's Name, Education Branch, and Interests via text input.

2.  **AI-Powered Dashboard**
    -   **Roadmap Tab**: Generates a real-time, step-by-step career roadmap tailored to the user's profile and interests.
    -   **Courses Tab**: Recommends a personalized list of online courses.
    -   **Tasks Tab**: A simple to-do list with localStorage persistence to track personal goals.

3.  **Modern, Professional UI**
    -   Clean, responsive, and intuitive design suitable for all devices.

---

## ⚙️ Tech Stack

-   **Frontend**: HTML, CSS, JavaScript
-   **Backend**: Node.js, Express.js
-   **AI Model**: Google Gemini 1.5 Flash
-   **Data Persistence**: Browser LocalStorage for tasks and user sessions.

---

## 🚀 How to Run

### Prerequisites
-   Node.js and npm installed.
-   A Google AI Studio API Key.

### 1. Setup
1.  Clone this repository.
2.  Navigate into the `career_copilot` directory:
    ```bash
    cd career-copilot
    ```
3.  Install the backend dependencies:
    ```bash
    npm install
    ```
4.  Create a file named `.env` in the root directory.
5.  Add your API key to the `.env` file:
    ```
    API_KEY=YOUR_GOOGLE_AI_API_KEY
    ```

### 2. Running the Application
1.  **Start the Backend Server:**
    Open a terminal in the project directory and run:
    ```bash
    npm start
    ```
    The server will be running at `http://localhost:3000`.

2.  **Open the Frontend:**
    Open the `index.html` file in your web browser.

You can now use the application, and it will communicate with your local server to get AI-generated advice!
