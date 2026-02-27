interface FilterOption {
  label: string;
  value: string;
}

interface SearchToolbarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
  filters?: FilterOption[];
  activeFilter?: string;
  onFilterChange?: (value: string) => void;
}

export const SearchToolbar = ({
  value,
  onChange,
  placeholder = "Szukaj...",
  children,
  filters,
  activeFilter,
  onFilterChange,
}: SearchToolbarProps) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row gap-3 items-center animate-in fade-in slide-in-from-bottom-2 duration-500 w-full">
      <div className="flex-1 relative w-full h-11">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10"
        >
          <path
            fillRule="evenodd"
            d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full pl-11 pr-4 bg-white border border-gray-200 focus:border-indigo-500 rounded-xl focus:ring-2 focus:ring-indigo-500/20 text-gray-900 placeholder-gray-400 transition-all shadow-sm"
        />
      </div>

      {filters && filters.length > 0 && onFilterChange && (
        <div className="w-full lg:w-auto h-auto flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide shrink-0 items-center">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => onFilterChange(filter.value)}
                className={`px-4 h-10 rounded-full text-sm font-medium transition-all shrink-0 border ${
                  isActive
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-200"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      )}

      {children && (
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 md:justify-end">
          {children}
        </div>
      )}
    </div>
  );
};
