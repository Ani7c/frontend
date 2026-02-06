function CartComparison({ comparison, loading, onClose }) {
  if (!comparison && !loading) {
    return null;
  }

  const renderCartCard = (simulation, title, badgeColor, isBest = false) => {
    return (
      <div className="col-md-4 mb-4">
        <div className={`card h-100 ${isBest ? 'border-success border-3' : ''}`}>
          <div className={`card-header bg-${badgeColor} text-white text-center`}>
            <h5 className="mb-0">{title}</h5>
            {isBest && <small>✨ Mejor opción ✨</small>}
          </div>
          <div className="card-body">
            <h6 className="card-title text-center mb-3">
              <strong>{simulation.name}</strong>
            </h6>
            
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-2">
                <span>Precio Total:</span>
                <strong className="text-success">${simulation.totalCartValue?.toLocaleString('es-CL')}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Transaccional:</span>
                <strong>${simulation.totalTransactionalCartValue?.toLocaleString('es-CL')}</strong>
              </div>
            </div>

            <hr />

            <h6 className="mb-2">Productos ({simulation.products?.length || 0}):</h6>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {simulation.products?.map((product, index) => (
                <div key={index} className="mb-2 p-2 bg-light rounded">
                  <div className="d-flex justify-content-between align-items-start">
                    <div style={{ flex: 1 }}>
                      <small className="d-block"><strong>{product.productName}</strong></small>
                      <small className="text-muted">{product.productBrand}</small>
                    </div>
                    <div className="text-end ms-2">
                      <small className="d-block text-success">
                        ${product.productPrice?.toLocaleString('es-CL')}
                      </small>
                      {product.quant && (
                        <small className="text-muted">x{product.quant}</small>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="modal-body">
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="alert alert-info mb-4">
            <strong>💡 Tip:</strong> Compara las opciones y elige la que mejor se adapte a tus necesidades.
          </div>

          <div className="row">
            {comparison.optimum && renderCartCard(
              comparison.optimum,
              'Compra Óptima',
              'success',
              true
            )}
            
            {comparison.preferedStore && renderCartCard(
              comparison.preferedStore,
              'Tu Tienda Preferida',
              'primary'
            )}
            
            {comparison.cheapestStore && renderCartCard(
              comparison.cheapestStore,
              'Tienda Más Barata',
              'warning'
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default CartComparison;
