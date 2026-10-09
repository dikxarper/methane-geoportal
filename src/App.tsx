import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./auth/AuthContext";

import { MapProvider } from "./features/map/MapProvider";
import { PointSourcesProvider } from "./features/point-sources/PointSourcesProvider";

import { AuthLayout } from "./layout/AuthLayout";
import { MapLayout } from "./layout/MapLayout";

import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

function ProtectedMap() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <MapProvider>
            <PointSourcesProvider>
                <MapLayout />
            </PointSourcesProvider>
        </MapProvider>
    );
}

function App() {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <AuthLayout>
                        <LoginPage />
                    </AuthLayout>
                }
            />

            <Route
                path="/register"
                element={
                    <AuthLayout>
                        <RegisterPage />
                    </AuthLayout>
                }
            />

            <Route path="/" element={<ProtectedMap />} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
