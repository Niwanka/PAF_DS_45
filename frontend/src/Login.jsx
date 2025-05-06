import React from "react";
import "./Login.css";

const GOOGLE_AUTH_URL = "http://localhost:9090/oauth2/authorization/google";

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Skill Share</h1>
        </div>

        <a href={GOOGLE_AUTH_URL} className="btn btn-light">
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="google-icon" 
          />
          Sign in with Google
        </a>

        <div className="divider">
          <span className="divider-text">or continue with</span>
        </div>

        <div className="footer-text">
          Don't have an account? <a href="#">Register</a>
        </div>
      </div>
    </div>
  );
}