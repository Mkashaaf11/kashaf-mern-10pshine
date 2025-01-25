import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import InputField from "./InputField";
import Button from "./Button";
import { Mail } from "lucide-react";
import { forgotPassword } from "../../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { message } = await forgotPassword(email);
      setSuccessMessage(message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email");
    }
  };

  return (
    <AuthLayout title="Forgot Password">
      {error && <p className="text-red-500">{error}</p>}
      {successMessage ? (
        <p className="text-green-500">{successMessage}</p>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <InputField
            icon={Mail}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit">Send Reset Link</Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
