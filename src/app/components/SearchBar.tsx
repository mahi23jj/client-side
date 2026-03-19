import { Search, X } from "lucide-react";
import React from "react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Search products..." }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={`flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2.5 transition-all ${
        isFocused ? "ring-2 ring-blue-100" : ""
      }`}>
        <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    </form>
  );
}
