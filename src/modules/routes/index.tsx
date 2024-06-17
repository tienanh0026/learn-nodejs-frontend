import AuthGuard from "@components/Layout/AuthGuard";
import Layout from "@components/Layout/Layout";
import HomePage from "@pages/home";
import LoginPage from "@pages/login";
import RegisterPage from "@pages/register";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function RouterConfig() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/">
                        <Route path="/" element={<HomePage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                    </Route>
                    <Route path="/" element={<AuthGuard />}>
                        <Route path="/room/:roomId" element={<>room</>} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default RouterConfig;
