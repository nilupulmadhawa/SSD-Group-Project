import axios from "axios";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useRef, useState } from "react";

const Login = () => {
    const ReCAPTCHARef = useRef();
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
    });
    const [err, setError] = useState(null);

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);


    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (ReCAPTCHARef.current.getValue() === "") {
                alert('Please verify that you are not a robot')
                return
            }
            await login(inputs)
            navigate("/");
        } catch (err) {
            setError(err.response.data);
        }
    };


    useEffect(() => {
        ReCAPTCHARef.current.reset();
    }, []);


    return (
        <div className="auth">
            <h1>Login</h1>
            <form>
                <input
                    required
                    type="text"
                    placeholder="username"
                    name="username"
                    onChange={handleChange}
                />
                <input
                    required
                    type="password"
                    placeholder="password"
                    name="password"
                    onChange={handleChange}
                />
                <ReCAPTCHA
                    ref={ReCAPTCHARef}
                    sitekey={process.env.REACT_APP_reCAPTCHA_SITE_KEY}
                />
                <button onClick={handleSubmit}>Login</button>
                {err && <p>{err}</p>}
                <span>
                    Don't you have an account? <Link to="/register">Register</Link>
                </span>
            </form>
        </div>
    );
};

export default Login;
