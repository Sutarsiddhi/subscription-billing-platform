import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";

import { loginUser } from "../api/auth";
import { AuthContext } from "../context/AuthContext";

function Login() {

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        if (!email || !password) {
            alert("Please enter email and password.");
            return;
        }

        try {

            setLoading(true);

            const response = await loginUser({
                email,
                password
            });

            console.log("Login Response :", response.data);

            const token = response.data.access_token;

            const user = response.data.user;

            login(user, token);

            alert("Login Successful");

            if (user.role === "admin") {

                navigate("/admin/dashboard");

            } else {

                navigate("/customer/dashboard");

            }

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.detail ||
                "Login Failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <AuthLayout>

            <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">

                <h1 className="text-4xl font-bold text-center">
                    Welcome Back
                </h1>

                <p className="text-gray-500 text-center mt-2 mb-8">
                    Login to Billing Platform
                </p>

                <form onSubmit={handleLogin}>

                    <InputField
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={FaEnvelope}
                    />

                    <InputField
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={FaLock}
                    />

                    <PrimaryButton
                        title={
                            loading
                                ? "Logging In..."
                                : "Login"
                        }
                        type="submit"
                        disabled={loading}
                    />

                </form>

                <div className="mt-6 text-center">

                    <p className="text-gray-600">

                        New to Billing Platform?

                        <Link
                            to="/register"
                            className="text-violet-600 font-semibold ml-2 hover:underline"
                        >
                            Create an account
                        </Link>

                    </p>

                </div>

            </div>

        </AuthLayout>

    );

}

export default Login;