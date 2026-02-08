import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import ProductCard from './products/ProductCard';
import ProductFilters from './products/ProductFilters';
import Pagination from './products/Pagination';
import { PRODUCT_ENDPOINTS, CATEGORY_ENDPOINTS, CART_ENDPOINTS, getAuthHeaders } from '../config/api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [quantities, setQuantities] = useState({});

    const navigate = useNavigate();
    const fetchProducts = async (page = 0) => {
        setLoading(true);
        try {
            const headers = {
                'Accept': 'application/json'
            };

            let url;
            if (selectedCategory && searchTerm) {
                // Si hay categoría Y búsqueda, primero carga la categoría y luego filtra en front
                url = `${PRODUCT_ENDPOINTS.BY_CATEGORY(selectedCategory)}?page=${page}&size=20`;
            } else if (searchTerm) {
                // Si solo hay término de búsqueda, buscar por nombre
                url = `${PRODUCT_ENDPOINTS.SEARCH}?term=${encodeURIComponent(searchTerm)}&page=${page}&size=20`;
            } else if (selectedCategory) {
                // Si hay categoría seleccionada, usar endpoint específico
                url = `${PRODUCT_ENDPOINTS.BY_CATEGORY(selectedCategory)}?page=${page}&size=20`;
            } else {
                // Sin filtro, traer todos los productos
                url = `${PRODUCT_ENDPOINTS.ALL}?page=${page}&size=20`;
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
                `${CART_ENDPOINTS.ADD}?id=${product.productId}&quant=${quantity}`,
                {
                    method: 'POST',
                    headers
                }
            );

            if (response.ok) {
                toast.success(`${product.productName} agregado al carrito`);
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

                const resp = await fetch(`${CATEGORY_ENDPOINTS.ALL}`, { headers });
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
            <ProductFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                onSearch={fetchProducts}
                setCurrentPage={setCurrentPage}
            />

            {loading ? (
                <p className="text-center mt-5">Cargando catálogo...</p>
            ) : (
                <>
                    <div className="d-flex flex-wrap gap-3">
                        {products && products.length > 0 ? (
                            products.map((p) => (
                                <div key={p.idWeb || p.productId}>
                                    <ProductCard 
                                        product={p} 
                                        onAddToCart={handleAddToCart}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="text-center col-12 mt-4">
                                <p>No se encontraron productos.</p>
                            </div>
                        )}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
};

export default ProductList;