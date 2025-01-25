import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import InputField from "./InputField";
import Button from "./Button";
import { Lock } from "lucide-react";
import { resetPassword } from "../../services/authService";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { message } = await resetPassword(token, password);
      setSuccessMessage(message);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <AuthLayout title="Reset your password">
      {error && <p className="text-red-500">{error}</p>}
      {successMessage ? (
        <p className="text-green-500">{successMessage}</p>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <InputField
            icon={Lock}
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Reset password</Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
