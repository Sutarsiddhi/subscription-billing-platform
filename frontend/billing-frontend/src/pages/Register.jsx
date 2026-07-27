import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserShield,
} from "react-icons/fa";

import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";

import { registerUser } from "../api/auth";

function Register() {

  // ============================
  // Navigation
  // ============================

  const navigate = useNavigate();

  // ============================
  // Form States
  // ============================

  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");

  const [role, setRole] = useState("customer");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // ============================
  // Register Function
  // ============================

  const handleRegister = async (e) => {

    e.preventDefault();

    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const userData = {
      full_name: fullName,
      email: email,
      password: password,
      role: role,
    };

    try {

      setLoading(true);

      const response = await registerUser(userData);

      alert(
        response.data.message ||
        "Registration Successful!"
      );

      navigate("/");

    } catch (error) {

    console.log("Full Error:", error);

    console.log("Response:", error.response);

    console.log("Data:", error.response?.data);

    console.log("Status:", error.response?.status);

    alert(JSON.stringify(error.response?.data));



    } finally {

      setLoading(false);

    }

  };

  return (

    <AuthLayout>

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-gray-800">
          Create Account
        </h1>

        <p className="text-gray-500 text-center mt-2 mb-8">
          Register to access Billing Platform
        </p>

        <form onSubmit={handleRegister}>

          <InputField
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
            icon={FaUser}
          />

          <InputField
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            icon={FaEnvelope}
          />

          {/* Role */}

          <div className="relative mb-5">

            <FaUserShield
              className="absolute left-4 top-4 text-gray-400"
            />

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              className="
                w-full
                border
                rounded-xl
                py-3
                pl-12
                pr-4
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            >

              <option value="customer">
                Customer
              </option>

              <option value="admin">
                Admin
              </option>

            </select>

          </div>

          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            icon={FaLock}
          />

          <InputField
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            icon={FaLock}
          />

          <PrimaryButton
            type="submit"
            title={
              loading
                ? "Creating Account..."
                : "Create Account"
            }
            disabled={loading}
          />

        </form>

        <div className="mt-6 text-center">

          <p className="text-gray-600">

            Already have an account?

            <Link
              to="/"
              className="text-violet-600 font-semibold ml-2 hover:underline"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </AuthLayout>

  );

}

export default Register;