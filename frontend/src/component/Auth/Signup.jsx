import React, { useState, useContext } from "react";
import AuthLayout from "./AuthLayout";
import InputField from "./InputField";
import Button from "./Button";
import { Mail, Lock, User } from "lucide-react";
import { signup as signupService } from "../../services/authService";
import AuthContext from "../../services/context/authContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token, message } = await signupService(name, email, password);
      login({ email, name }, token);
      alert(message);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <AuthLayout title="Create your account">
      {error && <p className="text-red-500">{error}</p>}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <InputField
          icon={User}
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <InputField
          icon={Mail}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          icon={Lock}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Create account</Button>
      </form>
    </AuthLayout>
  );
};

export default Signup;
