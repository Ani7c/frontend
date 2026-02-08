const CartSummary = ({ onCalculate }) => {
    return (
        <div className="card mt-4 bg-light">
            <div className="card-body">
                <div className="row">
                    <div className="col-12 d-flex justify-content-end gap-3">
                        <button
                            className="btn btn-success btn-lg"
                            onClick={onCalculate}
                        >
                            Calcular Mejor Opción
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;
