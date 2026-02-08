import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { PRODUCT_ENDPOINTS, STORE_ENDPOINTS, getAuthHeaders } from '../../config/api';

const CreateProduct = () => {
    const [stores, setStores] = useState([]);
    const [formData, setFormData] = useState({
        idWeb: '',
        productName: '',
        productDescription: '',
        productImageUrl: '',
        productBrand: '',
        categoryName: '',
        storeRut: '',
        urlProduct: '',
        productPrice: ''
    });
    const [loading, setLoading] = useState(false);

    // Cargar tiendas al montar el componente
    useEffect(() => {
        const fetchStores = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${STORE_ENDPOINTS.ALL}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStores(data);
                }
            } catch (error) {
                console.error('Error cargando tiendas:', error);
            }
        };
        fetchStores();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar campos requeridos
        if (!formData.idWeb || !formData.productName || !formData.productPrice || !formData.categoryName || !formData.storeRut) {
            toast.error('Por favor completa los campos requeridos');
            return;
        }

        const token = localStorage.getItem('token');
        setLoading(true);

        try {
            const response = await fetch(`${PRODUCT_ENDPOINTS.MANUAL_IMPORT}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idWeb: parseInt(formData.idWeb),
                    productName: formData.productName,
                    productDescription: formData.productDescription,
                    productImageUrl: formData.productImageUrl,
                    productBrand: formData.productBrand,
                    categoryName: formData.categoryName,
                    storeRut: parseInt(formData.storeRut),
                    urlProduct: formData.urlProduct,
                    productPrice: parseFloat(formData.productPrice)
                })
            });

            if (response.ok) {
                const message = await response.text();
                toast.success(message);
                // Limpiar formulario
                setFormData({
                    idWeb: '',
                    productName: '',
                    productDescription: '',
                    productImageUrl: '',
                    productBrand: '',
                    categoryName: '',
                    storeRut: '',
                    urlProduct: '',
                    productPrice: ''
                });
            } else {
                const error = await response.text();
                toast.error(error || 'Error al crear producto');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al crear producto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Crear Nuevo Producto</h4>
            </div>

            <div className="card">
                <div className="card-header bg-success text-white">
                    <h5 className="mb-0">Formulario de Producto</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">ID Web *</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="idWeb"
                                    value={formData.idWeb}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ej: 12345"
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Tienda *</label>
                                <select
                                    className="form-control"
                                    name="storeRut"
                                    value={formData.storeRut}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona una tienda</option>
                                    {stores.map(store => (
                                        <option key={store.rut} value={store.rut}>
                                            {store.fantasyName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Nombre del Producto *</label>
                            <input
                                type="text"
                                className="form-control"
                                name="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                required
                                placeholder="Nombre del producto"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Descripción</label>
                            <textarea
                                className="form-control"
                                name="productDescription"
                                value={formData.productDescription}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Descripción del producto"
                            ></textarea>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Marca</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="productBrand"
                                    value={formData.productBrand}
                                    onChange={handleChange}
                                    placeholder="Ej: Samsung"
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Categoría *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="categoryName"
                                    value={formData.categoryName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ej: Electrónica"
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Precio *</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="productPrice"
                                    value={formData.productPrice}
                                    onChange={handleChange}
                                    required
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">URL de Imagen</label>
                                <input
                                    type="url"
                                    className="form-control"
                                    name="productImageUrl"
                                    value={formData.productImageUrl}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">URL del Producto</label>
                            <input
                                type="url"
                                className="form-control"
                                name="urlProduct"
                                value={formData.urlProduct}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={loading}
                            >
                                {loading ? 'Creando...' : '➕ Crear Producto'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="alert alert-info mt-4">
                <strong>Nota:</strong> Los campos marcados con * son obligatorios.
            </div>
        </div>
    );
};

export default CreateProduct;
