const EmptyCart = ({ onGoToProducts }) => {
    return (
        <div className="text-center py-5">
            <h4 className="text-muted">Tu carrito está vacío</h4>
            <button
                className="btn btn-primary mt-3"
                onClick={onGoToProducts}
            >
                Ir a comprar
            </button>
        </div>
    );
};

export default EmptyCart;
