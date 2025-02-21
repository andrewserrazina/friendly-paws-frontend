import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import ClientDetails from "./ClientDetails";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<Login />} /> {/* Default to login */}
                <Route path="/clients/:id" element={<ClientDetails />} />
            </Routes>
        </Router>
    );
}

export default App;
