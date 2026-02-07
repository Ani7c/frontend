import { Link, useNavigate } from 'react-router';

const NavBar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userLabel = localStorage.getItem('userEmail') || localStorage.getItem('userName') || 'Mi cuenta';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg border-bottom" style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#198754' }}>
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold text-white" to="/products">Optify</Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-controls="navMain" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navMain">
                    {token ? (
                        <>
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/products">Productos</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/cart">Carrito</Link>
                                </li>
                                {role === 'ADMIN' && (
                                    <li className="nav-item">
                                        <Link className="nav-link text-white" to="/admin">Admin</Link>
                                    </li>
                                )}
                            </ul>

                            <div className="d-flex align-items-center gap-2">
                                <Link to="/profile" className="text-white small text-decoration-none" style={{ cursor: 'pointer' }}>
                                    👤 {userLabel}
                                </Link>
                                <button className="btn btn-light btn-sm" onClick={handleLogout}>Cerrar sesión</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            </ul>
                            <div className="d-flex align-items-center gap-2">
                                <Link className="btn btn-light btn-sm" to="/login">Iniciar sesión</Link>
                                <Link className="btn btn-light btn-sm text-success fw-bold" to="/signup">Registrarse</Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
