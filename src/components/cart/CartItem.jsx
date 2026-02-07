const CartItem = ({ item, onRemove, onSubtract, onAdd }) => {
    return (
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
                    <div className="col-md-8">
                        <h5 className="card-title mb-1">{item.productName}</h5>
                        {item.productBrand && (
                            <p className="text-muted small mb-0">{item.productBrand}</p>
                        )}
                    </div>
                    <div className="col-md-2 text-end">
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => onRemove(item.productId)}
                        >
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
