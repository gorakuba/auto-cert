export interface FilterOption {
  id: string;
  label: string;
}

interface SearchToolbarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
  filters?: FilterOption[];
  activeFilter?: string;
  onFilterChange?: (filterId: string) => void;
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
    <div className="mb-6 flex flex-col lg:flex-row gap-4 items-center w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex-1 relative w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
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
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 focus:border-indigo-500 rounded-xl focus:ring-4 focus:ring-indigo-500/10 text-gray-900 placeholder-gray-400 transition-all shadow-sm"
        />
      </div>

      {filters && filters.length > 0 && onFilterChange && (
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto scbar-hide pb-2 lg:pb-0">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap shadow-sm border ${
                activeFilter === filter.id
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-200"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}

      {children && (
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          {children}
        </div>
      )}
    </div>
  );
};
