import axios from "axios";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useRef, useState } from "react";
import GoogleLogin from "react-google-login";

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

    const onFailure = (e) => {
        console.log(e);
    };
    const onSuccess = (e) => {
        console.log("onSuccess");
        console.log(e);
    };


    return (
        <div className="auth">
            <h1>Login</h1>
            <form>
                <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    buttonText="Login"
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}
                    scope={'profile email'}
                    isSignedIn={true}
                />
                <p><h3>or</h3></p>
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
