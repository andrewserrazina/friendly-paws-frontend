import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://friendly-paws-backend.onrender.com/login/", new URLSearchParams({
                username,
                password
            }), {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            });

            console.log("✅ Login successful:", response.data);
            localStorage.setItem("token", response.data.access_token); // Save token
            navigate("/dashboard"); // Redirect after login
        } catch (error) {
            console.error("❌ Login error:", error.response || error);
            setError("Invalid username or password");
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
