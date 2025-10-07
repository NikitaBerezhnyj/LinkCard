import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../api/userApi";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import "../styles/components/Login.css";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const validateForm = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("* Please enter a valid email");
      return false;
    }
    if (!password || password.length < 6) {
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
        const res = await loginUser({ email, password });
        const token = res.token;
        if (token) {
          localStorage.setItem("jwtToken", token);
          window.location.reload();
        }
      } catch (error: unknown) {
        if (error instanceof Error && "response" in error) {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          setErrorMessage(axiosError.response?.data?.message || "Login failed");
        } else {
          setErrorMessage("Login failed");
        }
      }
    }
  };

  return (
    <div className="sign-in-wrapper">
      <div className="form-container">
        <h2>Login</h2>
        <p className="registration-prompt">
          Don't have an account?{" "}
          <Link className="register-button" to="/registration">
            Registration
          </Link>
        </p>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-describedby="email-error"
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
                aria-describedby="password-error"
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
          <p className="forgot-password-link">
            <Link to={"/forgot-password"}>Forgot password?</Link>
          </p>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <button className="final-action-button" type="submit">
            Sign In
          </button>
        </form>
      </div>
      <div className="image-container"></div>
    </div>
  );
};

export default SignIn;
