"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search countries..."
      aria-label="Search countries by name"
      autoCorrect="off"
      autoCapitalize="none"
      className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
