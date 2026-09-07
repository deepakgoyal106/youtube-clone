import { useEffect, useState } from "react";
import axios from "axios";

import FilterBar from "../components/FilterBar";
import VideoCard from "../components/VideoCard";

function Home({ searchTerm, setSearchTerm }) {
    const [videos, setVideos] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        setError("");

        axios.get(
            "http://localhost:5050/api/videos"
        )
        .then((response) => {
            setVideos(response.data.videos);
        })
        .catch((error) => {
            console.log(
                "API ERROR:",
                error.response?.data
            );

            setError(
                "Failed to load videos"
            );
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    const filteredVideos = videos.filter((video) => {
        const matchesSearch = video.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" ||
            (video.category || "Entertainment") ===
                selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("All");
    };

    return (
        <div className="home-page">

            <FilterBar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            {loading && (
                <div className="home-message">
                    <p>Loading videos...</p>
                </div>
            )}

            {error && !loading && (
                <div className="home-message">
                    <p>{error}</p>
                </div>
            )}

            {!loading &&
                !error &&
                filteredVideos.length === 0 && (
                    <div className="home-message">

                        <h2>No videos found</h2>

                        <p>
                            Try a different search or
                            category.
                        </p>

                        {(searchTerm ||
                            selectedCategory !== "All") && (

                            <button
                                type="button"
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </button>

                        )}

                    </div>
                )}

            {!loading &&
                !error &&
                filteredVideos.length > 0 && (

                    <div className="video-grid">

                        {filteredVideos.map((video) => (

                            <VideoCard
                                key={video._id}
                                video={video}
                            />

                        ))}

                    </div>

                )}

        </div>
    );
}

export default Home;