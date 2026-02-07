import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const StoresManagement = () => {
    const [stores, setStores] = useState([]);
    const [showStoreForm, setShowStoreForm] = useState(false);
    const [editingStore, setEditingStore] = useState(null);
    const [storeForm, setStoreForm] = useState({
        rut: '',
        name: '',
        fantasyName: '',
        homePage: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/stores/getAllStores');
            if (response.ok) {
                const data = await response.json();
                setStores(data);
            } else {
                toast.error('Error al cargar tiendas');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al cargar tiendas');
        } finally {
            setLoading(false);
        }
    };

    const handleStoreSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const endpoint = editingStore ? '/stores/updateStore' : '/stores/addStore';
        setLoading(true);
        
        try {
            const response = await fetch(`http://localhost:8080${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    rut: parseInt(storeForm.rut),
                    name: storeForm.name,
                    fantasyName: storeForm.fantasyName,
                    homePage: storeForm.homePage
                })
            });
            
            if (response.ok) {
                const message = await response.text();
                toast.success(message);
                setShowStoreForm(false);
                setEditingStore(null);
                setStoreForm({ rut: '', name: '', fantasyName: '', homePage: '' });
                fetchStores();
            } else {
                const error = await response.text();
                toast.error(error);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al guardar tienda');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStore = async (rut) => {
        if (!confirm('¿Estás seguro de eliminar esta tienda?')) return;
        
        const token = localStorage.getItem('token');
        setLoading(true);
        
        try {
            const response = await fetch(`${API_BASE_URL}/stores/deleteStore?rut=${rut}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const message = await response.text();
                toast.success(message);
                fetchStores();
            } else {
                const error = await response.text();
                toast.error(error);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al eliminar tienda');
        } finally {
            setLoading(false);
        }
    };

    const handleEditStore = (store) => {
        setEditingStore(store);
        setStoreForm({
            rut: store.rut.toString(),
            name: store.name,
            fantasyName: store.fantasyName,
            homePage: store.homePage
        });
        setShowStoreForm(true);
    };

    const handleCancelForm = () => {
        setShowStoreForm(false);
        setEditingStore(null);
        setStoreForm({ rut: '', name: '', fantasyName: '', homePage: '' });
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Gestión de Tiendas</h4>
                <button
                    className="btn btn-success"
                    onClick={() => {
                        setShowStoreForm(true);
                        setEditingStore(null);
                        setStoreForm({ rut: '', name: '', fantasyName: '', homePage: '' });
                    }}
                >
                    + Agregar Tienda
                </button>
            </div>

            {/* Formulario de tienda */}
            {showStoreForm && (
                <div className="card mb-4">
                    <div className="card-header bg-success text-white">
                        <h5 className="mb-0">{editingStore ? 'Editar Tienda' : 'Nueva Tienda'}</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleStoreSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">RUT</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={storeForm.rut}
                                        onChange={(e) => setStoreForm({ ...storeForm, rut: e.target.value })}
                                        disabled={editingStore !== null}
                                        required
                                    />
                                    {editingStore && (
                                        <small className="form-text text-muted">
                                            El RUT no puede modificarse
                                        </small>
                                    )}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Nombre Fantasía</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={storeForm.fantasyName}
                                        onChange={(e) => setStoreForm({ ...storeForm, fantasyName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Nombre Legal</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={storeForm.name}
                                        onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Página Web</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        value={storeForm.homePage}
                                        onChange={(e) => setStoreForm({ ...storeForm, homePage: e.target.value })}
                                        placeholder="https://..."
                                        required
                                    />
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <button 
                                    type="submit" 
                                    className="btn btn-success"
                                    disabled={loading}
                                >
                                    {loading ? 'Guardando...' : (editingStore ? 'Actualizar' : '➕ Crear')}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCancelForm}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Lista de tiendas */}
            {loading && !showStoreForm ? (
                <p className="text-center">Cargando...</p>
            ) : stores.length === 0 ? (
                <div className="alert alert-info">No hay tiendas registradas</div>
            ) : (
                <div className="row g-3">
                    {stores.map((store) => (
                        <div key={store.rut} className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5>{store.fantasyName}</h5>
                                    <p className="mb-1 small text-muted">RUT: {store.rut}</p>
                                    <p className="mb-1 small">{store.name}</p>
                                    <a 
                                        href={store.homePage} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="small text-decoration-none"
                                    >
                                        {store.homePage}
                                    </a>
                                    <div className="mt-3 d-flex gap-2">
                                        <button
                                            className="btn btn-sm btn-outline-success"
                                            onClick={() => handleEditStore(store)}
                                            disabled={loading}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDeleteStore(store.rut)}
                                            disabled={loading}
                                        >
                                            Eliminar
                                        </button>
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

export default StoresManagement;
