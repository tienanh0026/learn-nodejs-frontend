import { login } from "@modules/api/login";
import { ErrorResponse } from "@modules/libs/axios/types";
import axios from "axios";
import { useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "cookies-js";

export default function LoginPage() {
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const mailId = useId();
    const passwordId = useId();
    const navigate = useNavigate();
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            setLoading(true);
            const response = await login({ email: mail, password: password });
            Cookies.set("access-token", response.data.data.accessToken);
            Cookies.set("refresh-token", response.data.data.refreshToken);
            navigate("/");
        } catch (error) {
            if (axios.isAxiosError<ErrorResponse>(error)) {
                setError(error.response?.data.message);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex items-center justify-center h-full gap-8">
            <form
                className="flex flex-col gap-2 items-center"
                onSubmit={handleSubmit}
            >
                <h1 className="font-bold text-center text-2xl">LOGIN PAGE</h1>
                <label htmlFor={mailId} className="flex flex-col gap-2 mt-4">
                    <p className="font-bold">Email</p>
                    <input
                        className="p-2 rounded-md py-1"
                        id={mailId}
                        name="email"
                        value={mail}
                        onChange={(e) => {
                            setMail(e.target.value);
                        }}
                    />
                </label>
                <label htmlFor={passwordId}>
                    <p className="font-bold">Password</p>
                    <input
                        className="p-2 rounded-md py-1"
                        id={passwordId}
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                </label>
                {error && <p className="text-red-400 font-medium">{error}</p>}
                <button
                    disabled={loading}
                    className="mt-4 p-2 py-1 font-bold bg-blue-400 w-fit rounded-md"
                >
                    Submit
                </button>
                <p>
                    If you don't have account,{" "}
                    <Link className="underline" to="/register">
                        click here
                    </Link>
                </p>
            </form>
        </div>
    );
}
