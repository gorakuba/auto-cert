interface ParticipantToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onDeleteAll: () => void;
  stats: {
    total: number;
    filtered: number;
  };
}

export const ParticipantToolbar = ({
  search,
  onSearchChange,
  onDeleteAll,
  stats,
}: ParticipantToolbarProps) => {
  return (
    <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
      <div className="flex-1 relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        >
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Szukaj uczestnika..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      {stats.total > 0 && (
        <button
          onClick={onDeleteAll}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
          Usuń wszystkich
        </button>
      )}
    </div>
  );
};
