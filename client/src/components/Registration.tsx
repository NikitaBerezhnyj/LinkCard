import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../api/userApi";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import "../styles/components/Registration.css";

const Registration: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const validateForm = () => {
    if (!username.trim()) {
      setErrorMessage("* Username is required");
      return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("* Please enter a valid email");
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage("* Passwords do not match");
      return false;
    }
    if (password.length < 6) {
      setErrorMessage("* Password must be at least 6 characters");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const res = await registerUser({ username, email, password });
        const token = res.token;
        if (token) {
          localStorage.setItem("jwtToken", token);
          window.location.reload();
        }
        window.location.reload();
      } catch (error: unknown) {
        if (error instanceof Error && "response" in error) {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          setErrorMessage(axiosError.response?.data?.message || "Registration failed");
        } else {
          setErrorMessage("Registration failed");
        }
      }
    }
  };

  return (
    <div className="register-wrapper">
      <div className="form-container">
        <h2>Registration</h2>
        <p className="registration-prompt">
          Do you have an account?{" "}
          <Link className="register-button" to="/login">
            Login
          </Link>
        </p>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoMdEyeOff size={24} /> : <IoMdEye size={24} />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirm-password">Confirm Password</label>
            <div className="password-input-container">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <IoMdEyeOff size={24} /> : <IoMdEye size={24} />}
              </button>
            </div>
          </div>

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <button className="final-action-button" type="submit">
            Sign Up
          </button>
        </form>
      </div>
      <div className="image-container"></div>
    </div>
  );
};

export default Registration;
