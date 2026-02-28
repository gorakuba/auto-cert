interface ParticipantEmptyStateProps {
  search: string;
}

export const ParticipantEmptyState = ({
  search,
}: ParticipantEmptyStateProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 min-h-[400px]">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-12 h-12"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        {search ? "Brak wyników" : "Brak uczestników"}
      </h2>
      <p className="text-gray-500 max-w-sm mb-8">
        {search
          ? "Nie znaleziono uczestników spełniających podane kryteria wyszukiwania i filtrów."
          : "Dodaj uczestników ręcznie lub zaimportuj ich z pliku."}
      </p>
    </div>
  );
};
