# Auto-Cert Project Instructions & Context

## Project Overview
**Auto-Cert** is a React-based Single Page Application (SPA) designed for bulk generation of certificates.
It operates entirely client-side, prioritizing user privacy by processing all data locally in the browser.
Key features include CSV/XLSX import, a WYSIWYG certificate editor with live preview, template management, and bulk ZIP export.

## 🛠 Tech Stack
-   **Core**: React 19, TypeScript 5.8
-   **Build**: Vite 6.3
-   **Styling**: Tailwind CSS v4.1 (@tailwindcss/vite plugin)
-   **Package Manager**: Yarn (v1.22) — use `yarn`, NOT `npm`
-   **State Management**: React `useState` + `localStorage` persistence
-   **Routing**: Custom tab-based navigation (SPA) managed in `App.tsx`
-   **Testing**:
    -   **Unit/Component**: Vitest + React Testing Library (@testing-library/react)
    -   **E2E**: Playwright (@playwright/test) — Chromium, 1920×1080 viewport

### Key Dependencies
-   `jszip`: creating ZIP archives of generated PDFs.
-   `jspdf`: Generating PDF documents from canvas/images.
-   `xlsx`: Parsing Excel (.xlsx) files.
-   `react-qr-code`: Generating QR codes for certificates.
-   `react-icons`: Icon set (FaTrash, etc.).
-   `dom-to-image-more` / `html2canvas`: Canvas rendering helpers.

## 📂 Project Structure
```
auto-cert/
├── src/
│   ├── App.tsx             # ROOT COMPONENT: Global state, routing, persistence.
│   ├── types.ts            # DATA MODELS: Participant, TemplateInfo, RecentProject.
│   ├── main.tsx            # Entry point.
│   ├── components/         # PRESENTATIONAL & FEATURE COMPONENTS
│   │   ├── CertificateGenerator.tsx  # Canvas editor, PDF generation.
│   │   ├── ZipExporter.tsx           # Bulk export (JSZip) — auto-starts on mount.
│   │   ├── Dashboard.tsx             # Main dashboard view.
│   │   ├── Layout.tsx                # App shell (Sidebar + content).
│   │   ├── Sidebar.tsx               # Navigation with participant/template badges.
│   │   ├── Modal.tsx                 # Reusable modal (React Portal, z-[5000]).
│   │   ├── Snackbar.tsx              # Notification toast.
│   │   ├── SearchToolbar.tsx         # Search & filter UI.
│   │   └── CSVImporter/
│   │       └── CSVImporterUI.tsx     # Import UI via createPortal (z-[5001]).
│   ├── containers/
│   │   ├── SimpleCSVImporter/        # File parsing logic (FileReader, XLSX).
│   │   └── ParticipantManager/       # Participant list operations.
│   ├── pages/
│   │   ├── ParticipantsPage.tsx      # CRUD table view for participants.
│   │   ├── TemplatesPage.tsx         # Template grid, selection, upload.
│   │   └── ProjectsPage.tsx          # Recent project history.
│   └── index.css           # Global styles & Tailwind directives.
├── tests/                  # ALL test infrastructure in one place
│   ├── e2e/                # Playwright E2E specs (one folder per feature)
│   │   ├── dashboard/
│   │   │   └── screenshots/          # Auto-saved screenshots per run
│   │   ├── export/screenshots/
│   │   ├── generator/screenshots/
│   │   ├── participants/screenshots/
│   │   ├── templates/screenshots/
│   │   ├── tutorial/screenshots/
│   │   ├── dashboard.spec.ts
│   │   ├── export.spec.ts
│   │   ├── generator.spec.ts
│   │   ├── participants.spec.ts
│   │   ├── templates.spec.ts
│   │   └── tutorial.spec.ts
│   ├── test-results/       # Playwright run artifacts (auto-generated)
│   └── playwright-report/  # HTML report (auto-generated)
├── public/
│   └── templates/          # Default SVG templates (t1, t2, t3).
├── vitest-setup.ts         # Vitest global setup (mocks: localStorage, Canvas, URL)
├── vitest.config.ts
├── playwright.config.ts
├── yarn.lock
└── package.json
```

## 🧠 Application Architecture & State

### Global State (`App.tsx`)
The application uses a **centralized state** pattern lifted up to `App.tsx`.
-   `participants`: `Participant[]` — people to generate certificates for.
-   `templates`: `TemplateInfo[]` — available designs (Default + Custom).
-   `selectedTemplate`: `TemplateInfo | null` — currently active design.
-   `activeTab`: `string` — current view (`dashboard` | `participants` | `templates` | `generator` | `projects`).
-   `recentProjects`: `RecentProject[]` — history of work sessions.

### Data Persistence (`localStorage` keys)
-   `auto-cert-participants` — JSON array of current participants.
-   `auto-cert-custom-templates` — JSON array of user-uploaded templates (Base64 DataURLs).
-   `auto-cert-selected-template` — JSON of selected template object.
-   `auto-cert-generated-count` — total certificates generated counter.
-   `auto-cert-recent-projects` — JSON array of saved project history.
-   `auto-cert-tutorial-completed` — `"true"` when onboarding is done.

## 🔑 Key Features Implementation Details

### 1. Onboarding Tutorial (`Tutorial.tsx`)
-   Shown on first load when `auto-cert-tutorial-completed` is absent from `localStorage`.
-   3-step wizard: Import participants → Select template → Summary.
-   File upload uses `input#file-upload`.
-   Completes by setting `auto-cert-tutorial-completed = "true"` and calling parent callback.

### 2. Data Import (`SimpleCSVImporter` + `CSVImporterUI`)
-   Supports `.csv`, `.xlsx`, `.xls`, `.xlsm`.
-   Excel: `FileReader` (BinaryString) → `XLSX.read` → `sheet_to_json`.
-   CSV: custom `parseCSV` utility.
-   `CSVImporterUI` renders via **`createPortal`** to `document.body` at `z-[5001]` (above modals).

### 3. Template System (`TemplatesPage`)
-   Defaults hardcoded in `App.tsx`, pointing to `/public/templates/`.
-   Custom templates uploaded as DataURLs via `FileReader`, stored in `localStorage`.

### 4. Certificate Editor (`CertificateGenerator`)
-   Uses HTML5 Canvas API.
-   Text position stored as **percentages (%)** of canvas dimensions.
-   WYSIWYG: any control change triggers immediate canvas redraw.

### 5. Bulk Export (`ZipExporter`)
-   Auto-starts export **immediately on mount** via `useEffect`.
-   Shows a progress bar spinner — no "download" button to click.
-   Generates one PDF per participant, packs into ZIP via JSZip, triggers download.

### 6. Navigation Flow
-   Clicking "Generator" without data → redirects to Participants + opens Import Modal.
-   Clicking "Generate" without template → redirects to Templates.
-   Importing data → auto-switches to Generator (if template selected) or Templates.

## 🧪 Testing Strategy

### Unit/Component Tests (Vitest)
-   **Config**: `vitest.config.ts` — `environment: jsdom`, `globals: true`.
-   **Setup file**: `vitest-setup.ts` (root) — mocks `localStorage`, Canvas API, `URL.createObjectURL`.
-   **Test utilities**: helper functions (`mockParticipant`, `mockTemplate`, `renderWithProviders`) lived previously in `src/test/utils/test-utils.tsx`.
-   **Run**: `yarn test`

### E2E Tests (Playwright)
-   **Config**: `playwright.config.ts`
    -   `testDir`: `./tests/e2e`
    -   `outputDir`: `./tests/test-results`
    -   HTML report: `./tests/playwright-report`
    -   Viewport: **1920×1080**
    -   Web server: `yarn dev` on `http://localhost:5173`
-   **Isolation strategy**: inject `auto-cert-tutorial-completed = "true"` via `page.evaluate()` in `beforeEach`, then `page.reload()` + `waitForLoadState("networkidle")`.
-   **Screenshots**: `fullPage: true`, `window.scrollTo(0,0)` before each. Saved to `tests/e2e/[feature]/screenshots/`.
-   **Run**: `yarn test:e2e`

### E2E Spec Coverage (9 tests, all passing)
| File | Tests |
|---|---|
| `tutorial.spec.ts` | Full onboarding walkthrough (CSV upload → template → finish) |
| `dashboard.spec.ts` | Welcome message, stats, recent projects/activity |
| `templates.spec.ts` | Navigate to page; select a template |
| `generator.spec.ts` | Open generator with injected state |
| `export.spec.ts` | Trigger ZIP export, verify spinner modal |
| `participants.spec.ts` | Navigate; show table; open import modal |

## 📏 Code Standards
-   **Linting/Formatting**: Biome (no ESLint). Run: `yarn check`.
-   **Type Safety**: High. Avoid `any`. Interfaces in `types.ts`.
-   **Components**: Functional components with Hooks only.
-   **Styling**: Utility-first Tailwind CSS. Avoid inline styles.
-   **Naming**: PascalCase for components, camelCase for functions/vars.

## 🌍 Localization
-   **Language**: Polish (PL) 🇵🇱.
-   All UI labels, messages, and alerts are hardcoded in Polish.

## 🚀 Development Commands
```bash
yarn dev          # Start local dev server (http://localhost:5173)
yarn build        # Production build
yarn test         # Vitest unit/component tests
yarn test:ui      # Vitest with UI
yarn test:e2e     # Playwright E2E tests (starts dev server automatically)
yarn check        # Biome lint + format check
```
