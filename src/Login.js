import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://friendly-paws-backend.onrender.com"; // Ensure correct URL

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null); // Reset error before new request

        try {
            // Attempt login using JSON (preferred)
            const response = await axios.post(
                `${API_URL}/login/`,
                {
                    username,
                    password,
                },
                {
                    headers: { "Content-Type": "application/json" }, // JSON data format
                }
            );

            console.log("✅ Login successful:", response.data);
            localStorage.setItem("token", response.data.access_token); // Save token
            navigate("/dashboard"); // Redirect to dashboard
        } catch (error) {
            console.error("❌ Login error:", error.response?.data || error.message);

            // Check for a 422 error (wrong request format) and retry with form-data
            if (error.response?.status === 422) {
                console.warn("🔄 Retrying login with form-data...");
                try {
                    const formResponse = await axios.post(
                        `${API_URL}/login/`,
                        new URLSearchParams({ username, password }), // Form data fallback
                        {
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        }
                    );

                    console.log("✅ Login successful (form-data fallback):", formResponse.data);
                    localStorage.setItem("token", formResponse.data.access_token);
                    navigate("/dashboard");
                } catch (formError) {
                    console.error("❌ Login failed (form-data fallback):", formError.response?.data || formError.message);
                    setError("Invalid username or password");
                }
            } else {
                setError("Invalid username or password");
            }
        }
    };

    return (
        <div className="p-6">
            <h2>Login</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
