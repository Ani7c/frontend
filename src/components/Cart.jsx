import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.warning("Debes iniciar sesión para ver tu carrito.");
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const apiKey = "clave_secreta_optify";
            const headers = {
                'Authorization': `Bearer ${token}`,
                'X-API-Key': apiKey
            };

            const response = await fetch('http://localhost:8080/api/cart/getProductsCart', {
                headers
            });

            if (response.ok) {
                const data = await response.json();
                setCartItems(data);
            } else {
                if (response.status === 401) {
                    toast.error("Sesión expirada. Por favor inicia sesión nuevamente.");
                    navigate('/login');
                } else {
                    toast.error("Error al cargar el carrito");
                }
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al cargar el carrito");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveProduct = async (productId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.warning("Debes iniciar sesión.");
            navigate('/login');
            return;
        }

        try {
            const apiKey = "clave_secreta_optify";
            const headers = {
                'Authorization': `Bearer ${token}`,
                'X-API-Key': apiKey
            };

            const response = await fetch(
                `http://localhost:8080/api/cart/removeProduct?id=${productId}`,
                {
                    method: 'POST',
                    headers
                }
            );

            if (response.ok) {
                toast.success("Producto eliminado del carrito");
                fetchCart(); // Recargar carrito
            } else {
                const errorData = await response.text();
                toast.error(`Error: ${errorData}`);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al eliminar el producto");
        }
    };

    const handleSubtractUnit = async (productId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.warning("Debes iniciar sesión.");
            navigate('/login');
            return;
        }

        try {
            const apiKey = "clave_secreta_optify";
            const headers = {
                'Authorization': `Bearer ${token}`,
                'X-API-Key': apiKey
            };

            const response = await fetch(
                `http://localhost:8080/api/cart/subtractUnitProductCart?id=${productId}`,
                {
                    method: 'POST',
                    headers
                }
            );

            if (response.ok) {
                toast.success("Unidad quitada del carrito");
                fetchCart();
            } else {
                const errorData = await response.text();
                toast.error(`Error: ${errorData}`);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al actualizar el carrito");
        }
    };

    const handleAddUnit = async (productId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.warning("Debes iniciar sesión.");
            navigate('/login');
            return;
        }

        try {
            const apiKey = "clave_secreta_optify";
            const headers = {
                'Authorization': `Bearer ${token}`,
                'X-API-Key': apiKey
            };

            const response = await fetch(
                `http://localhost:8080/api/cart/addProduct?id=${productId}&quant=1`,
                {
                    method: 'POST',
                    headers
                }
            );

            if (response.ok) {
                fetchCart();
            } else {
                const errorData = await response.text();
                toast.error(`Error: ${errorData}`);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al actualizar el carrito");
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando carrito...</p>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <h2 className="mb-4">🛒 Mi Carrito</h2>

            {cartItems.length === 0 ? (
                <div className="text-center py-5">
                    <h4 className="text-muted">Tu carrito está vacío</h4>
                    <button 
                        className="btn btn-primary mt-3"
                        onClick={() => navigate('/products')}
                    >
                        Ir a comprar
                    </button>
                </div>
            ) : (
                <>
                    <div className="row g-3">
                        {cartItems.map((item) => (
                            <div key={item.productId} className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row align-items-center g-3">
                                            <div className="col-md-2">
                                                {item.productImageUrl && (
                                                    <img 
                                                        src={item.productImageUrl} 
                                                        alt={item.productName} 
                                                        className="img-fluid"
                                                        style={{ maxHeight: '100px', objectFit: 'contain' }}
                                                    />
                                                )}
                                            </div>
                                            <div className="col-md-5">
                                                <h5 className="card-title mb-1">{item.productName}</h5>
                                                {item.productBrand && (
                                                    <p className="text-muted small mb-0">{item.productBrand}</p>
                                                )}
                                            </div>
                                            <div className="col-md-3 text-center">
                                                <p className="mb-1 text-muted small">Cantidad</p>
                                                <div className="btn-group" role="group">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center justify-content-center"
                                                        style={{ width: 32, height: 32, padding: 0 }}
                                                        onClick={() => handleSubtractUnit(item.productId)}
                                                        disabled={(item.quant || item.quantity || 0) <= 1}
                                                    >
                                                        −
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary btn-sm"
                                                        style={{ cursor: 'default', minWidth: 44 }}
                                                    >
                                                        {item.quant ?? item.quantity ?? 0}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center justify-content-center"
                                                        style={{ width: 32, height: 32, padding: 0 }}
                                                        onClick={() => handleAddUnit(item.productId)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-md-2 text-end">
                                                <button 
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleRemoveProduct(item.productId)}
                                                >
                                                    🗑️ Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="card mt-4 bg-light">
                        <div className="card-body">
                            <div className="row mt-3">
                                <div className="col-12 text-end">
                                    <button className="btn btn-success btn-lg">
                                        Finalizar Compra
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;