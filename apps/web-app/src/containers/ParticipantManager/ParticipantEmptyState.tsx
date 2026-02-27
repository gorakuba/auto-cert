interface ParticipantEmptyStateProps {
  search: string;
  activeFilter?: string;
}

export const ParticipantEmptyState = ({
  search,
  activeFilter,
}: ParticipantEmptyStateProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 min-h-[400px] w-full max-w-2xl mx-auto">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-16 h-16 mx-auto mb-4 text-gray-200"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
      <h3 className="text-lg font-bold text-gray-900 mb-1">
        {search || (activeFilter && activeFilter !== "all")
          ? "Brak wyników"
          : "Brak uczestników"}
      </h3>
      <p className="text-gray-500 max-w-sm mt-1">
        {search || (activeFilter && activeFilter !== "all")
          ? "Nie znaleziono uczestników spełniających podane kryteria wyszukiwania i filtrowania."
          : "Dodaj uczestników do swojego projektu, by wygenerować dla nich certyfikaty."}
      </p>
    </div>
  );
};
