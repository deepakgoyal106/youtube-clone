import { useEffect, useState } from "react";
import axios from "axios";

import FilterBar from "../components/FilterBar";
import VideoCard from "../components/VideoCard";

function Home({ searchTerm, setSearchTerm }) {
    const [videos, setVideos] = useState([]);
    const [selectedCategory, setSelectedCategory] =
        useState("All");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // FETCH VIDEOS
    // ==========================================

    useEffect(() => {
        setLoading(true);
        setError("");

        axios
            .get("http://localhost:5050/api/videos")
            .then((response) => {
                setVideos(
                    response.data.videos || []
                );
            })
            .catch((error) => {
                console.error(
                    "GET VIDEOS ERROR:",
                    error.response?.data ||
                        error.message
                );

                setError(
                    error.response?.data?.message ||
                        "Failed to load videos"
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // ==========================================
    // DELETE VIDEO FROM HOME AFTER SUCCESS
    // ==========================================

    const handleVideoDeleted = (videoId) => {
        setVideos((currentVideos) =>
            currentVideos.filter(
                (video) => video._id !== videoId
            )
        );
    };

    // ==========================================
    // SEARCH + CATEGORY FILTER
    // ==========================================

    const filteredVideos = videos.filter(
        (video) => {
            const title =
                video.title || "";

            const matchesSearch =
                title
                    .toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    );

            const matchesCategory =
                selectedCategory === "All" ||
                (video.category ||
                    "Entertainment") ===
                    selectedCategory;

            return (
                matchesSearch &&
                matchesCategory
            );
        }
    );

    // ==========================================
    // CLEAR FILTERS
    // ==========================================

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("All");
    };

    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div className="home-page">

            {/* Category filter buttons */}
            <FilterBar
                selectedCategory={
                    selectedCategory
                }
                setSelectedCategory={
                    setSelectedCategory
                }
            />

            {/* Loading state */}
            {loading && (
                <div className="home-message">
                    <p>
                        Loading videos...
                    </p>
                </div>
            )}

            {/* Error state */}
            {error && !loading && (
                <div className="home-message">
                    <p>{error}</p>
                </div>
            )}

            {/* No videos found */}
            {!loading &&
                !error &&
                filteredVideos.length ===
                    0 && (
                    <div className="home-message">

                        <h2>
                            No videos found
                        </h2>

                        <p>
                            Try a different
                            search or category.
                        </p>

                        {(searchTerm ||
                            selectedCategory !==
                                "All") && (
                            <button
                                type="button"
                                onClick={
                                    clearFilters
                                }
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}

            {/* Video grid */}
            {!loading &&
                !error &&
                filteredVideos.length >
                    0 && (
                    <div className="video-grid">

                        {filteredVideos.map(
                            (video) => (
                                <VideoCard
                                    key={
                                        video._id
                                    }
                                    video={
                                        video
                                    }
                                    onVideoDeleted={
                                        handleVideoDeleted
                                    }
                                />
                            )
                        )}

                    </div>
                )}

        </div>
    );
}

export default Home;
