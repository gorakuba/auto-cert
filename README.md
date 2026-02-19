# Auto-Cert - Generator Certyfikatów 🎓

Nowoczesna aplikacja do generowania certyfikatów z podglądem na żywo, eksportem do ZIP i zarządzaniem uczestnikami.

---

## 🚀 Quick Start

```bash
# Instalacja
yarn

# Uruchomienie
yarn dev

# Otwórz http://localhost:5173
```

---

## ✨ Funkcje

### 📊 Dashboard

- **Statystyki na żywo** - liczba uczestników, średni wynik, szablony
- **Szybkie akcje** - natychmiastowy dostęp do wszystkich funkcji
- **Ostatnia aktywność** - historia importów i generowania
- **Nowoczesny design** - gradient, animacje, kolorowe karty

### 📥 Import Uczestników

- **Drag & drop** CSV
- **Prosty parser** - automatyczne wykrywanie nagłówków
- **Podgląd przed importem** - zobacz dane w tabeli
- **5 kolumn** - Imię, Email, Firma, Wynik, Data

### 👥 Zarządzanie Uczestnikami

- **Tabela** - wszystkie dane w jednym miejscu
- **Edycja inline** - kliknij i edytuj
- **Wyszukiwarka** - szybkie filtrowanie
- **Dodawanie/usuwanie** - pełne CRUD
- **Auto-zapis** - localStorage

### 🎨 Wybór Szablonów

- **3 szablony domyślne** - Klasyczny, Nowoczesny, Minimalistyczny
- **Galeria kart** - podgląd miniatur
- **Kategorie** - Business, Education, Sport
- **Wsparcie dla własnych** - localStorage

### 🖼️ Generator z Podglądem

- **Canvas rendering** - podgląd na żywo
- **Nawigacja** - przeglądaj wszystkich uczestników
- **Edytor tekstu:**
  - Rozmiar czcionki (20-100px)
  - Wybór czcionki (6 opcji)
  - Kolor tekstu (picker + hex)
  - Pozycja X/Y (slidery)
- **Pobieranie pojedyncze** - PNG
- **Pobieranie wszystkich** - sekwencyjne

### 📦 Eksport do ZIP

- **JSZip** - automatyczne pakowanie
- **Pasek postępu** - 0-100%
- **Nazwa pliku** - certyfikat_Imie_Nazwisko.png
- **Auto-download** - certyfikaty_2024-11-13.zip

---

## 🎯 Workflow

1. **Importuj uczestników** → CSV z drag & drop
2. **Wybierz szablon** → Galeria 3 szablonów
3. **Generuj certyfikaty** → Podgląd + edycja tekstu
4. **Eksportuj ZIP** → Wszystkie certyfikaty w archiwum

---4. **Czytaj wskazówki**

- Skróty klawiszowe (Ctrl+D)
- Porady dotyczące szablonów
- Informacje o funkcjach zaawansowanych

---

## 📸 Wygląd Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard Certyfikatów 📊                    Dzisiaj 🎓    │
│  Witaj! Zarządzaj swoimi certyfikatami w jednym miejscu     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────┐│
│  │👥 Uczestn. │  │📈 Średni   │  │🎨 Szablony │  │📁 Pro.││
│  │    24      │  │   Wynik    │  │     12     │  │   5   ││
│  │ 18 z email │  │    87.5    │  │  3 własne  │  │       ││
│  └────────────┘  └────────────┘  └────────────┘  └───────┘│
│                                                               │
│  Szybkie Akcje                                                │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │📥 Importuj Uczestń.  │  │🎨 Wybierz Szablon    │        │
│  │Wczytaj dane z CSV    │  │Przeglądaj galerię    │        │
│  └──────────────────────┘  └──────────────────────┘        │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │✨ Generuj Certyfikaty│  │✏️ Zarządzaj Uczestń.  │        │
│  └──────────────────────┘  └──────────────────────┘        │
│                                                               │
│  📋 Ostatnia Aktywność       💡 Wskazówki                   │
│  • Zaimportowano 24 uczest.  • Użyj Ctrl+D dla szybkiego   │
│  • Wygenerowano 20 certyfik. • Dodaj własne szablony        │
│  • Dostępnych 12 szablonów   • Import+ wykrywa kolumny      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Wymagania

- Nowoczesna przeglądarka (Chrome, Firefox, Edge, Safari)
- Włączona obsługa JavaScript
- Minimum 2GB RAM
- Rozdzielczość ekranu min. 1280x720px (zalecane)

## 🛠️ Instalacja i Uruchomienie

```bash
# Klonowanie repozytorium
git clone https://github.com/gorakuba/auto-cert.git

# Przejście do katalogu
cd auto-cert

# Instalacja zależności
yarn

# Uruchomienie w trybie deweloperskim
yarn dev

# Budowanie wersji produkcyjnej
yarn build
```

## 📦 Technologie

- **React 19.1.0** - nowoczesny framework UI
- **TypeScript 5.8.3** - bezpieczne typowanie
- **Tailwind CSS 4.1.8** - utility-first styling
- **Vite 6.3.5** - szybki build tool
- **JSZip** - pakowanie archiwów ZIP
- **localStorage API** - przechowywanie lokalnie

## 📁 Struktura Projektu

```
auto-cert/
├── public/
│   └── templates/                    # Szablony SVG
│       ├── template1.svg
│       ├── template2.svg
│       └── template3.svg
├── src/
│   ├── App.tsx                       # Główny komponent + logika
│   ├── components/
│   │   ├── Dashboard.tsx             # Dashboard z kartami
│   │   ├── SimpleCSVImporter.tsx     # Import CSV
│   │   ├── SimpleParticipantManager.tsx  # Zarządzanie uczestnikami
│   │   ├── TemplateSelector.tsx      # Wybór szablonów
│   │   ├── CertificateGenerator.tsx  # Generator z podglądem
│   │   ├── ZipExporter.tsx           # Eksport do ZIP
│   │   └── index.ts                  # Exports
│   ├── main.tsx                      # Entry point
│   └── index.css                     # Globalne style
├── package.json
├── tsconfig.json
└── README.md
```

## 💾 localStorage

Dane przechowywane lokalnie w przeglądarce:

- `auto-cert-participants` - lista uczestników (Participant[])
- `auto-cert-generated-count` - licznik wygenerowanych certyfikatów
- `auto-cert-custom-templates` - własne szablony (TemplateInfo[])

## 🎨 Customizacja

### Zmiana kolorów

W `Dashboard.tsx` zmień kolory kart:

```tsx
<StatCard color="border-blue-500" />  // niebieski
<StatCard color="border-green-500" /> // zielony
<StatCard color="border-purple-500" /> // fioletowy
```

### Dodanie szablonu

Umieść plik SVG/PNG w `public/templates/` i dodaj w `TemplateSelector.tsx`:

```tsx
{
  id: 't4',
  name: 'Mój Szablon',
  thumbnail: '/templates/template4.svg',
  path: '/templates/template4.svg',
  description: 'Opis szablonu',
  category: 'custom',
}
```

## 🤝 Współpraca

Chcesz wnieść wkład? Świetnie!

1. Forkuj repozytorium
2. Stwórz branch funkcji (`git checkout -b feature/NazwaFunkcji`)
3. Commituj zmiany (`git commit -m 'Dodaj nową funkcję'`)
4. Push do brancha (`git push origin feature/NazwaFunkcji`)
5. Otwórz Pull Request

## 📄 Licencja

Projekt prywatny - **Kuba Góra**

## 👨‍💻 Autor

**Kuba Góra** - [@gorakuba](https://github.com/gorakuba)

---

**Stworzone z ❤️ dla łatwego generowania certyfikatów**
Jeśli podoba Ci się ten projekt, zostaw gwiazdkę na GitHubie!

---

Stworzone z ❤️ dla potrzeb generowania certyfikatów
