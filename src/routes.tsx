import { Navigate, Route, Routes } from "react-router";
import LandingPage from "./pages/Landing";

export default function AppRoutes() {
    return (
        <Routes>
            {/* publicas */}
            <Route path="/" element={<LandingPage />} />
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