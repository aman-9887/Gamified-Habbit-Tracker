import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.brandSection}>
        <span className={styles.brandIcon}>🎮</span>
        <span className={styles.brandText}>Gamified Habit Tracker</span>
      </div>
      <div className={styles.navLinks}>
        <Link to="/" className={styles.link}>Home</Link>
        <Link to="/about" className={styles.link}>About</Link>
        {!user ? (
          <Link to="/login" className={styles.link}>Login</Link>
        ) : (
          <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
