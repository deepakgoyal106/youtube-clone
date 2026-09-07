import "./FilterBar.css";

// Categories displayed in the YouTube-style filter bar.
const categories = [
    "All",
    "Music",
    "Gaming",
    "Education",
    "Sports",
    "News",
    "Entertainment"
];

function FilterBar({
    selectedCategory,
    setSelectedCategory
}) {
    return (
        <div
            className="filter-bar"
            role="group"
            aria-label="Video categories"
        >
            {categories.map((category) => (
                <button
                    key={category}
                    type="button"
                    className={
                        selectedCategory === category
                            ? "filter-button active"
                            : "filter-button"
                    }
                    onClick={() => setSelectedCategory(category)}
                    aria-pressed={selectedCategory === category}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}

export default FilterBar;