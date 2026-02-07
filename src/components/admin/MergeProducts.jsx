import { useState } from 'react';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const MergeProducts = () => {
    const [keepProductId, setKeepProductId] = useState('');
    const [suprProductId, setSuprProductId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleMergeProducts = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        setLoading(true);
        
        try {
            const response = await fetch(
                `${API_BASE_URL}/products/mergeProducts?keepProductId=${keepProductId}&suprProductId=${suprProductId}`,
                {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            
            if (response.ok) {
                toast.success('Productos vinculados correctamente');
                setKeepProductId('');
                setSuprProductId('');
            } else {
                const error = await response.text();
                toast.error(error);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al vincular productos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h4 className="mb-3">Vincular Productos</h4>
            <div className="card">
                <div className="card-body">
                    <p className="text-muted mb-3">
                        Esta función permite vincular dos productos duplicados. El producto a mantener conservará 
                        toda su información y referencias, mientras que el producto a suprimir será eliminado.
                    </p>
                    <form onSubmit={handleMergeProducts}>
                        <div className="mb-3">
                            <label className="form-label">ID del Producto a Mantener</label>
                            <input
                                type="number"
                                className="form-control"
                                value={keepProductId}
                                onChange={(e) => setKeepProductId(e.target.value)}
                                placeholder="Ej: 123"
                                required
                            />
                            <small className="form-text text-muted">
                                Este producto mantendrá todos sus datos
                            </small>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">ID del Producto a Suprimir</label>
                            <input
                                type="number"
                                className="form-control"
                                value={suprProductId}
                                onChange={(e) => setSuprProductId(e.target.value)}
                                placeholder="Ej: 456"
                                required
                            />
                            <small className="form-text text-muted">
                                Este producto será eliminado después de la vinculación
                            </small>
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-success"
                            disabled={loading}
                        >
                            {loading ? 'Vinculando...' : '🔗 Vincular Productos'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MergeProducts;
