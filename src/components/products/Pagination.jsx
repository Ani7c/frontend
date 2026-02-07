const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
            <button 
                disabled={currentPage === 0} 
                onClick={() => onPageChange(currentPage - 1)} 
                className="btn btn-outline-secondary"
            >
                ⬅ Anterior
            </button>
            <span className="text-muted">
                Página <strong>{currentPage + 1}</strong> de <strong>{totalPages}</strong>
            </span>
            <button 
                disabled={currentPage >= totalPages - 1} 
                onClick={() => onPageChange(currentPage + 1)} 
                className="btn btn-outline-secondary"
            >
                Siguiente ➡
            </button>
        </div>
    );
};

export default Pagination;
