import React, { useState, useContext } from "react";
import AuthLayout from "./AuthLayout";
import InputField from "./InputField";
import Button from "./Button";
import { Mail, Lock } from "lucide-react";
import { login as loginService } from "../../services/authService";
import AuthContext from "../../services/context/authContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginProvider } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token, message } = await loginService(email, password);
      loginProvider({ email }, token);
      alert(message);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthLayout title="Welcome back">
      {error && <p className="text-red-500">{error}</p>}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <InputField
            icon={Mail}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <InputField
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit">Sign in</Button>
        <div className="text-right">
          <Link
            to="/auth/forgot-password"
            className="text-blue-500 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
