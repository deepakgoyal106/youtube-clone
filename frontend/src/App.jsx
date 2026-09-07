import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import UploadVideo from "./pages/UploadVideo";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VideoPlayer from "./pages/VideoPlayer";
import Channel from "./pages/Channel";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen((previousState) => !previousState);
    };

    return (
        <BrowserRouter>

            <Header
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                toggleSidebar={toggleSidebar}
            />

            <div className="layout">

                {sidebarOpen && (
                    <Sidebar />
                )}

                <main className="main-content">

                    <Routes>

                        <Route
                            path="/"
                            element={
                                <Home
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                />
                            }
                        />

                        <Route
                            path="/video/:id"
                            element={<VideoPlayer />}
                        />

                        <Route
                            path="/channel"
                            element={
                                <ProtectedRoute>
                                    <Channel />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/upload"
                            element={
                                <ProtectedRoute>
                                    <UploadVideo />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/register"
                            element={<Register />}
                        />

                        <Route
                            path="/login"
                            element={<Login />}
                        />

                    </Routes>

                </main>

            </div>

        </BrowserRouter>
    );
}

export default App;