import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase.js";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1. Login using Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 2. Get user data from Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError("User information not found");
        return;
      }

      // 3. Get name and role
      const userData = userSnap.data();

      // 4. Store login information
      localStorage.setItem("isLoggedIn", "true");

      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          name: userData.name,
          email: userData.email,
          role: userData.role,
        })
      );

      // 5. Go to home page
      navigate("/");
    } catch (error) {
      console.log(error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setError("Invalid Gmail or password");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid Gmail");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later");
      } else {
        setError("Login failed. Please try again");
      }
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          🛡️
        </div>

        <h1>Campus Emergency System</h1>

        <p className="login-subtitle">
          Sign in to continue
        </p>

        <form onSubmit={handleLogin}>

          <div className="login-field">

            <label>Gmail</label>

            <input
              type="email"
              placeholder="Enter your Gmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>

          <div className="login-field">

            <label>Password</label>

            <div className="password-wrapper">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="show-password"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </button>

            </div>

          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;