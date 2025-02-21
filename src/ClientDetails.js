import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_URL = "https://friendly-paws-backend.onrender.com";

const ClientDetails = () => {
    const { id } = useParams(); // Get client ID from URL
    const [client, setClient] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await axios.get(`${API_URL}/clients/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setClient(response.data);
            } catch (err) {
                console.error("❌ Error fetching client:", err);
                setError("Failed to load client details.");
            }
        };

        fetchClient();
    }, [id]);

    if (error) return <p className="text-red-500">{error}</p>;
    if (!client) return <p>Loading client details...</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold">{client.name}</h2>
            <p>Email: {client.email}</p>
            <p>Phone: {client.phone}</p>
            <h3 className="text-xl mt-4">Pets:</h3>
            <ul>
                {client.pets && client.pets.length > 0 ? (
                    client.pets.map((pet) => (
                        <li key={pet.id}>
                            {pet.name} - {pet.species} {pet.breed ? `(${pet.breed})` : ""}
                        </li>
                    ))
                ) : (
                    <p>No pets listed.</p>
                )}
            </ul>
            <Link to="/dashboard">
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Back to Dashboard</button>
            </Link>
        </div>
    );
};

export default ClientDetails;
