import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const DiscardedReferences = () => {
    const [references, setReferences] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchDiscarded();
    }, []);

    const fetchDiscarded = async () => {
        const token = localStorage.getItem('token');
        setLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/matching/getAllDiscarded`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setReferences(data || []);
            } else {
                const error = await response.text();
                setErrorMessage(error || 'Error al cargar referencias descartadas');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error al cargar referencias descartadas');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar esta referencia descartada?')) return;

        const token = localStorage.getItem('token');
        setErrorMessage('');
        try {
            const response = await fetch(`${API_BASE_URL}/matching/deleteReferenceDiscarded?id=${id}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                toast.success('Referencia eliminada con éxito');
                fetchDiscarded();
            } else {
                const error = await response.text();
                setErrorMessage(error || 'Error al eliminar referencia');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error al eliminar referencia');
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Referencias descartadas</h4>
                <button className="btn btn-success" onClick={fetchDiscarded}>Actualizar</button>
            </div>

            {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
            )}

            {loading ? (
                <p className="text-center">Cargando...</p>
            ) : references.length === 0 ? (
                <div className="alert alert-info">No hay referencias descartadas</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped align-middle">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>URL</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {references.map((ref) => (
                                <tr key={ref.id}>
                                    <td>{ref.id}</td>
                                    <td>{ref.url}</td>
                                    <td>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDelete(ref.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DiscardedReferences;
