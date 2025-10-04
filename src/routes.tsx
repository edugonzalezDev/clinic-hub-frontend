import { Navigate, Route, Routes } from "react-router";
import LandingPage from "./pages/Landing";
import Login from "./pages/Login";
import SelectUserType from "./pages/SelectUserType";

export default function AppRoutes() {
    return (
        <Routes>
            {/* publicas */}
            <Route path="/" element={<LandingPage />} />

            <Route path="/select-user-type" element={<SelectUserType />} /> {/* opcional */}
            <Route path="/login" element={<Login />} />
            {/* <Route path="/register" element={<Register />} /> */}
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