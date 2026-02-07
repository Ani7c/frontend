import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const MatchesPending = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        const token = localStorage.getItem('token');
        setLoading(true);
        
        try {
            const response = await fetch('http://localhost:8080/matching/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                setMatches(data);
            } else {
                const error = await response.text();
                toast.error(error);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al cargar matches pendientes');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmMatch = async (matchId) => {
        if (!confirm('¿Estás seguro de confirmar este match? Esta acción vinculará ambos productos.')) {
            return;
        }
        
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch(`http://localhost:8080/matching/confirm?id=${matchId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                toast.success('Match confirmado exitosamente');
                fetchMatches();
            } else {
                const error = await response.text();
                toast.error(error);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al confirmar match');
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Matches Pendientes</h4>
                <button className="btn btn-success" onClick={fetchMatches}>
                    🔄 Actualizar
                </button>
            </div>

            {loading ? (
                <p className="text-center">Cargando...</p>
            ) : matches.length === 0 ? (
                <div className="alert alert-info">No hay matches pendientes</div>
            ) : (
                <div className="row g-4">
                    {matches.map((match) => (
                        <div key={match.idMatchPending} className="col-12 col-lg-10 mx-auto">
                            <div className="card border-success">
                                <div className="card-body">
                                    <div className="row g-3 align-items-center">
                                        {/* PRODUCTO EN BD */}
                                        <div className="col-md-4">
                                            <div className="border rounded p-3 text-center">
                                                <p className="text-muted small mb-2">Producto en Base de Datos</p>
                                                {match.productBDImage && (
                                                    <img
                                                        src={match.productBDImage}
                                                        alt={match.productName}
                                                        className="img-fluid mb-2"
                                                        style={{ maxHeight: '150px', objectFit: 'contain' }}
                                                    />
                                                )}
                                                <h6 className="mb-1">{match.productName}</h6>
                                                <a
                                                    href={match.storeProductUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="small text-decoration-none"
                                                >
                                                    Ver en tienda →
                                                </a>
                                            </div>
                                        </div>

                                        {/* FLECHA */}
                                        <div className="col-md-1 text-center">
                                            <div className="mb-2">
                                                <p className="text-muted small">¿Son iguales?</p>
                                                <h3>⇄</h3>
                                            </div>
                                        </div>

                                        {/* PRODUCTO NUEVO */}
                                        <div className="col-md-4">
                                            <div className="border rounded p-3 bg-light text-center">
                                                <p className="text-muted small mb-2">Producto Nuevo (Web)</p>
                                                {match.newProductImageUrl && (
                                                    <img
                                                        src={match.newProductImageUrl.split(',')[0]}
                                                        alt={match.newProductName}
                                                        className="img-fluid mb-2"
                                                        style={{ maxHeight: '150px', objectFit: 'contain' }}
                                                    />
                                                )}
                                                <h6 className="mb-1">{match.newProductName}</h6>
                                                <a
                                                    href={match.newProductUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="small text-decoration-none"
                                                >
                                                    Ver en tienda →
                                                </a>
                                            </div>
                                        </div>

                                        {/* BOTONES A LA DERECHA */}
                                        <div className="col-md-3 d-flex flex-column gap-2">
                                            <button
                                                className="btn btn-success w-100"
                                                onClick={() => handleConfirmMatch(match.idMatchPending)}
                                            >
                                                ✓ Confirmar Match
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MatchesPending;
