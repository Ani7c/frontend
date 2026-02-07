const ProductCard = ({ product, onAddToCart }) => {
    return (
        <div className="card h-100" style={{width: '240px'}}>
            {product.productImageUrl && (
                <img 
                    src={product.productImageUrl} 
                    alt={product.productName} 
                    className="card-img-top" 
                    style={{ height: '120px', objectFit: 'contain' }} 
                />
            )}
            <div className="card-body d-flex flex-column">
                {product.categoryName && (
                    <span className="badge text-dark border border-dark mb-2 align-self-start">
                        {product.categoryName}
                    </span>
                )}
                <h6 className="card-title">{product.productName}</h6>
                {product.productBrand && (
                    <p className="card-text text-muted small">{product.productBrand}</p>
                )}
                
                <div className="mt-auto">
                    <button
                        className="btn btn-success btn-sm w-100"
                        onClick={() => onAddToCart(product)}
                    >
                        Agregar al carrito
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
