import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const UserProfile = () => {
    const navigate = useNavigate();
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form states
    const [email, setEmail] = useState('');
    const [preferredDay, setPreferredDay] = useState('');
    const [preferredStore, setPreferredStore] = useState('');
    
    // Password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const daysOfWeek = [
        { value: 1, label: 'Domingo' },
        { value: 2, label: 'Lunes' },
        { value: 3, label: 'Martes' },
        { value: 4, label: 'Miércoles' },
        { value: 5, label: 'Jueves' },
        { value: 6, label: 'Viernes' },
        { value: 7, label: 'Sábado' }
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.warning("Debes iniciar sesión.");
            navigate('/login');
            return;
        }

        fetchStores();
        fetchUserProfile();
    }, []);

    const fetchStores = async () => {
        try {
            const headers = {
                'Accept': 'application/json'
            };

            const response = await fetch('http://localhost:8080/stores/getAllStores', { headers });
            if (response.ok) {
                const data = await response.json();
                setStores(data);
            }
        } catch (error) {
            console.error("Error cargando tiendas:", error);
        }
    };

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('token');

        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };

            // Asumiendo que hay un endpoint para obtener el perfil del usuario
            // Si no existe, estos campos quedarán vacíos
            const response = await fetch('http://localhost:8080/api/users/profile', { headers });
            if (response.ok) {
                const data = await response.json();
                setEmail(data.email || '');
                setPreferredDay(data.userPreferredDay || '');
                setPreferredStore(data.userPreferredStore || '');
            }
        } catch (error) {
            console.error("Error cargando perfil:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            const body = {
                email: email || null,
                userPreferredDay: preferredDay ? parseInt(preferredDay) : null,
                userPreferredStore: preferredStore ? parseInt(preferredStore) : null
            };

            const response = await fetch(`${API_BASE_URL}/api/users/updateProfile`, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });

            if (response.ok) {
                toast.success('Perfil actualizado correctamente');
                if (email) {
                    localStorage.setItem('userEmail', email);
                }
            } else {
                const error = await response.text();
                toast.error(`Error: ${error}`);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al actualizar el perfil");
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            const body = {
                currentPassword,
                newPassword
            };

            const response = await fetch(`${API_BASE_URL}/api/users/changePassword`, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });

            if (response.ok) {
                toast.success('Contraseña actualizada correctamente');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                const error = await response.text();
                toast.error(`Error: ${error}`);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al cambiar la contraseña");
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <h2 className="mb-4">Mi Cuenta</h2>

            <div className="row g-4">
                {/* Actualizar Perfil */}
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Información del Perfil</h5>
                            <form onSubmit={handleUpdateProfile}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="tu@email.com"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Día Preferido</label>
                                    <select
                                        className="form-select"
                                        value={preferredDay}
                                        onChange={(e) => setPreferredDay(e.target.value)}
                                    >
                                        <option value="">Seleccionar día</option>
                                        {daysOfWeek.map(day => (
                                            <option key={day.value} value={day.value}>
                                                {day.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Tienda Preferida</label>
                                    <select
                                        className="form-select"
                                        value={preferredStore}
                                        onChange={(e) => setPreferredStore(e.target.value)}
                                    >
                                        <option value="">Seleccionar tienda</option>
                                        {stores.map(store => (
                                            <option key={store.rut} value={store.rut}>
                                                {store.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button type="submit" className="btn btn-success w-100">
                                    Guardar Cambios
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Cambiar Contraseña */}
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Cambiar Contraseña</h5>
                            <form onSubmit={handleChangePassword}>
                                <div className="mb-3">
                                    <label className="form-label">Contraseña Actual</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Nueva Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                    <small className="text-muted">Mínimo 6 caracteres</small>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Confirmar Nueva Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-warning w-100"
                                    disabled={!currentPassword || !newPassword || !confirmPassword}
                                >
                                    Cambiar Contraseña
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
