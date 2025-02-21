import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ClientDetails = () => {
    const { id } = useParams();
    const [client, setClient] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await axios.get(`https://friendly-paws-backend.onrender.com/clients/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setClient(response.data);
            } catch (err) {
                setError("Failed to load client details.");
            }
        };

        fetchClient();
    }, [id]);

    if (error) return <p className="text-red-500">{error}</p>;
    if (!client) return <p>Loading client details...</p>;

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold">{client.name}</h2>
            <p className="text-gray-600">📧 {client.email}</p>
            <p className="text-gray-600">📞 {client.phone}</p>

            <h3 className="mt-4 text-lg font-semibold">Pets</h3>
            <ul>
                {client.pets.length ? (
                    client.pets.map((pet) => (
                        <li key={pet.id} className="text-gray-700">
                            {pet.name} - {pet.species} {pet.breed ? `(${pet.breed})` : ""}
                        </li>
                    ))
                ) : (
                    <p>No pets listed.</p>
                )}
            </ul>

            <Link to="/dashboard">
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">⬅ Back</button>
            </Link>
        </div>
    );
};

export default ClientDetails;
