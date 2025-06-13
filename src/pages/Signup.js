import React, { useState, useEffect } from "react";
import { auth, db, createUserWithEmailAndPassword } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import styles from "./Signup.module.css"; // Import CSS

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (showMessage) {
      timer = setTimeout(() => {
        setShowMessage(false);
        navigate("/login"); // Redirect to login
      }, 3000);
    }
    return () => clearTimeout(timer); // Cleanup timeout
  }, [showMessage, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
      });

      setIsSignedUp(true);
      setShowMessage(true);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className={styles.signupContainer}>
      {/* Falling routine items */}
      <div className={styles.fallingItem}><img src="/images/reading.png" alt="Reading" /></div>
      <div className={styles.fallingItem}><img src="/images/wakeup.png" alt="Wake up" /></div>
      <div className={styles.fallingItem}><img src="/images/meditate.png" alt="Meditation" /></div>
      <div className={styles.fallingItem}><img src="/images/sleeping.png" alt="Sleeping" /></div>
      <div className={styles.fallingItem}><img src="/images/water.png" alt="Drinking Water" /></div>
      <div className={styles.fallingItem}><img src="/images/eating.png" alt="Eating Healthy" /></div>
      <div className={styles.fallingItem}><img src="/images/running.png" alt="Running" /></div>

      <div className={styles.signupBox}>
        <h2 className={styles.title}>Create Account</h2>
        {!isSignedUp ? (
          <form onSubmit={handleSignup}>
            <div className={styles.inputGroup}>
              <FaUser className={styles.icon} />
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <FaEnvelope className={styles.icon} />
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
                placeholder="Password (6+ chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}

            <button type="submit" className={styles.signupButton}>Sign Up</button>
          </form>
        ) : (
          showMessage && (
            <div className={styles.successMessage}>
              <p>🎉 Signup successful! Redirecting to login...</p>
            </div>
          )
        )}

        {!isSignedUp && (
          <button className={styles.backToLogin} onClick={() => navigate("/login")}>
            Back to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Signup;
