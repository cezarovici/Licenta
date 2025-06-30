import { useState } from "react";
import { loginUser } from "../lib/auth/login";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = await loginUser({ username, password });
      localStorage.setItem("token", data.token);
      setSuccess("Logged in successfully! Redirecting...");

      setTimeout(() => {
        window.location.href = "/business_dashboard";
      }, 1500);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("A apărut o eroare neașteptată.");
      }
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2 className="form-title">Sign in to your account</h2>
      </div>

      <div className="form-box">
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <div>
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div>
            <button type="submit" className="btn-primary w-full">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
