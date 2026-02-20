interface ParticipantEmptyStateProps {
  search: string;
}

export const ParticipantEmptyState = ({
  search,
}: ParticipantEmptyStateProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 min-h-[600px] w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-16 h-16 mx-auto mb-4 text-gray-300"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
      <p className="text-gray-600">
        {search ? "Nie znaleziono uczestników" : "Brak uczestników"}
      </p>
    </div>
  );
};
