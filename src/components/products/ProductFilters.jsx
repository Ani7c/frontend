const ProductFilters = ({ 
    searchTerm, 
    setSearchTerm, 
    selectedCategory, 
    setSelectedCategory, 
    categories, 
    onSearch,
    setCurrentPage 
}) => {
    const handleSearch = () => {
        setCurrentPage(0);
        onSearch(0);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(0);
    };

    return (
        <div className="d-flex align-items-center gap-2 mb-3">
            <input
                type="text"
                placeholder="¿Qué buscas?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />

            <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="form-select"
            >
                <option value="">Todas las Categorías</option>
                {categories && categories.map((cat) => (
                    <option key={`cat-${cat.categoryId}`} value={cat.categoryId}>
                        {cat.categoryName}
                    </option>
                ))}
            </select>

            <button onClick={handleSearch} className="btn btn-success">
                🔍 
            </button>
        </div>
    );
};

export default ProductFilters;
