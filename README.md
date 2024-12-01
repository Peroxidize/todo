# Todo App

A feature-rich **Todo Application** that helps you manage your tasks efficiently. The app supports task categorization, priority management, search functionality, and progress tracking. It also leverages **local storage** to persist your tasks across sessions.

The app is styled using **Tailwind CSS** to ensure a responsive and modern UI, and it uses **animations** to enhance the user experience with smooth transitions and interactions.

## Features

### 📋 **Task Management**

- Add, update, and delete tasks seamlessly.
- Mark tasks as completed or incomplete.

### 🔍 **Filtering and Searching**

- Filter tasks by:
    - Categories (e.g., Work, Personal, Shopping)
    - Priorities (High, Medium, Low)
    - Completion Status (Completed, Incomplete)
- Search tasks by title.

### 📊 **Progress Tracking**

- Visual progress trackers for different categories.
- Progress updates in real time based on task completion.

### 💾 **Persistent Storage**

- All tasks are stored in **localStorage**, ensuring data is available even after refreshing or closing the browser.

## Code Overview

### Key Files

- `index.html`: The main HTML file.
- `js/init.js`: Initializes the app and manages event listeners.
- `js/helper.js`: Helper functions for task manipulation and filtering.
- `js/components.js`: Functions for creating UI components dynamically.

### Core Modules

- **Components Module (`components.js`)**
    - Dynamically generates UI elements such as task cards and modals.
- **Helper Module (`helper.js`)**
    - Handles localStorage operations and task filtering logic.