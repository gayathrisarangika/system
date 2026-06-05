# System Guide: Publication Management System (PMS)

This guide provides step-by-step instructions for Administrators and Editors to manage the Publication Management System (PMS) at the Sabaragamuwa University of Sri Lanka.

## 1. Getting Started
### 1.1 Accessing the Backend
- Navigate to `/backend-login` to access the entry portal.
- Select your role or department if prompted.
- Enter your **Username** and **Password** to log in.

---

## 2. Administrator Guide
The Administrator role is responsible for user management and high-level publication oversight.

### 2.1 Managing Editor Accounts
1. **Navigate to Admin Dashboard:** Access the `/admin/dashboard`.
2. **Create a New Editor:**
   - Locate the **"Create Editor"** form in the sidebar.
   - Enter the editor's **Full Name**, **Email**, **Username**, and **Password**.
   - **Select Type:** Choose between Journal, Conference, or Symposium.
   - **Select Target:** Choose the specific department or name the editor will manage.
   - **Publication Title (Override):** Use this to manually set a specific display name for the publication if the default is insufficient.
   - Click **"Create Account"**.
3. **View Active Accounts:** Scroll down the sidebar to see all currently active accounts in the system.

### 2.2 Approving Publications
When an Editor registers a new publication (Journal, Conference, or Symposium), it appears on the Admin Dashboard under the respective **"Pending Approval"** section.
- **Preview:** Click the **Eye icon** to view how the publication looks to the public.
- **Approve:** Click the **Checkmark icon** to make the publication live on the website.
- **Reject:** Click the **X icon** if the submission is incomplete or incorrect.

---

## 3. Editor Guide
The Editor role manages the specific content and metadata for their assigned publication.

### 3.1 Publication Profile Setup
1. **Initial Setup:** Go to the management section (e.g., `/editor/journal`) and click **"Create Journal"** (or similar for other types).
2. **Fill Details:** Provide the **ISSN**, **Aims & Scope**, **Mission**, and **Contact Information**.
3. **Branding:**
   - **Cover Image:** Upload a high-quality vertical image (approx. 3:4 ratio).
   - **University Logo:** Upload the official logo (PNG with transparency is best).
4. **Guidelines & Policies:** Upload PDF documents for **Authors**, **Reviewers**, and **Editorial Policies**.
5. **Update:** Click **"Launch/Update Journal"** to save changes. Note: New publications require Admin approval before appearing publicly.

### 3.2 Managing Issues / Abstract Books
1. **Access Issues:** Click **"Manage Issues"** or **"Abstract Books"** from the publication list.
2. **Create New:** Fill in the **Volume**, **Issue Number**, **Year**, and **Publication Date**.
3. **Current Issue:** Check the **"Set as the Current Active Issue"** box to highlight this volume on the landing page.
4. **Upload Full PDF:** You can upload a single PDF containing the entire issue for easy download.
5. **Manage Content:** Click **"Manage Articles"** on any specific issue card to add individual papers.

### 3.3 Managing Articles (Manuscripts)
1. **Add Article:** From the issue's article list, click **"Add New Article"**.
2. **Metadata:** Enter the **Title**, **Author(s)** (separated by 'and' or ';'), **Abstract**, **Keywords**, **DOI**, and **Page Range**.
3. **Manuscript File:** Upload the individual **PDF** for that specific article.
4. **Edit/Update:** You can return to any article to update metadata or replace the PDF file at any time.

### 3.4 Managing Boards & Committees
1. **Access Board:** Click **"Editorial Board"** or **"Committee"** from your dashboard.
2. **Add Member:** Enter the member's **Name**, **Affiliation** (University/Organization), and **Role** (e.g., Editor-in-Chief, Reviewer).
3. **Remove Member:** Use the **Trash icon** to remove members who are no longer active.

### 3.5 Gallery Management (Conferences & Symposiums Only)
1. **Access Gallery:** Click **"Manage Gallery"** from the conference/symposium management view.
2. **Upload Photos:** Select an image and provide an optional **Caption**.
3. **Display:** These images will automatically appear in a slideshow at the bottom of your publication's landing page.

---

## 4. Visual Standards
- **Images:** Use web-optimized formats (JPG/WebP) to ensure fast loading times.
- **PDFs:** Ensure all PDFs are not password-protected and have appropriate metadata for searchability.
- **Text:** Use professional academic language for abstracts and mission statements.
