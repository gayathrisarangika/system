# Technical Documentation: Publication Management System (PMS)

## 1. Project Overview
The Publication Management System (PMS) is a unified platform developed for the Faculty of Social Sciences and Languages at the Sabaragamuwa University of Sri Lanka. It facilitates the management, publication, and discovery of academic journals, conference proceedings, and symposiums.

## 2. Technology Stack
- **Backend:** Laravel 13 (PHP 8.3)
- **Frontend:** React 19 with Inertia.js 3
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Build Tool:** Vite 8
- **Database:** SQLite (Local development), compatible with MySQL/PostgreSQL

## 3. System Architecture
The application follows a standard Laravel structure enhanced by Inertia.js to provide a modern Single Page Application (SPA) experience.

### 3.1 Backend Architecture
- **Controllers:** Separated into `PublicController` for the frontend and several management controllers (`JournalManagementController`, `ConferenceManagementController`, `SymposiumManagementController`, `DashboardController`) for administrative tasks.
- **Models:** Eloquent models represent the core entities with defined relationships for issues, articles, and committee members.
- **Middleware:** `HandleInertiaRequests` manages global state shared with the React frontend, such as authentication data.

### 3.2 Frontend Architecture
- **Pages:** Located in `resources/js/Pages`, organized by functionality (Auth, Dashboard, Management, Publications).
- **Components:** Reusable UI elements (cards, buttons, layouts) found in `resources/js/Components`.
- **Layouts:** `PublicLayout` for the public-facing site and `BackendLayout` for the admin/editor dashboards.

## 4. User Roles and Workflows
### 4.1 Administrator
- Manages user accounts (creating editors).
- Approves or rejects new publication registrations.
- Oversees all journals, conferences, and symposiums.

### 4.2 Editor
- Manages the metadata and details of their assigned publication.
- Creates and manages issues (for journals) or abstract books/proceedings (for conferences/symposiums).
- Uploads and manages individual articles/papers.
- Manages editorial boards or committees.
- Uploads gallery images (for conferences/symposiums).

### 4.3 Public User
- Browses approved publications.
- Navigates archives by year/volume.
- Reads article abstracts and downloads PDF versions.

## 5. Database Schema and Models
### 5.1 Core Models
- **User:** Stores credentials, roles (admin/editor), and assigned publication/department.
- **Department:** Organizations that host journals.
- **Journal / Conference / Symposium:** Primary publication entities.
- **Issue / ConferenceProceeding / SymposiumProceeding:** Containers for articles, typically organized by year or volume.
- **Article:** Individual research papers with metadata (title, authors, abstract) and PDF links.
- **EditorialBoard / ConferenceCommittee / SymposiumCommittee:** Lists of academics associated with a publication.
- **PublicationGallery:** Polymorphic table storing images for conferences and symposiums.

### 5.2 Key Relationships
- A `Journal` has many `Issues`.
- An `Issue` has many `Articles`.
- A `Conference` has many `ConferenceProceedings`.
- A `ConferenceProceeding` has many `Articles`.
- `Articles` are linked to either an `Issue`, `ConferenceProceeding`, or `SymposiumProceeding`.

## 6. Routing Reference
### 6.1 Public Routes
- `/`: Homepage with featured and recent publications.
- `/journal/{journal}`, `/conference/{conference}`, `/symposium/{symposium}`: Landing pages.
- `/{type}/{id}/current`: Most recent issue/proceeding.
- `/{type}/{id}/archive`: Historical list of issues/proceedings.
- `/article/{article}`: Single article view.

### 6.2 Backend Routes
- `/admin/dashboard`: Admin control panel.
- `/editor/{type}/dashboard`: Editor-specific dashboard.
- `/editor/journal`, `/editor/conference`, `/editor/symposium`: CRUD operations for publications.
- `/editor/{type}/{id}/issues` or `/abstract-books`: Management of volumes/proceedings.

## 7. UI/UX Design Choices
- **Academic Aesthetic:** Clean, professional look with a focus on readability.
- **Glassmorphism:** Used in headers and cards for depth and modernity.
- **Responsive Design:** Fully accessible on mobile, tablet, and desktop devices.
- **Interactive Elements:** Smooth transitions using Framer Motion and hover effects on publication cards.

## 8. Installation and Setup
1. Clone the repository.
2. Install PHP dependencies: `composer install`
3. Install JS dependencies: `npm install`
4. Copy environment file: `cp .env.example .env`
5. Generate application key: `php artisan key:generate`
6. Create database file: `touch database/database.sqlite`
7. Run migrations and seeders: `php artisan migrate --seed`
8. Link storage: `php artisan storage:link`
9. Build assets: `npm run build` or `npm run dev` for development.
