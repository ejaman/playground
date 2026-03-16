import Link from "next/link";

const CATEGORIES = [
  { value: "all", label: "전체" },
  { value: "electronics", label: "전자기기" },
  { value: "fashion", label: "패션" },
  { value: "beauty", label: "뷰티" },
];

interface CategoryFilterProps {
  category: string;
}

export function CategoryFilter({ category }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 mb-6">
      {CATEGORIES.map((cat) => {
        const href =
          cat.value === "all"
            ? "/experiment"
            : `/experiment?category=${cat.value}`;
        const isActive = category === cat.value;
        return (
          <Link
            key={cat.value}
            href={href}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              isActive
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {cat.label}
          </Link>
        );
      })}
    </div>
  );
}
