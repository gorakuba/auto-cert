interface SearchToolbarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
}

export const SearchToolbar = ({
  value,
  onChange,
  placeholder = "Szukaj...",
  children,
}: SearchToolbarProps) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center animate-in fade-in slide-in-from-bottom-2 duration-500">
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
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent focus:border-indigo-500 focus:bg-white rounded-lg focus:ring-2 focus:ring-indigo-500/20 text-gray-900 placeholder-gray-400 transition-all"
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
