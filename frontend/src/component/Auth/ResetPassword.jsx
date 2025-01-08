import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import InputField from "./InputField";
import Button from "./Button";
import { Lock } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");

  return (
    <AuthLayout title="Reset your password">
      <form className="space-y-6">
        <InputField
          icon={Lock}
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Reset password</Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
