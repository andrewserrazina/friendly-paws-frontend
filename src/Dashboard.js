import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
    const [clients, setClients] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showClientModal, setShowClientModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [newClient, setNewClient] = useState({ name: "", email: "", phone: "" });
    const [newBooking, setNewBooking] = useState({ client_id: "", pet_id: "", service: "", date: "" });
    const navigate = useNavigate();

    const fetchData = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const clientsResponse = await axios.get("https://friendly-paws-backend.onrender.com/clients/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setClients(clientsResponse.data);

            const bookingsResponse = await axios.get("https://friendly-paws-backend.onrender.com/bookings/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBookings(bookingsResponse.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert("Session expired. Please log in again.");
                localStorage.removeItem("token");
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const addClient = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.post("https://friendly-paws-backend.onrender.com/clients/", newClient, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setClients([...clients, response.data]);
            setShowClientModal(false);
        } catch (error) {
            console.error("Error adding client:", error);
        }
    };

    const removeClient = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`https://friendly-paws-backend.onrender.com/clients/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setClients(clients.filter(client => client.id !== id));
        } catch (error) {
            console.error("Error deleting client:", error);
        }
    };

    const addBooking = async () => {
    const token = localStorage.getItem("token");
    if (!newBooking.client_id || !newBooking.pet_id || !newBooking.service || !newBooking.date) {
        alert("All fields are required.");
        return;
    }

    try {
        const response = await axios.post("https://friendly-paws-backend.onrender.com/bookings/", newBooking, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setBookings([...bookings, response.data]);
        setShowBookingModal(false);
    } catch (error) {
        console.error("Error adding booking:", error.response ? error.response.data : error);
    }
};

    const removeBooking = async (id) => {
    const token = localStorage.getItem("token");
    try {
        await axios.delete(`https://friendly-paws-backend.onrender.com/bookings/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(bookings.filter(booking => booking.id !== id));
    } catch (error) {
        console.error("Error deleting booking:", error.response ? error.response.data : error);
    }
};

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">📋 Pet Sitting Dashboard</h1>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-gray-700 flex justify-between">
                        🐶 Clients
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                            onClick={() => setShowClientModal(true)}>➕ Add</button>
                    </h2>
                    {loading ? <p className="text-gray-500">Loading clients...</p> : (
                        <ul className="mt-2 space-y-2">
                            {clients.map(client => (
                                <li key={client.id} className="p-3 border rounded-lg bg-gray-50 shadow flex justify-between">
                                    <div>
                                        <p className="text-lg">{client.name}</p>
                                        <p className="text-sm text-gray-500">{client.email} | {client.phone}</p>
                                    </div>
                                    <button className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                                        onClick={() => removeClient(client.id)}>❌ Remove</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-gray-700 flex justify-between">
                        📅 Bookings
                        <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                            onClick={() => setShowBookingModal(true)}>➕ Add</button>
                    </h2>
                    {loading ? <p className="text-gray-500">Loading bookings...</p> : (
                        <ul className="mt-2 space-y-2">
                            {bookings.map(booking => (
                                <li key={booking.id} className="p-3 border rounded-lg bg-gray-50 shadow flex justify-between">
                                    <div>
                                        <p className="text-lg">{booking.service}</p>
                                        <p className="text-sm text-gray-500">📅 {booking.date}</p>
                                    </div>
                                    <button className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                                        onClick={() => removeBooking(booking.id)}>❌ Remove</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Client Modal */}
            {showClientModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <h3 className="text-lg font-bold">Add Client</h3>
                        <input type="text" placeholder="Name" className="border p-2 w-full mt-2"
                            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} />
                        <input type="email" placeholder="Email" className="border p-2 w-full mt-2"
                            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} />
                        <input type="text" placeholder="Phone" className="border p-2 w-full mt-2"
                            onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} />
                        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2" onClick={addClient}>Add</button>
                        <button className="ml-2 text-gray-500" onClick={() => setShowClientModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Dashboard;
