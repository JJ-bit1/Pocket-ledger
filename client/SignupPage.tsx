import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/login";
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate(from);
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "2rem", border: "1px solid #e0e0e0", borderRadius: "8px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Sign Up</h2>
      {error && <p style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>{error}</p>}
      <form onSubmit={handleSignup}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="name" style={{ display: "block", marginBottom: "0.5rem" }}>Name</label>
          <input 
            id="name" 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }} 
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem" }}>Email</label>
          <input 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }} 
          />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="password" style={{ display: "block", marginBottom: "0.5rem" }}>Password</label>
          <input 
            id="password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: "100%", padding: "0.5rem" }} 
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: "0.75rem", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Sign Up
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
        Already have an account? <a href="/login" style={{ color: "#007bff" }}>Login</a>
      </p>
    </div>
  );
}

export default SignupPage;