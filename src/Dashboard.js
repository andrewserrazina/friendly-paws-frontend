import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
    const [clients, setClients] = useState([]);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const [clientsRes, bookingsRes] = await Promise.all([
                    axios.get("https://friendly-paws-backend.onrender.com/clients/", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("https://friendly-paws-backend.onrender.com/bookings/", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                setClients(clientsRes.data);
                setBookings(bookingsRes.data);
            } catch (error) {
                console.error("❌ Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md p-4">
                <h2 className="text-2xl font-bold text-gray-700">🐾 Friendly Paws</h2>
                <nav className="mt-6">
                    <Link to="/dashboard" className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded">
                        📊 Dashboard
                    </Link>
                    <Link to="/clients" className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded">
                        🐶 Clients
                    </Link>
                    <Link to="/bookings" className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded">
                        📅 Bookings
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <h1 className="text-3xl font-semibold text-gray-800">📊 Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-6 mt-6">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold">Total Clients</h2>
                        <p className="text-2xl font-bold">{clients.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold">Upcoming Bookings</h2>
                        <p className="text-2xl font-bold">{bookings.length}</p>
                    </div>
                </div>

                {/* Clients Section */}
                <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold">🐾 Clients</h2>
                    <ul className="divide-y divide-gray-200">
                        {clients.map((client) => (
                            <li key={client.id} className="py-2 flex justify-between items-center">
                                <Link to={`/clients/${client.id}`} className="text-blue-500 hover:underline">
                                    {client.name} - {client.email}
                                </Link>
                                <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
