# Chat UI Prototype

This project is a simple prototype of a chat input interface, built using React and Vite.

## Features

*   A text input field for typing messages.
*   Placeholder buttons for actions like "Add", "Search", "Reason", "More", and "Mic".
*   Basic styling to resemble a modern chat input component.

## Project Structure

The project follows a standard Vite + React structure, with components organized under `src/components/`:

```
.
├── public/
├── src/
│   ├── components/
│   │   └── ChatInput/
│   │       ├── ChatInput.jsx
│   │       └── ChatInput.css
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or the next available port).

## Available Scripts

*   `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
*   `npm run build`: Builds the application for production.
*   `npm run lint`: Lints the project files using ESLint.
*   `npm run preview`: Serves the production build locally for preview.
