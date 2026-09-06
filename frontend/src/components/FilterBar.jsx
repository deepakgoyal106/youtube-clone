import "./FilterBar.css";

function FilterBar({ selectedCategory, setSelectedCategory }) {

    const categories = [
        "All",
        "Music",
        "Gaming",
        "Coding",
        "Education",
        "Entertainment",
        "Sports",
        "Technology"
    ];

    return (
        <div className="filter-bar">

            {categories.map((category) => (

                <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={
                        selectedCategory === category ? "active" : ""
                    }
                >
                    {category}
                </button>

            ))}

        </div>
    );
}

export default FilterBar;