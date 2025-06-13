import React, { useState, useEffect } from "react"; 
import { auth, signInWithEmailAndPassword } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa"; 
import styles from "./Login.module.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // If the user is already logged in, redirect to the dashboard
        navigate("/dashboard");
      }
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error.message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Falling routine images */}
      <div className={styles.fallingItem}><img src="/images/reading.png" alt="Reading" /></div>
      <div className={styles.fallingItem}><img src="/images/wakeup.png" alt="Wake up" /></div>
      <div className={styles.fallingItem}><img src="/images/meditate.png" alt="Meditation" /></div>
      <div className={styles.fallingItem}><img src="/images/sleeping.png" alt="Sleeping" /></div>
      <div className={styles.fallingItem}><img src="/images/water.png" alt="Drinking Water" /></div>
      <div className={styles.fallingItem}><img src="/images/eating.png" alt="Eating Healthy" /></div>
      <div className={styles.fallingItem}><img src="/images/running.png" alt="Running" /></div>

      <div className={styles.loginBox}>
        <h2 className={styles.title}>Game Login</h2>
        <form onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <FaUser className={styles.icon} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <FaLock className={styles.icon} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.loginButton}>Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/signup" className={styles.signupLink}>Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
