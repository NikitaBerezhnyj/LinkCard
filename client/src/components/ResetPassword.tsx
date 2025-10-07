import React, { useState } from "react";
import { resetPassword } from "../api/userApi";
import { useParams, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CgDanger } from "react-icons/cg";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import "../styles/components/ResetPassword.css";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function ResetPassword() {
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState<boolean>(false);
  const { token } = useParams<Record<string, string | undefined>>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Invalid reset token.");
      return;
    }

    try {
      await resetPassword(token, password);
      setMessage("Password reset successful.");
      setError("");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: unknown) {
      setMessage("");
      if (typeof err === "object" && err !== null && "response" in err) {
        const errorMessage =
          (err as ApiError).response?.data?.message || "Failed to reset password.";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-wrap">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="password">New Password</label>
          <div className="password-input-container">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          <label htmlFor="password-repeat">Repeat new Password</label>
          <div className="password-input-container">
            <input
              id="password-repeat"
              type={showRepeatPassword ? "text" : "password"}
              placeholder="Repeat new password"
              value={repeatPassword}
              onChange={e => setRepeatPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
            >
              {showRepeatPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          {error && (
            <div className="server-error-message">
              <CgDanger />
              {error}
            </div>
          )}
          {message && (
            <div className="server-success-message">
              <IoIosCheckmarkCircleOutline />
              {message}
            </div>
          )}
          <button type="submit" className="reset-password-submit">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
