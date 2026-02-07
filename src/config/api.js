// Configuración centralizada de la API
const API_BASE_URL = 'http://localhost:8080';

// Endpoints de autenticación
export const AUTH_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
};

// Endpoints de productos
export const PRODUCT_ENDPOINTS = {
    ALL: `${API_BASE_URL}/api/products/allProducts`,
    BY_CATEGORY: (category) => `${API_BASE_URL}/api/products/category/${category}`,
    SEARCH: `${API_BASE_URL}/api/products/search`,
    MERGE: `${API_BASE_URL}/products/mergeProducts`,
};

// Endpoints de carrito
export const CART_ENDPOINTS = {
    ADD: `${API_BASE_URL}/cart/add`,
    GET: `${API_BASE_URL}/cart/getProductsCart`,
    REMOVE: `${API_BASE_URL}/cart/removeProduct`,
    UPDATE: `${API_BASE_URL}/cart/updateProductQuantity`,
    CLEAR: `${API_BASE_URL}/cart/clearCart`,
    CALCULATE: `${API_BASE_URL}/cart/calculateCart`,
};

// Endpoints de categorías
export const CATEGORY_ENDPOINTS = {
    ALL: `${API_BASE_URL}/api/categories/allCategories`,
};

// Endpoints de tiendas
export const STORE_ENDPOINTS = {
    ALL: `${API_BASE_URL}/stores/getAllStores`, // ⚠️ CORREGIDO: estaba /api/stores/getAllStores
    ADD: `${API_BASE_URL}/stores/addStore`,
    UPDATE: `${API_BASE_URL}/stores/updateStore`,
    DELETE: `${API_BASE_URL}/stores/deleteStore`,
};

// Endpoints de matching (admin)
export const MATCHING_ENDPOINTS = {
    ALL: `${API_BASE_URL}/matching/all`,
    CONFIRM: `${API_BASE_URL}/matching/confirm`,
};

// Endpoints de usuario
export const USER_ENDPOINTS = {
    PROFILE: `${API_BASE_URL}/api/users/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/api/users/update`,
    CHANGE_PASSWORD: `${API_BASE_URL}/api/users/changePassword`,
};

// Helper para construir headers con autenticación
export const getAuthHeaders = (includeContentType = false) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    
    if (includeContentType) {
        headers['Content-Type'] = 'application/json';
    }
    
    return headers;
};

export default API_BASE_URL;
