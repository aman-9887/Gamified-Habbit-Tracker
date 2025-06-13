import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StonePaperScissor from "../components/StonePaperScissor";
import FocusFlipGame from "../components/FocusFlipGame";
import TikTakGame from "../components/TikTakGame";
import MindMazeGame from "../components/MindMazeGame";
import HabitCrush from "../components/HabitCrush";
import { motion } from "framer-motion";

const VisualJourney = () => {
  const [activeGame, setActiveGame] = useState("");
  const [showSplash, setShowSplash] = useState(true);
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const preloadImage = new Image();
    preloadImage.src = "/gamepbg.jpg";
    preloadImage.onload = () => setIsBackgroundLoaded(true);
  }, []);

  useEffect(() => {
    const splashTimer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes shine {
        to {
          background-position: 200% center;
        }
      }
      @keyframes floatCard {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const games = [
    { name: "Rock Paper Scissor", description: "Pick wisely - Play fiercely.", image: "/images/stonegame.jpg" },
    { name: "Focus Flip", description: "Flip and match good habits!", image: "/images/card flip.png" },
    { name: "Tick Tak Toe", description: "Pair three and win", image: "/images/ticktak1.png" },
    { name: "Mind Maze", description: "Solve puzzles to train your focus!", image: "/images/mindmaze3.png" },
    { name: "Habit Crush", description: "Crush your unhealthy habits!", image: "/images/HABIT.png" },
  ];

  const handleStartGame = (gameName) => {
    setShowSplash(false);
    setActiveGame(gameName);
  };

  const handleBackToDashboard = () => navigate("/dashboard");

  if (showSplash && !activeGame) {
    return (
      <motion.div
        initial={{ scaleY: 0.01, scaleX: 0, opacity: 0 }}
        animate={{ scaleY: [0.01, 1], scaleX: [0, 1], opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={styles.fullSplash}
      >
        <motion.img
          src="/GAME_ZONE.png"
          alt="Splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={styles.fullSplashImage}
        />
      </motion.div>
    );
  }

  const wrapperStyle = isBackgroundLoaded
    ? { ...styles.wrapper, background: "url('/gamepbg.jpg') center/cover no-repeat" }
    : { ...styles.wrapper, background: "#0c0c0c" };

  return (
    <motion.div
      style={wrapperStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      <div style={styles.container}>
        {!activeGame && (
          <>
            {/* Heading just above transparent box */}
            <h1 style={styles.pageHeading}>🎮 Choose Your Game</h1>
            <div style={styles.transparentBox}>
              <motion.div
                style={styles.gameList}
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
              >
                {games.map((game, index) => (
                  <motion.div
                    key={index}
                    style={styles.card}
                    whileHover={{
                      scale: 1.08,
                      rotate: 5,
                      boxShadow: "0 0 15px rgba(255, 255, 255, 0.85)",
                      backgroundImage:
                        "linear-gradient(110deg, #ffffff33 0%, #ffffff99 40%, #ffffff33 80%)",
                      backgroundSize: "200% auto",
                      animation: "shine 1.5s infinite linear",
                    }}
                    whileTap={{
                      scale: 0.95,
                      boxShadow: "0 0 8px rgba(255, 255, 255, 0.7)",
                    }}
                    onClick={() => handleStartGame(game.name)}
                    variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.6 }}
                  >
                    <img src={game.image} alt={game.name} style={styles.cardImage} />
                    <h3 style={styles.cardTitle}>{game.name}</h3>
                    <p style={styles.cardDesc}>{game.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <button onClick={handleBackToDashboard} style={styles.backToDashboardBtn}>
              ⬅ Back to Dashboard
            </button>
          </>
        )}

        {activeGame && (
          <motion.div
            style={styles.gameArea}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {activeGame === "Rock Paper Scissor" && <StonePaperScissor />}
            {activeGame === "Focus Flip" && <FocusFlipGame />}
            {activeGame === "Mind Maze" && <MindMazeGame />}
            {activeGame === "Habit Crush" && <HabitCrush />}
            {activeGame === "Tick Tak Toe" && <TikTakGame />}
            <button
              onClick={() => setActiveGame("")}
              style={styles.backToGameSelectionBtnBottom}
            >
              🔙 Back to Game Selection
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const styles = {
  fullSplash: {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#0c0c0c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  fullSplashImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  wrapper: {
    width: "100vw",
    height: "100vh",
    background: "#0c0c0c",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    position: "relative",
    zIndex: 2,
    width: "90%",
    maxWidth: "1400px",
    padding: "50px 30px",
    borderRadius: "20px",
    textAlign: "center",
    color: "white",
    boxShadow: "0 0 30px rgba(0, 0, 0, 0.5)",
  },
  pageHeading: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: "20px",
    textShadow: "0 0 10px rgba(255,255,255,0.7)",
  },
  transparentBox: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0 0 30px rgba(0, 0, 0, 0.7)",
    marginBottom: "30px",
  },
  gameList: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#0d1b2a",
    padding: "25px 20px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
    cursor: "pointer",
    width: "230px",
    color: "#fff",
    border: "2px solid #ffffff",
    textAlign: "center",
    animation: "floatCard 3s ease-in-out infinite",
  },
  cardImage: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "15px",
  },
  cardTitle: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "10px",
    color: "#ffffff",
    textShadow: "0 0 8px rgba(255, 255, 255, 0.8)",
  },
  cardDesc: {
    fontSize: "16px",
    color: "#f0f0f0",
    textShadow: "0 0 6px rgba(255, 255, 255, 0.5)",
  },
  gameArea: {
    marginTop: "20px",
    position: "relative",
    minHeight: "80vh",
    paddingBottom: "60px",
  },
  backToDashboardBtn: {
    position: "absolute",
    bottom: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(255, 255, 255, 0.5)",
    transition: "background-color 0.3s ease",
  },
  backToGameSelectionBtnBottom: {
    position: "absolute",
    bottom: "80px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(255, 255, 255, 0.5)",
    transition: "background-color 0.3s ease",
  },
};

export default VisualJourney;
