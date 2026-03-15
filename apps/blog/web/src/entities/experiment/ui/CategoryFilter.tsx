"use client";

const CATEGORIES = [
  { value: "all", label: "전체" },
  { value: "electronics", label: "전자기기" },
  { value: "fashion", label: "패션" },
  { value: "beauty", label: "뷰티" },
];

interface CategoryFilterProps {
  category: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ category, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 mb-6">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onCategoryChange(cat.value)}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            category === cat.value
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
