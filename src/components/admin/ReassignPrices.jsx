import { useState } from 'react';
import { toast } from 'react-toastify';
import { PRODUCT_ENDPOINTS, getAuthHeaders } from '../../config/api';

const ReassignPrices = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [storePrices, setStorePrices] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Para reasignar
    const [reassigning, setReassigning] = useState(null); // { storeRut, oldProductId }
    const [newProductSearch, setNewProductSearch] = useState('');
    const [newProductResults, setNewProductResults] = useState([]);
    const [showNewProductResults, setShowNewProductResults] = useState(false);

    const handleSearchProducts = async (term) => {
        setSearchTerm(term);
        
        if (!term.trim()) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        try {
            const response = await fetch(
                `${PRODUCT_ENDPOINTS.SEARCH}?term=${encodeURIComponent(term)}&page=0&size=10`
            );

            if (response.ok) {
                const data = await response.json();
                const products = data.content || [];
                setSearchResults(products);
                setShowResults(true);
            }
        } catch (error) {
            console.error('Error buscando productos:', error);
            toast.error('Error al buscar productos');
        }
    };

    const handleSelectProduct = async (product) => {
        setSelectedProduct(product);
        setShowResults(false);
        setSearchTerm('');
        await fetchStorePrices(product.productId);
    };

    const fetchStorePrices = async (productId) => {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch(
                `${PRODUCT_ENDPOINTS.GET_STORE_PRODUCTS}?productId=${productId}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setStorePrices(data);
            } else {
                toast.error('Error al cargar precios del producto');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al cargar precios');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchNewProduct = async (term) => {
        setNewProductSearch(term);
        
        if (!term.trim()) {
            setNewProductResults([]);
            setShowNewProductResults(false);
            return;
        }

        try {
            const response = await fetch(
                `${PRODUCT_ENDPOINTS.SEARCH}?term=${encodeURIComponent(term)}&page=0&size=10`
            );

            if (response.ok) {
                const data = await response.json();
                const products = data.content || [];
                setNewProductResults(products);
                setShowNewProductResults(true);
            }
        } catch (error) {
            console.error('Error buscando productos:', error);
        }
    };

    const handleReassignPrice = async (newProduct) => {
        if (!reassigning) return;
        
        if (newProduct.productId === reassigning.oldProductId) {
            toast.error('No puedes reasignar al mismo producto');
            return;
        }

        const token = localStorage.getItem('token');
        setLoading(true);

        try {
            const response = await fetch(
                `${PRODUCT_ENDPOINTS.CHANGE_PRODUCT_REFERENCE}?newProductId=${newProduct.productId}&oldProductid=${reassigning.oldProductId}&storeRut=${reassigning.storeRut}`,
                {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.ok) {
                toast.success('Referencia reasignada correctamente');
                setReassigning(null);
                setNewProductSearch('');
                setShowNewProductResults(false);
                await fetchStorePrices(selectedProduct.productId);
            } else {
                const error = await response.text();
                toast.error(error || 'Error al reasignar');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al reasignar referencia');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReference = async (productId, storeRut) => {
        if (!confirm('¿Estás seguro de eliminar esta referencia de precio?')) return;

        const token = localStorage.getItem('token');
        setLoading(true);

        try {
            const response = await fetch(
                `${PRODUCT_ENDPOINTS.DELETE_PRODUCT_REFERENCE}?productId=${productId}&storeRut=${storeRut}`,
                {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.ok) {
                toast.success('Referencia eliminada correctamente');
                await fetchStorePrices(selectedProduct.productId);
            } else {
                const error = await response.text();
                toast.error(error || 'Error al eliminar');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al eliminar referencia');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h4 className="mb-3">Reasignar Precios de Producto</h4>
            
            <div className="card mb-4">
                <div className="card-body">
                    <label className="form-label">Buscar Producto</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar producto por nombre..."
                        value={searchTerm}
                        onChange={(e) => handleSearchProducts(e.target.value)}
                    />
                    
                    {showResults && searchResults.length > 0 && (
                        <div className="border mt-2 p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {searchResults.map(product => (
                                <div
                                    key={product.productId}
                                    className="p-2 border-bottom"
                                    onClick={() => handleSelectProduct(product)}
                                    style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}
                                >
                                    <strong>{product.productName}</strong> (ID: {product.productId})
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedProduct && (
                <div className="card">
                    <div className="card-header bg-success text-white">
                        <h5 className="mb-0">
                            Precios de: {selectedProduct.productName}
                        </h5>
                    </div>
                    <div className="card-body">
                        {loading ? (
                            <p className="text-center">Cargando precios...</p>
                        ) : storePrices.length === 0 ? (
                            <div className="alert alert-info">
                                No hay precios registrados para este producto
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Tienda</th>
                                            <th>RUT Tienda</th>
                                            <th>Precio</th>
                                            <th>URL</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {storePrices.map((sp) => (
                                            <tr key={`${sp.storeRut}-${sp.product?.productId}`}>
                                                <td>{sp.store?.fantasyName || 'N/A'}</td>
                                                <td>{sp.storeRut}</td>
                                                <td>${sp.price?.toFixed(2)}</td>
                                                <td>
                                                    <a 
                                                        href={sp.urlProduct} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-truncate d-inline-block"
                                                        style={{ maxWidth: '200px' }}
                                                    >
                                                        {sp.urlProduct}
                                                    </a>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-warning me-2"
                                                        onClick={() => setReassigning({ 
                                                            storeRut: sp.storeRut, 
                                                            oldProductId: selectedProduct.productId 
                                                        })}
                                                        disabled={loading}
                                                    >
                                                        🔄 Reasignar
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDeleteReference(selectedProduct.productId, sp.storeRut)}
                                                        disabled={loading}
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
                </div>
            )}

            {/* Modal de reasignación */}
            {reassigning && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Reasignar a Nuevo Producto</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setReassigning(null);
                                        setNewProductSearch('');
                                        setShowNewProductResults(false);
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <label className="form-label">Buscar Nuevo Producto</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar producto..."
                                    value={newProductSearch}
                                    onChange={(e) => handleSearchNewProduct(e.target.value)}
                                />
                                
                                {showNewProductResults && newProductResults.length > 0 && (
                                    <div className="border mt-2 p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {newProductResults.map(product => (
                                            <div
                                                key={product.productId}
                                                className="p-2 border-bottom"
                                                onClick={() => handleReassignPrice(product)}
                                                style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}
                                            >
                                                <strong>{product.productName}</strong> (ID: {product.productId})
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setReassigning(null);
                                        setNewProductSearch('');
                                        setShowNewProductResults(false);
                                    }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReassignPrices;
