function CartComparison({ comparison, loading, onClose }) {
  if (!comparison && !loading) {
    return null;
  }

  const renderCartCard = (simulation, title, isBest = false) => {
    return (
      <div className="col-md-4 mb-4">
        <div className={`card h-100 ${isBest ? 'border-success border-3' : ''}`}>
          <div className={`card-header text-center ${isBest ? 'bg-success text-white' : 'bg-white'}`}>
            <h5 className={`mb-0 ${isBest ? '' : 'text-success'}`}>{title}</h5>
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
              {simulation.products?.map((item, index) => (
                <div key={index} className="mb-3 p-2 bg-light rounded">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div style={{ flex: 1 }}>
                      <small className="d-block"><strong>{item.product?.name}</strong></small>
                    </div>
                    <small className="d-block text-success ms-2">
                      ${item.price?.toLocaleString('es-CL')}
                    </small>
                  </div>
                  {isBest && item.stores && item.stores.length > 0 && (
                    <div className="ms-2">
                      <small className="text-muted d-block mb-1">📍 Disponible en:</small>
                      {item.stores.map((store, storeIdx) => (
                        <small key={storeIdx} className="d-block text-muted ps-2">
                          • {store.fantasyName}
                        </small>
                      ))}
                    </div>
                  )}
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

          <div className="row">
            {comparison.optimum && renderCartCard(
              comparison.optimum,
              'Compra Óptima',
              true
            )}
            
            {comparison.preferedStore && renderCartCard(
              comparison.preferedStore,
              'Tu Tienda Preferida'
            )}
            
            {comparison.cheapestStore && renderCartCard(
              comparison.cheapestStore,
              'Tienda Más Barata'
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default CartComparison;
