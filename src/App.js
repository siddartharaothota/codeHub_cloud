import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./LoginPage";
import FileManager from "./FileManager";
import ChatPage from "./ChatPage";
import CreatePage from "./CreatePage";

function App() {
    const [user, setUser] = useState(null);

    const ProtectedRoute = ({ children }) => {
        if (!user) return <Navigate to="/login" replace />;
        return children;
    };

    return (
        <Routes>
            <Route path="/login" element={<LoginPage onLoginSuccess={setUser} />} />

            {/* FileManager as protected landing page */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <FileManager username={user?.username} api={user?.serverApi} onLogout={() => setUser(null)} />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/chat"
                element={
                    <ProtectedRoute>
                        <ChatPage username={user?.username} api={user?.serverApi} />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/create"
                element={
                    <ProtectedRoute>
                        <CreatePage username={user?.username} api={user?.serverApi} />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
        </Routes>
    );
}

export default App;
