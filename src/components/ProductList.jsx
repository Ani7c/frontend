import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router'; // Importante para el redireccionamiento
import { toast } from 'react-toastify';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [quantities, setQuantities] = useState({}); // {productId: quantity}

    const navigate = useNavigate();

    // Función para añadir al carrito
   /* const handleAddToCart = async (product) => {
       const token = localStorage.getItem('token');

       if (!token) {
           alert("Debes iniciar sesión para añadir productos al carrito.");
           navigate('/login');
           return;
       }

       try {
           const requestOptions = {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/x-www-form-urlencoded',
                   'Authorization': `Bearer ${token}`
               },
               body: new URLSearchParams({
                   ean: product.productEan,
                   quant: 1
               })
           };

           const response = await fetch('http://localhost:8080/cart/add', requestOptions);
           if (response.ok) {
               alert(`¡${product.productName} añadido al carrito!`);
           } else {
               const errorData = await response.text();
               alert("Error: " + errorData);
           }
       } catch (error) {
           console.error("Error al añadir al carrito:", error);
           alert("Error: No se pudo añadir el producto");
       }
   }; */
    const fetchProducts = async (page = 0) => {
        setLoading(true);
        try {
            const headers = {
                'Accept': 'application/json'
            };

            let url;
            if (selectedCategory && searchTerm) {
                // Si hay categoría Y búsqueda, primero carga la categoría y luego filtra en front
                url = `http://localhost:8080/api/products/category/${selectedCategory}?page=${page}&size=20`;
            } else if (searchTerm) {
                // Si solo hay término de búsqueda, buscar por nombre
                url = `http://localhost:8080/api/products/search?term=${encodeURIComponent(searchTerm)}&page=${page}&size=20`;
            } else if (selectedCategory) {
                // Si hay categoría seleccionada, usar endpoint específico
                url = `http://localhost:8080/api/products/category/${selectedCategory}?page=${page}&size=20`;
            } else {
                // Sin filtro, traer todos los productos
                url = `http://localhost:8080/api/products/allProducts?page=${page}&size=20`;
            }

            const response = await fetch(url, {
                headers
            });
            if (response.ok) {
                let data = await response.json();
                let productsToDisplay = data.content || [];
                
                // Si hay categoría Y búsqueda, filtrar por nombre en el frontend
                if (selectedCategory && searchTerm) {
                    productsToDisplay = productsToDisplay.filter(p => 
                        p.productName.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }
                
                setProducts(productsToDisplay);
                setTotalPages(data.totalPages || 0);
                setCurrentPage(data.number || 0);
            } else {
                if (response.status === 401) {
                    console.error('No autorizado: falta API key o token.');
                    alert('Necesitas API Key o iniciar sesión para ver productos.');
                } else {
                    console.error("Error cargando productos:", response.statusText);
                }
            }
            setLoading(false);
        } catch (error) {
            console.error("Error cargando productos:", error);
            setLoading(false);
        }
    };

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity <= 0) return;
        setQuantities({
            ...quantities,
            [productId]: newQuantity
        });
    };

    const handleAddToCart = async (product) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.warning("Debes iniciar sesión para añadir productos al carrito.");
            navigate('/login');
            return;
        }

        const quantity = quantities[product.productId] || 1;

        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };

            const response = await fetch(
                `http://localhost:8080/cart/addProduct?id=${product.productId}&quant=${quantity}`,
                {
                    method: 'POST',
                    headers
                }
            );

            if (response.ok) {
                toast.success(`${product.productName} agregado al carrito (x${quantity})`);
            } else {
                const errorData = await response.text();
                toast.error(`Error: ${errorData}`);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error: No se pudo agregar el producto");
        }
    };

    // Cargar categorías desde el backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const headers = { 'Accept': 'application/json' };

                const resp = await fetch('http://localhost:8080/api/products/categories', { headers });
                if (resp.ok) {
                    const data = await resp.json();
                    // Guardar objetos completos con categoryId y name
                    setCategories(data);
                } else {
                    console.error('Error cargando categorías:', resp.statusText);
                }
            } catch (err) {
                console.error('Error cargando categorías:', err);
            }
        };
        fetchCategories();
    }, []);

    // Cargar productos al montar el componente
    useEffect(() => {
        fetchProducts(0);
    }, []);

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage, selectedCategory, searchTerm]);
    return (
        <div className="container py-4">
            <div className="d-flex align-items-center gap-2 mb-3">
                <input
                    type="text"
                    placeholder="¿Qué buscas? (Enter para buscar)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control"
                    onKeyDown={(e) => e.key === 'Enter' && (setCurrentPage(0), fetchProducts(0))}
                />

                <select
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(0); }}
                    className="form-select"
                >
                    <option value="">Todas las Categorías</option>
                    {categories && categories.map((cat) => (
                        <option key={`cat-${cat.categoryId}`} value={cat.categoryId}>
                            {cat.categoryName}
                        </option>
                    ))}
                </select>

                <button onClick={() => { setCurrentPage(0); fetchProducts(0); }} className="btn btn-success">
                    🔍 
                </button>
            </div>

            {loading ? (
                <p className="text-center mt-5">Cargando catálogo...</p>
            ) : (
                <>
                    <div className="row g-3">
                        {products && products.length > 0 ? (
                            products.map((p) => {
                                const currentQuantity = quantities[p.productId] || 1;
                                return (
                                    <div key={p.idWeb || p.productId} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                        <div className="card h-100">
                                            {p.productImageUrl && (
                                                <img src={p.productImageUrl} alt={p.productName} className="card-img-top" style={{ height: '150px', objectFit: 'contain' }} />
                                            )}
                                            <div className="card-body d-flex flex-column">
                                                {p.categoryName && <span className="badge text-bg-info mb-2 align-self-start">{p.categoryName}</span>}
                                                <h6 className="card-title">{p.productName}</h6>
                                                {p.productBrand && <p className="card-text text-muted small">{p.productBrand}</p>}
                                                
                                                <div className="mt-auto">
                                                    <label className="small d-block mb-1">Cantidad:</label>
                                                    <div className="btn-group mb-2" role="group">
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center justify-content-center"
                                                            style={{ width: 32, height: 32, padding: 0 }}
                                                            onClick={() => handleQuantityChange(p.productId, currentQuantity - 1)}
                                                            disabled={currentQuantity <= 1}
                                                        >
                                                            −
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-secondary btn-sm"
                                                            style={{ cursor: 'default', minWidth: 44 }}
                                                        >
                                                            {currentQuantity}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center justify-content-center"
                                                            style={{ width: 32, height: 32, padding: 0 }}
                                                            onClick={() => handleQuantityChange(p.productId, currentQuantity + 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <button
                                                        className="btn btn-primary btn-sm w-100"
                                                        onClick={() => handleAddToCart(p)}
                                                    >
                                                        🛒 Agregar al carrito
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center col-12 mt-4">
                                <p>No se encontraron productos.</p>
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                            <button disabled={currentPage === 0} onClick={() => setCurrentPage(prev => prev - 1)} className="btn btn-outline-secondary">⬅ Anterior</button>
                            <span className="text-muted">Página <strong>{currentPage + 1}</strong> de <strong>{totalPages}</strong></span>
                            <button disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage(prev => prev + 1)} className="btn btn-outline-secondary">Siguiente ➡</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};


export default ProductList;