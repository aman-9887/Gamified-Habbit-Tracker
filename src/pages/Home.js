import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  const fullText = "WELCOME TO GAMIFIED HABIT TRACKER.";
  const [typedText, setTypedText] = useState("");
  const [started, setStarted] = useState(false);
  const indexRef = useRef(0);
  const typingAudioRef = useRef(null);

  const startTyping = () => {
    if (started) return;
    setStarted(true);
  
    const typingInterval = setInterval(() => {
      if (indexRef.current >= fullText.length) {
        clearInterval(typingInterval);
  
        // ✅ Fully stop and reset the audio
        if (typingAudioRef.current) {
          typingAudioRef.current.pause();
          typingAudioRef.current.currentTime = 0;
        }
  
        return;
      }
  
      const nextChar = fullText[indexRef.current];
      setTypedText((prev) => prev + nextChar);
  
      if (typingAudioRef.current && indexRef.current < fullText.length - 1) {
        typingAudioRef.current.currentTime = 0;
        typingAudioRef.current.play();
      }
  
      indexRef.current += 1;
    }, 100);
  };
  
  return (
    <div className={styles.homeContainer} onClick={startTyping}>
      <h0 className={styles.typingHeading}>
        {typedText || ""}
      </h0>

      <div className={styles.hero}>
        {/* Quote removed */}
      </div>

      <Link to="/login" className={styles.btnLarge}>Get Started</Link>

      {/* 🔊 Typing sound effect */}
      <audio ref={typingAudioRef} src="/typing s.mp3" preload="auto" />
    </div>
  );
};

export default Home;
