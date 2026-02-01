# Auto-Cert Project Instructions & Context

## Project Overview
**Auto-Cert** is a React-based web application designed to generate bulk certificates. It features live preview, CSV participant import, template selection, and ZIP export. The application is completely client-side, using `localStorage` for persistence.

## 🛠 Tech Stack
- **Core**: React 19, TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS v4
- **Key Dependencies**:
  - `jszip`: For creating ZIP archives of certificates.
  - `html2canvas` / `dom-to-image-more`: For rendering standard HTML/SVG certificates to images.
  - `xlsx`: (Inferred from functionality/package.json) for parsing Excel/CSV files.
  - `react-qr-code`: For generating QR codes on certificates.

## 📏 Code Quality & Standards
- **Linter/Formatter**: Use **Biome** (`@biomejs/biome`).
  - **Indentation**: 2 spaces (strict).
  - **Linting**: Standard recommended rules.
- **Testing**:
  - **Unit**: Vitest + React Testing Library.
  - **E2E**: Playwright (to be added).

## 🏗 Architecture Guidelines
- **Containers vs. Components**:
  - **Containers** (`src/containers/`): Handle business logic, state management, and data processing. Do not write complex JSX here if possible, delegate to components.
  - **Components** (`src/components/`): Pure presentational components. Receive data via props and emit events. Should contain minimal logic.


## 📂 Project Structure
```
auto-cert/
├── src/
│   ├── App.tsx             # Main controller, state management, and routing logic
│   ├── types.ts            # Shared TypeScript interfaces (Participant, TemplateInfo)
│   ├── components/         # Feature components (Dashboard, Generator, Importer, etc.)
│   ├── main.tsx            # Entry point
│   └── index.css           # Global Tailwind imports
├── public/
│   └── templates/          # Static template assets (SVG/PNG)
└── README.md               # User documentation
```

## 💾 core Data Models (`src/types.ts`)

### `Participant`
Represents a single person to receive a certificate.
```typescript
interface Participant {
  id: string
  name: string
  email?: string
  company?: string
  score?: number
  completionDate?: string
  certificateNumber?: string
  additionalData?: Record<string, string>
}
```

### `TemplateInfo`
Represents a certificate design template.
```typescript
interface TemplateInfo {
  id: string
  name: string
  thumbnail: string
  path: string
  description: string
  category?: 'business' | 'education' | 'sport' | 'custom' | 'other'
  isCustom?: boolean
  createdAt?: number      // For custom templates
  tags?: string[]
}
```

## 🧠 Application Architecture

### State Management (`App.tsx`)
The application uses a centralized state pattern in `App.tsx` instead of a complex state library.
- **Participants**: `participants` array.
- **Templates**: `templates` array (hardcoded defaults + custom).
- **Selection**: `selectedTemplate`.
- **UI State**: Boolean flags for modals (`showImporter`, `showGenerator`, `showZipExporter`, etc.).

### Persistence (`localStorage`)
Data is automatically synced to browser storage:
- `auto-cert-participants`: JSON array of participants.
- `auto-cert-selected-template`: Currently active template.
- `auto-cert-generated-count`: Total stats.
- `auto-cert-custom-templates`: User-uploaded templates.
- `auto-cert-tutorial-completed`: First-run flag.

### Certificate Generation Flow
1. **Import**: `SimpleCSVImporter` parses user files, maps columns, and updates `participants`.
2. **Select**: `TemplateSelector` allows choosing a visual base.
3. **Configure**: `CertificateGenerator` allows visual tweaking (text position, fonts) on top of the template.
4. **Export**: `ZipExporter` iterates through `participants`, renders each certificate to blob/image, adds to ZIP, and triggers download.

## 🌍 Localization & UI
- **Language**: **Polish (PL)**. All UI labels, messages, and placeholders are in Polish.
- **Strings**: Hardcoded in components (no i18n library currently).

## 🚀 Development Workflow
- **Start Dev Server**: `npm run dev` (runs `vite`)
- **Build**: `npm run build`
- **Lint**: `npm run lint`

## 📝 Important Notes for AI
- When modifying code, **preserve Polish comments and UI text**.
- Ensure all new components follow the **Tailwind CSS** styling patterns (using `className`).
- Do not introduce complex routing libraries unless requested; `App.tsx` conditional rendering is the established pattern.
- Respect `types.ts` strictly.
