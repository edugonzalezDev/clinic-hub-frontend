import { Navigate, Route, Routes } from "react-router";
import LandingPage from "./pages/Landing";
import RegisterPage  from "./pages/RegisterPage";

export default function AppRoutes() {
    return (
        <Routes>
            {/* publicas */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* protegidas */}

            {/* admin */}

            {/* Doctor */}

            {/* pacietes */}

            {/* compartidas */}

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}