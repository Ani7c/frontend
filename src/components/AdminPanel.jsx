import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import MatchesPending from './admin/MatchesPending.jsx';
import MergeProducts from './admin/MergeProducts.jsx';
import StoresManagement from './admin/StoresManagement.jsx';
import DiscardedReferences from './admin/DiscardedReferences.jsx';
import CreateProduct from './admin/CreateProduct.jsx';
import ReassignPrices from './admin/ReassignPrices.jsx';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('matches');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.warning("Debes iniciar sesión");
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="container py-4">
            <h2 className="mb-4">Panel de Administración</h2>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'matches' ? 'active' : ''}`}
                        onClick={() => setActiveTab('matches')}
                    >
                        Matches Pendientes
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'merge' ? 'active' : ''}`}
                        onClick={() => setActiveTab('merge')}
                    >
                        Vincular Productos
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'stores' ? 'active' : ''}`}
                        onClick={() => setActiveTab('stores')}
                    >
                        Gestión de Tiendas
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'discarded' ? 'active' : ''}`}
                        onClick={() => setActiveTab('discarded')}
                    >
                        Descartados
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'create' ? 'active' : ''}`}
                        onClick={() => setActiveTab('create')}
                    >
                        Crear Producto
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'reassign' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reassign')}
                    >
                        Reasignar Precios
                    </button>
                </li>
            </ul>

            {/* MATCHES PENDIENTES */}
            {activeTab === 'matches' && <MatchesPending />}

            {/* VINCULAR PRODUCTOS */}
            {activeTab === 'merge' && <MergeProducts />}

            {/* GESTIÓN DE TIENDAS */}
            {activeTab === 'stores' && <StoresManagement />}

            {/* DESCARTADOS */}
            {activeTab === 'discarded' && <DiscardedReferences />}

            {/* CREAR PRODUCTO */}
            {activeTab === 'create' && <CreateProduct />}

            {/* REASIGNAR PRECIOS */}
            {activeTab === 'reassign' && <ReassignPrices />}
        </div>
    );
};

export default AdminPanel;
