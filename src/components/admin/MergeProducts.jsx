import { useState } from 'react';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const MergeProducts = () => {
    const [keepProductId, setKeepProductId] = useState('');
    const [suprProductId, setSuprProductId] = useState('');
    const [keepProductName, setKeepProductName] = useState('');
    const [suprProductName, setSuprProductName] = useState('');
    const [searchResults, setSearchResults] = useState({
        keep: [],
        supr: []
    });
    const [showResults, setShowResults] = useState({
        keep: false,
        supr: false
    });
    const [loading, setLoading] = useState(false);

    const handleSearchProducts = async (searchTerm, type) => {
        if (!searchTerm.trim()) {
            setSearchResults({ ...searchResults, [type]: [] });
            setShowResults({ ...showResults, [type]: false });
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/products/search?term=${encodeURIComponent(searchTerm)}&page=0&size=10`
            );

            if (response.ok) {
                const data = await response.json();
                const products = data.content || [];
                setSearchResults({ ...searchResults, [type]: products });
                setShowResults({ ...showResults, [type]: true });
            }
        } catch (error) {
            console.error('Error buscando productos:', error);
            toast.error('Error al buscar productos');
        }
    };

    const handleSelectProduct = (product, type) => {
        if (type === 'keep') {
            setKeepProductId(product.productId);
            setKeepProductName(product.productName);
            setShowResults({ ...showResults, keep: false });
        } else {
            setSuprProductId(product.productId);
            setSuprProductName(product.productName);
            setShowResults({ ...showResults, supr: false });
        }
    };

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
                setKeepProductName('');
                setSuprProductName('');
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
                        <div className="mb-4">
                            <label className="form-label">Producto a Mantener *</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar producto por nombre..."
                                onChange={(e) => handleSearchProducts(e.target.value, 'keep')}
                                required={!keepProductId}
                            />
                            {showResults.keep && searchResults.keep.length > 0 && (
                                <div className="border mt-2 p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {searchResults.keep.map(product => (
                                        <div
                                            key={product.productId}
                                            className="p-2 cursor-pointer border-bottom"
                                            onClick={() => handleSelectProduct(product, 'keep')}
                                            style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}
                                        >
                                            <strong>{product.productName}</strong> (ID: {product.productId})
                                        </div>
                                    ))}
                                </div>
                            )}
                            {keepProductId && (
                                <div className="alert alert-success mt-2 mb-0">
                                    ✓ Seleccionado: <strong>{keepProductName}</strong> (ID: {keepProductId})
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Producto a Suprimir *</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar producto por nombre..."
                                onChange={(e) => handleSearchProducts(e.target.value, 'supr')}
                                required={!suprProductId}
                            />
                            {showResults.supr && searchResults.supr.length > 0 && (
                                <div className="border mt-2 p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {searchResults.supr.map(product => (
                                        <div
                                            key={product.productId}
                                            className="p-2 cursor-pointer border-bottom"
                                            onClick={() => handleSelectProduct(product, 'supr')}
                                            style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}
                                        >
                                            <strong>{product.productName}</strong> (ID: {product.productId})
                                        </div>
                                    ))}
                                </div>
                            )}
                            {suprProductId && (
                                <div className="alert alert-warning mt-2 mb-0">
                                    ⚠ Será eliminado: <strong>{suprProductName}</strong> (ID: {suprProductId})
                                </div>
                            )}
                            <small className="form-text text-muted d-block mt-2">
                                Este producto será eliminado después de la vinculación
                            </small>
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-success"
                            disabled={loading || !keepProductId || !suprProductId}
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
