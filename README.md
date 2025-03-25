# Task Management App

## Overview
The Task Management App is a React-based application designed to help users manage their tasks effectively. It includes features like adding, updating, filtering, and deleting tasks with drag-and-drop functionality. The app also supports local storage, ensuring task persistence across sessions.

## Features
- Add, update, and delete tasks.
- Drag-and-drop task reordering.
- Filter tasks by due date (today, tomorrow, or a specific date).
- Filter tasks by priority (low, medium, high).
- Task persistence using local storage.

## Tech Stack
- **React**: For UI components and state management.
- **React DnD**: For drag-and-drop functionality.
- **Tailwind CSS**: For styling.

## Getting Started
1. Clone the repository:
```bash
git clone <repository-url>
```
2. Install dependencies:
```bash
npm install
```
3. Run the application:
```bash
npm start
```

## Folder Structure
```
/src
  ├── components
  │   ├── TaskCard.jsx
  │   ├── TaskForm.jsx
  │   ├── TaskList.jsx
  ├── context
  │   └── TaskProvider.jsx
  ├── App.jsx
  └── index.jsx
```

## Usage
- **Adding a Task:** Use the form to add a new task with a title, description, due date, and priority.
- **Editing a Task:** Click the 'Update' button on a task card.
- **Deleting a Task:** Click the 'Delete' button on a task card.
- **Reordering Tasks:** Drag and drop tasks to reorder them.

## Future Improvements
- Implement user authentication.
- Add notifications for task deadlines.
- Integrate a backend for multi-user support.

## Contributions
Feel free to fork this project and submit pull requests. Contributions are welcome!

## License
This project is licensed under the MIT License.

