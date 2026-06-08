# System Guide: Publication Management System (PMS)

This guide provides comprehensive, step-by-step instructions for Administrators and Editors to manage the Publication Management System (PMS) at the Sabaragamuwa University of Sri Lanka.

---

## 1. Accessing the System

### 1.1 Authentication & Entry
1. **Entry Portal:** Navigate to the `/backend-login` page.
2. **Backend Selection:** If you are not directly logged in, go to `/backend-selection` to select your department or publication type. This ensures you are directed to the correct management interface.
3. **Login:** Enter your **Username** and **Password**.
   - *Note:* For security, ensure your browser is up to date and you are using a private connection.

---

## 2. Administrator Guide

The Administrator role is responsible for overseeing the entire ecosystem, managing users, and ensuring the quality of published content.

### 2.1 Editor Account Management
1. **Access Dashboard:** Navigate to `/admin/dashboard`.
2. **Creating an Editor:**
   - Locate the **"Create Editor"** form in the sidebar.
   - **Fields:**
     - **Full Name / Email:** Basic contact information.
     - **Role:** Set to **"Editor"**.
     - **Type:** Choose between **Journal**, **Conference**, or **Symposium**.
     - **Target:** Select the hosting Department (for Journals) or the specific event name (for Conferences/Symposia) from the master lookup list.
     - **Override Title:** If the default department or event name is not suitable for the public display, enter the preferred title in the textarea provided.
   - Click **"Create Account"**.
3. **Audit:** Review existing accounts in the **"Active Accounts"** list to verify assigned roles and publication titles.

### 2.2 Quality Assurance & Approval
New publications created by Editors remain hidden from the public until approved by an Admin.
1. **Pending Queue:** Review the "Pending Approval" sections for Journals, Conferences, and Symposiums.
2. **Review Workflow:**
   - Click the **Eye icon** to preview the publication's public landing page.
   - Verify that branding, aims & scope, and contact details meet university standards.
3. **Action:**
   - **Approve (Checkmark):** The publication becomes live immediately.
   - **Reject (X icon):** The publication remains in a "rejected" state; the editor should be notified to make corrections.

---

## 3. Editor Guide

Editors are the primary content managers for their assigned publications.

### 3.1 Establishing the Publication Profile
1. **Profile Setup:** Access your management view (e.g., `/editor/journal/create`).
2. **Metadata:**
   - **ISSN / Online ISSN:** Enter in standard `XXXX-XXXX` format.
   - **Aims, Mission & Scope:** Use the provided textareas to define the academic boundaries of your publication.
3. **Branding & Visuals:**
   - **Cover Image:** Upload a vertical graphic (approx. 3:4 ratio). This appears in grids and search results.
   - **University Logo:** Upload the official institutional logo. *Requirement:* Use a high-resolution PNG with a transparent background. The system standardizes logo height to `h-28` for prominent display.
4. **Policy Documents:** Upload PDFs for **Author Guidelines**, **Reviewer Guidelines**, and **Editorial Policies**. These are critical for academic transparency.

### 3.2 Managing Content Volumes (Issues & Abstract Books)
The system distinguishes between continuous publications (Journals) and event-based ones (Conferences/Symposia).
1. **Create Volume:**
   - **Journals:** Use **"Manage Issues"**. Enter Volume, Issue Number, and Year.
   - **Conferences/Symposia:** Use **"Abstract Books"**. Enter Year and Version (e.g., "First Edition").
2. **The "Current" Status:**
   - Each publication has a **"Current"** and **"Archive"** route.
   - Marking a volume as **"Current"** triggers its display on the primary landing page and expands its article list by default.
3. **Visuals:** Upload a unique cover for each specific issue/proceeding to help readers distinguish between volumes.

### 3.3 Manuscript & Article Management
1. **Adding an Article:** Click **"Manage Articles"** on a specific volume card.
2. **Author Formatting (Critical):**
   - The system uses an intelligent parser. Split multiple authors using `;`, `&`, or the word `and`.
   - *Example:* `Perera, A.B.; Silva, C.D. and Wickramasinghe, E.`
   - Affiliation markers (numbers/asterisks) will be automatically cleaned in public views if configured.
3. **Metadata:**
   - **DOI:** Enter the full DOI link or identifier.
   - **Pages:** Use standard range format (e.g., `120-135`).
   - **Abstract:** Provide a well-formatted abstract; public views will justify this text for an academic look.
4. **Manuscript File:** Upload a web-optimized PDF of the individual article.

### 3.4 Governance & Committees
1. **Management:** Navigate to **"Editorial Board"** (Journals) or **"Committee"** (Conferences/Symposia).
2. **Member Details:** Enter the full name, institutional affiliation, and specific role.
3. **Display:** Members are displayed in a clean, professional list on the public site to establish the publication's academic authority.

### 3.5 Media Gallery (Conferences & Symposiums Only)
1. **Upload:** Navigate to **"Manage Gallery"**.
2. **Slideshow:** Upload high-resolution photos of programs, workshops, or keynote sessions.
3. **Captions:** Provide concise captions to add context to the photos. These appear in an animated `Framer Motion` slideshow on your landing page.

---

## 4. Visual & Technical Standards

- **Typography:** Ensure all text (especially abstracts and mission statements) is free of special characters that might break HTML rendering.
- **File Management:**
  - PDFs should be under 10MB for optimal accessibility.
  - Images should be WebP or JPG, optimized for web display.
- **Branding:** Do not override the `university_name` unless explicitly instructed, as this maintains institutional consistency across all publication headers.
- **Citations:** The system automatically generates IEEE and APA citations. Ensure author names and titles are entered accurately to maintain citation integrity.
