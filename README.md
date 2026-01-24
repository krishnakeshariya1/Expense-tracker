<h1> Expense Tracker</h1>

A production‑oriented expense tracking web application focused on correctness, predictable state updates, and real‑world budgeting logic. The app enables users to manage monthly budgets, track category‑wise expenses, and analyze spending using filters and search — without relying on external libraries or a backend.

<h2>Overview</h2>

This project is intentionally built with vanilla JavaScript to demonstrate strong fundamentals in state management, CRUD operations, and DOM control. Instead of prioritizing visual effects, the application prioritizes data integrity, scalability of logic, and maintainability.

 Core Features

 - Expense Management (CRUD)

 - Create expenses with amount, category, date, and description

 - Update existing expenses without breaking state consistency

 - Delete expenses permanently

 - Immediate and deterministic UI updates after each operation
   

Monthly Budget Tracking

 - Configure a fixed monthly budget

 - Real‑time calculation of total spending

 - Real‑time remaining budget display

 - Guards against invalid states (negative values, stale calculations )


Category‑Based Spending

 - Expenses grouped by predefined categories

 - Category‑wise aggregation for spend analysis

 - Logic structured for future analytics expansion
 - 

Filters & Search

 - Filter by:

    - Category
    - Date

 - Amount range

 - Search by description or category

 - Filters operate on derived data (base dataset remains unchanged)


<h3>Technical stack</h3>

 - HTML5 — Semantic markup

 - CSS — Responsive, utility‑first styling

 - JavaScript (ES6+) — Business logic, state handling, DOM updates
