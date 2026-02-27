interface SearchToolbarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const SearchToolbar = ({
  value,
  onChange,
  placeholder = "Szukaj...",
  children,
  disabled = false,
}: SearchToolbarProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-center mb-6">
      <div className="flex-1 relative w-full group">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${disabled ? "text-gray-200" : "text-gray-400 group-focus-within:text-indigo-500"
            }`}
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
          disabled={disabled}
          className={`w-full pl-10 pr-5 py-2.5 text-sm rounded-xl border transition-all outline-none ${disabled
            ? "bg-gray-50 border-gray-100 text-gray-300 placeholder-gray-300 cursor-not-allowed"
            : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 hover:border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 shadow-sm"
            }`}
        />
      </div>
      {children && (
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {children}
        </div>
      )}
    </div>
  );
};
