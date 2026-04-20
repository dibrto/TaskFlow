# TaskFlow

### 1. Application Purpose

The goal of TaskFlow is to help users organize and manage their tasks efficiently using a board-based (Kanban-style) system.
The application allows users to create boards, add tasks, and track progress in a structured and intuitive way.

The app is available at https://taskflow-bg.vercel.app/

---

### 2. User Roles

### Guest (Not Authenticated User)

- Can register a new account
- Can log in to an existing account

---

### Authenticated User

- Can create, edit, and delete boards
- Can create, edit, and delete tasks
- Can organize tasks within boards
- Can view all their boards
- Can manage only their own data

---

### 3. Public Features

- Home page
- Login page
- Registration page

---

### 4. Authenticated User Features

- Create new board
- Edit board
- Delete board
- View all boards
- Open a board to see its tasks
- Create new tasks inside a board
- Edit tasks
- Delete tasks
- Organize tasks by task columns
- Drag & Drop tasks between columns

---

### 5. Main Application Flow

1. User opens the home page
2. User registers or logs in
3. After successful authentication, the user is redirected to the boards dashboard
4. User creates a new board or open an existing board
5. Creates tasks or viewing exising tasks
6. User manages tasks (edit, delete, move between columns)
7. All changes are saved and reflected in the application

---

### 6. Data Structure

#### Boards

- id
- title
- description
- created_by
- created_at
- updated_by
- updated_at

---

#### Board Members

- id
- board_id
- user_id
- role
- created_at

---

#### Board Columns

- id
- board_id
- title
- position
- created_by
- created_at
- updated_by
- updated_at

---

#### Board Tasks

- id
- board_id
- board_column_id
- title
- description
- created_by
- created_at
- updated_by
- updated_at

---

### 7. Project Architecture

The project follows a modular and scalable Angular architecture:

- **core/** – application-wide singleton services and guards
    - **services/** – business logic and communication with Supabase (API layer)
    - **guards/** – route protection and authentication handling

- **features/** – feature modules and main UI components
    - Contains functionality related to boards, tasks, and user interactions

- **layouts/** – layout components (e.g. Main layout)

- **shared/** – reusable components, directives, and utilities used across the application
    - **components/** – general-purpose UI components (e.g. Loader)
    - **interfaces/** – TypeScript interfaces and models (e.g. Board, Task, User)
    - **styles/** – global styles (e.g. auth, forms)
    - **utils/** – helper functions and utility logic
    - **validators/** – custom form validators

- **environments/** – environment configuration files for different build targets (development, production)

---

### 8. Technologies Used

- HTML / CSS
- TypeScript
- Angular
- Angular Material (e.g. icons, dropdown menus, tooltips)
- Angular SDK (e.g. Drag & Drop)
- RxJS
- Supabase (Backend & Database)

---

### 9. How to Run the Project

1. Clone the repository

```bash
git clone https://github.com/dibrto/TaskFlow.git
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
ng serve
```

4. Open the application in browser

```
http://localhost:4200
```

---

### Notes

- The application uses Supabase for authentication and data storage
- Each user has access only to their own boards and tasks
- The application follows a component-based architecture using Angular best practices
