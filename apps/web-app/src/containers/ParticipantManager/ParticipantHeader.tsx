interface ParticipantHeaderProps {
  count: number;
  onClose: () => void;
}

export const ParticipantHeader = ({
  count,
  onClose,
}: ParticipantHeaderProps) => {
  return (
    <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white z-10">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          Zarządzanie Uczestnikami
        </h2>
        <p className="text-sm text-gray-500 mt-1">{count} uczestników</p>
      </div>
      <button
        onClick={onClose}
        className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
    </div>
  );
};
