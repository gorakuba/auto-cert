# Auto-Cert Project Instructions & Context

## Project Overview
**Auto-Cert** is a React-based Single Page Application (SPA) designed for bulk generation of certificates.
It operates entirely client-side, prioritizing user privacy by processing all data locally in the browser.
Key features include CSV/XLSX import, a WYSIWYG certificate editor with live preview, template management, and bulk ZIP export.

## 🛠 Tech Stack
-   **Frontend**: React 19, TypeScript 5.8, Tailwind CSS v4.1, Vite 6.3
-   **Backend**: .NET 9 (ASP.NET Core Minimal APIs), Entity Framework Core, SQLite
-   **Package Manager**: Yarn (Workspaces)
-   **State Management**: React `useState` + API synchronization
-   **Testing**:
    -   **Unit**: Vitest (Frontend), xUnit (Backend)
    -   **E2E**: Playwright

### Key Dependencies
-   `swashbuckle.aspnetcore`: Swagger UI
-   `microsoft.entityframeworkcore.sqlite`: Database provider
-   `jszip`: creating ZIP archives of generated PDFs.
-   `jspdf`: Generating PDF documents from canvas/images.
-   `xlsx`: Parsing Excel (.xlsx) files.
-   `react-qr-code`: Generating QR codes for certificates.
-   `react-icons`: Icon set (FaTrash, etc.).
-   `dom-to-image-more` / `html2canvas`: Canvas rendering helpers.

## 📂 Project Structure (Monorepo)
```
auto-cert/
├── apps/
│   ├── web-app/                    # FRONTEND (React + Vite)
│   │   ├── src/
│   │   │   ├── services/           # API wrapper (api.ts)
│   │   │   └── ...                 # Components, Pages, etc.
│   │   ├── e2e/                    # Playwright E2E tests
│   │   │   ├── tests/              # Spec files
│   │   │   └── playwright.config.ts
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── backend/                    # BACKEND (.NET 9)
│       ├── AutoCert.Backend/           # API Project
│       │   ├── Endpoints/          # Minimal API endpoints
│       │   ├── Data/               # DB Context & Models
│       │   └── Program.cs          # Config
│       └── AutoCert.Tests/         # Integration Tests (xUnit)
├── package.json                    # Root workspace config
└── README.md
```

## 🧠 Application Architecture & State

### Global State (`App.tsx`)
The application accesses data via `src/services/api.ts` which communicates with the backend.
-   `participants`: Loaded from `GET /api/participants`
-   `settings`: Loaded from `GET /api/settings/{key}`

### Data Persistence (SQLite)
Data is stored in `auto-cert.db` (SQLite) via Entity Framework Core.
-   **Participants**: `Participants` table.
-   **Settings**: `Settings` table (Key-Value store for `tutorial_completed`, `selected_template`, etc).
-   **Legacy**: `localStorage` is used only for UI preferences or temporary state (e.g. `activeTab`).

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
-   **Config**: `apps/web/playwright.config.ts`
    -   `testDir`: `./e2e/tests`
    -   `outputDir`: `./e2e/test-results`
    -   HTML report: `./e2e/playwright-report`
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
# Start Development Server
# Frontend (`apps/web-app`): http://localhost:5173
# Backend: http://localhost:5050
yarn dev

# Run E2E Tests (Playwright)
yarn web-app:e2e

# Run Frontend Unit Tests
yarn web:test

# Run Backend Tests
dotnet test apps/backend/AutoCert.Tests

# Build Producton
yarn web:build
dotnet build apps/backend/AutoCert.Backend
```
