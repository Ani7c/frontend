// Configuración centralizada de la API
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Endpoints de autenticación
export const AUTH_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/users/login`,
    REGISTER: `${API_BASE_URL}/users/register`,
};

// Endpoints de productos
export const PRODUCT_ENDPOINTS = {
    ALL: `${API_BASE_URL}/api/products/allProducts`,
    BY_CATEGORY: (category) => `${API_BASE_URL}/api/products/category/${category}`,
    SEARCH: `${API_BASE_URL}/api/products/search`,
    MERGE: `${API_BASE_URL}/api/products/mergeProducts`,
    MANUAL_IMPORT: `${API_BASE_URL}/api/products/manualImport`,
    GET_STORE_PRODUCTS: `${API_BASE_URL}/api/products/getStoreProductsByProduct`,
    CHANGE_PRODUCT_REFERENCE: `${API_BASE_URL}/api/products/changeProductReference`,
    DELETE_PRODUCT_REFERENCE: `${API_BASE_URL}/api/products/deleteProductReference`,
};

// Endpoints de carrito
export const CART_ENDPOINTS = {
    ADD: `${API_BASE_URL}/cart/addProduct`,
    GET: `${API_BASE_URL}/cart/getProductsCart`,
    REMOVE: `${API_BASE_URL}/cart/removeProduct`,
    SUBTRACT: `${API_BASE_URL}/cart/subtractUnitProductCart`,
    CALCULATE: `${API_BASE_URL}/cart/calculateCart`,
};

// Endpoints de categorías
export const CATEGORY_ENDPOINTS = {
    ALL: `${API_BASE_URL}/api/products/categories`,
};

// Endpoints de tiendas
export const STORE_ENDPOINTS = {
    ALL: `${API_BASE_URL}/stores/getAllStores`, 
    ADD: `${API_BASE_URL}/stores/addStore`,
    UPDATE: `${API_BASE_URL}/stores/updateStore`,
    DELETE: `${API_BASE_URL}/stores/deleteStore`,
};

// Endpoints de matching (admin)
export const MATCHING_ENDPOINTS = {
    ALL: `${API_BASE_URL}/matching/all`,
    CONFIRM: `${API_BASE_URL}/matching/confirm`,
    DECLINE: `${API_BASE_URL}/matching/decline`,
    DISCARDED: `${API_BASE_URL}/matching/getAllDiscarded`,
    DELETE_DISCARDED: `${API_BASE_URL}/matching/deleteReferenceDiscarded`,
};

// Endpoints de usuario
export const USER_ENDPOINTS = {
    UPDATE_PROFILE: `${API_BASE_URL}/users/updateProfile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/users/changePassword`,
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
