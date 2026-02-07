import { useEffect, useId, useRef, useState } from "react";
import { Link, useNavigate } from "react-router"
import { toast } from "react-toastify";


const Login = () => {

  const idUser = useId();
  const idPass = useId();
  const campoUsuario = useRef();
  const campoPass = useRef();
  const navigate = useNavigate();
  const [mensajeError, setMensajeError] = useState("");
  const [botonHabilitado, setBotonHabilitado] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/products"); 
    }
  }, [])

  const validarCampos = () => {
    const usuario = campoUsuario.current.value.trim();
    const password = campoPass.current.value.trim();
    setBotonHabilitado(usuario !== "" && password !== "");
  }

  const ingresar = async e => {
    const userUsername = campoUsuario.current.value;
    const userPassword = campoPass.current.value;

    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userUsername,
        userPassword
      }),
      redirect: "follow"
    };

    fetch("http://localhost:8080/users/login", requestOptions)
      .then(async response => {
        const textBody = await response.text();
        if (!response.ok) {
          throw new Error(textBody);
        }

        let data;
        try {
          data = JSON.parse(textBody);
        } catch {
          data = { token: textBody };
        }

        return data;
      })
      .then(data => {
        setMensajeError("");
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.role) {
          localStorage.setItem("role", data.role);
        }
        if (data.mail) {
          localStorage.setItem("userEmail", data.mail);
        }
        if (data.name) {
          localStorage.setItem("userName", data.name);
        }
        navigate("/products"); 
      })
      .catch(error => {
        setMensajeError(error.message || "Error de login");
      });

  }
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: 'calc(100vh - 56px)' }}>
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Iniciar sesión</h2>
        <form>
          <div className="mb-3">
            <label htmlFor={idUser} className="form-label">Usuario:</label>
            <input
              type="text"
              id={idUser}
              className="form-control"
              ref={campoUsuario}
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

          {mensajeError && (
            <div className="alert alert-danger" role="alert">
              {mensajeError}
            </div>
          )}

          <input
            type="button"
            value="Ingresar"
            className={`btn btn-success w-100 mb-3 ${!botonHabilitado ? 'opacity-50' : ''}`}
            onClick={ingresar}
            disabled={!botonHabilitado}
          />
          <div className="text-center">
            <Link to="/signup" className="text-decoration-none">¿No tienes cuenta? Regístrate</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login