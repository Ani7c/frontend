import { useRef, useState, useId, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const Signup = () => {
    const [tiendas, setTiendas] = useState([]);

    const idUsuario = useId();
    const idPass = useId();
    const idCedula = useId();
    const idNombre = useId();
    const idApellido = useId();
    const idMail = useId();
    const idTienda = useId();
    const idDia = useId();
    const campoUsuario = useRef();
    const campoPass = useRef();
    const campoCedula = useRef();
    const campoNombre = useRef();
    const campoApellido = useRef();
    const campoMail = useRef();
    const campoTienda = useRef();
    const campoDia = useRef();
    const navigate = useNavigate();
    const [mensajeError, setMensajeError] = useState("");
    const [botonHabilitado, setBotonHabilitado] = useState(false);

    const validarCampos = () => {
        const cedula = campoCedula.current.value.trim();
        const nombre = campoNombre.current.value.trim();
        const apellido = campoApellido.current.value.trim();
        const usuario = campoUsuario.current.value.trim();
        const mail = campoMail.current.value.trim();
        const password = campoPass.current.value.trim();
        const tienda = campoTienda.current.value;
        const dia = campoDia.current.value;
        setBotonHabilitado(cedula !== "" && nombre !== "" && apellido !== "" && usuario !== "" && mail !== "" && password !== "" && tienda !== "" && dia !== "");
    }

    const registrarse = async () => {
        const userCi = parseInt(campoCedula.current.value);
        const userName = campoNombre.current.value;
        const userLastName = campoApellido.current.value;
        const userUsername = campoUsuario.current.value;
        const userMail = campoMail.current.value;
        const userPassword = campoPass.current.value;
        const userPreferredStore = parseInt(campoTienda.current.value);
        const userPreferredDay = parseInt(campoDia.current.value);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({
                userUsername,
                userPassword,
                userCi,
                userName,
                userLastName,
                userMail,
                userPreferredStore,
                userPreferredDay
            }),
            redirect: "follow"
        };

        try {
            const response = await fetch(`${API_BASE_URL}/users/register`, requestOptions);

            // Obtener el texto de la respuesta primero
            const textBody = await response.text();

            if (response.ok) {
                let data;
                try {
                    data = JSON.parse(textBody);
                } catch {
                    data = { token: textBody.trim() };
                }

                const token = data.token || textBody.trim();
                campoCedula.current.value = "";
                campoNombre.current.value = "";
                campoApellido.current.value = "";
                campoUsuario.current.value = "";
                campoMail.current.value = "";
                campoPass.current.value = "";
                campoTienda.current.value = "";
                campoDia.current.value = "";
                localStorage.setItem("token", token);
                if (data.role) {
                    localStorage.setItem("role", data.role);
                }
                if (data.mail) {
                    localStorage.setItem("userEmail", data.mail);
                }
                if (data.name) {
                    localStorage.setItem("userName", data.name);
                }
                toast.success("Registro exitoso");
                setBotonHabilitado(false);
                navigate("/products");
            } else {
                // Si hay error, intentar parsear como JSON o usar texto plano
                let errorMessage = textBody;
                try {
                    const errorJson = JSON.parse(textBody);
                    errorMessage = errorJson.error || errorJson.message || errorJson.mensaje || textBody;
                } catch {
                    // Ya tenemos el texto plano en errorMessage
                }
                setMensajeError(errorMessage);
            }
        } catch (error) {
            const mensajeConexion = "Error de conexión con el servidor";
            setMensajeError(mensajeConexion);
        }
    }

    useEffect(() => {
        const fetchTiendas = async () => {
            try {
                const headers = {
                    'Accept': 'application/json',
                };

                const response = await fetch(`${API_BASE_URL}/stores/getAllStores`, { headers });
                if (response.ok) {
                    const data = await response.json();
                    setTiendas(data);
                } else {
                    console.error('Error cargando tiendas:', response.statusText);
                }
            } catch (error) {
                console.error('Error cargando tiendas:', error);
            }
        };
        fetchTiendas();
    }, []);


    return (
        <div className="d-flex align-items-center justify-content-center p-3" style={{ minHeight: 'calc(100vh - 56px)' }}>
            <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '600px' }}>
                <h2 className="text-center mb-4">Registrarse</h2>
                <form>
                    <div className="mb-3">
                        <label htmlFor={idCedula} className="form-label">Cédula:</label>
                        <input
                            type="text"
                            id={idCedula}
                            className="form-control"
                            ref={campoCedula}
                            onKeyUp={validarCampos}
                            onChange={validarCampos}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor={idNombre} className="form-label">Nombre:</label>
                        <input
                            type="text"
                            id={idNombre}
                            className="form-control"
                            ref={campoNombre}
                            onKeyUp={validarCampos}
                            onChange={validarCampos}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor={idApellido} className="form-label">Apellido:</label>
                        <input
                            type="text"
                            id={idApellido}
                            className="form-control"
                            ref={campoApellido}
                            onKeyUp={validarCampos}
                            onChange={validarCampos}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor={idUsuario} className="form-label">Usuario:</label>
                        <input
                            type="text"
                            id={idUsuario}
                            className="form-control"
                            ref={campoUsuario}
                            onKeyUp={validarCampos}
                            onChange={validarCampos}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor={idMail} className="form-label">Mail:</label>
                        <input
                            type="email"
                            id={idMail}
                            className="form-control"
                            ref={campoMail}
                            onKeyUp={validarCampos}
                            onChange={validarCampos}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor={idPass} className="form-label">Contraseña:</label>
                        <input
                            type="password"
                            id={idPass}
                            className="form-control"
                            ref={campoPass}
                            onKeyUp={validarCampos}
                            onChange={validarCampos}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor={idTienda} className="form-label">Tienda de preferencia:</label>
                        <select
                            id={idTienda}
                            className="form-select"
                            ref={campoTienda}
                            defaultValue=""
                            onChange={validarCampos}
                        >
                            <option value="" disabled>Seleccione una tienda</option>
                            {tiendas.map(tienda => (
                                <option key={tienda.rut} value={tienda.rut}>{tienda.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor={idDia} className="form-label">Día preferido de compra:</label>
                        <select
                            id={idDia}
                            className="form-select"
                            ref={campoDia}
                            defaultValue=""
                            onChange={validarCampos}
                        >
                            <option value="" disabled>Seleccione un día</option>
                            <option value="1">Domingo</option>
                            <option value="2">Lunes</option>
                            <option value="3">Martes</option>
                            <option value="4">Miércoles</option>
                            <option value="5">Jueves</option>
                            <option value="6">Viernes</option>
                            <option value="7">Sábado</option>
                        </select>
                    </div>

                    {mensajeError && (
                        <div className="alert alert-danger" role="alert">
                            {mensajeError}
                        </div>
                    )}

                    <input
                        type="button"
                        value="Registrar"
                        className={`btn btn-success w-100 mb-3 ${!botonHabilitado ? 'opacity-50' : ''}`}
                        onClick={registrarse}
                        disabled={!botonHabilitado}
                    />
                    <div className="text-center">
                        <Link to="/" className="text-decoration-none">¿Ya tienes cuenta? Inicia sesión</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup