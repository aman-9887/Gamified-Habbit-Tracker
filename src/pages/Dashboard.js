import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaBell } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import confetti from "canvas-confetti";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const styles = {
  container: {
    minHeight: "100vh",
    width: "100vw",
    background:
      "linear-gradient(to bottom right, #000000,rgb(53, 107, 157),rgb(26, 68, 112),rgb(20, 59, 91),rgb(37, 41, 42),rgb(45, 95, 100))",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "30px 20px",
    fontFamily: "'Orbitron', sans-serif",
    color: "#00f7ff",
    overflowX: "hidden",
  },
  subheading: {
    backgroundColor: "black",
    color: "white",
    padding: "10px 20px",
    borderRadius: "10px",
    fontSize: "30px",
    marginTop: "3vh",
    marginBottom: "20px",
    textAlign: "center",
    boxShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
    zIndex: 1,
  },
  welcomeBox: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "linear-gradient(145deg, rgba(0,0,0,0.95), rgba(20,20,20,0.95))",
    padding: "40px 50px",
    borderRadius: "20px",
    boxShadow:
      "0 0 25px 8px rgba(0, 255, 255, 0.4), inset 0 0 10px rgba(255,255,255,0.1)",
    textAlign: "center",
    zIndex: 1000,
    color: "#00f7ff",
    fontSize: "24px",
    fontWeight: "bold",
    letterSpacing: "1px",
    fontFamily: "'Orbitron', sans-serif",
    animation: "fadeIn 1.5s ease-out",
    backdropFilter: "blur(6px)",
  },
  content: {
    display: "flex",
    width: "90%",
    justifyContent: "space-between",
    gap: "40px",
  },
  leftSection: {
    width: "55%",
    background: "rgba(0, 0, 0, 0.5)",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 20px 5px rgba(255, 255, 255, 0.8)",
  },
  rightSection: {
    width: "45%",
    background: "rgba(0, 0, 0, 0.5)",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 20px 5px rgba(255, 255, 255, 0.8)",
  },
  table: {
    width: "100%",
    color: "white",
  },
  completeButton: {
    backgroundColor: "white",
    color: "#003366",
    padding: "8px 15px",
    borderRadius: "5px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#ff0066",
    color: "#fff",
    padding: "8px 15px",
    marginLeft: "10px",
    borderRadius: "5px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
  motivation: {
    fontSize: "18px",
    marginBottom: "15px",
    animation: "pulse 2s infinite",
    color: "white",
  },
  inputBox: {
    display: "flex",
    marginBottom: "15px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid rgb(215, 218, 218)",
    backgroundColor: "black",
    color: "white",
  },
  addButton: {
    padding: "10px 20px",
    marginLeft: "10px",
    backgroundColor: "#fff",
    color: "#000",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  progressContainer: {
    marginBottom: "20px",
  },
  progressBar: {
    height: "20px",
    backgroundColor: "#333",
    borderRadius: "10px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#ffffff",
    transition: "width 0.6s ease-in-out",
  },
  rewards: {
    marginBottom: "20px",
  },
  chartContainer: {
    marginTop: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
  },
  journeyButton: {
    marginTop: "30px",
    padding: "15px 30px",
    fontSize: "18px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  },
  journeyButtonActive: {
    marginTop: "30px",
    padding: "15px 30px",
    fontSize: "18px",
    backgroundColor: "#00ff00",
    color: "black",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    boxShadow: "0 0 15px rgba(0, 255, 0, 0.5)",
  },
  journeyButtonDisabled: {
    marginTop: "30px",
    padding: "15px 30px",
    fontSize: "18px",
    backgroundColor: "#666666",
    color: "#cccccc",
    border: "none",
    borderRadius: "10px",
    cursor: "not-allowed",
    fontWeight: "bold",
    opacity: 0.6,
    transition: "all 0.3s ease",
  },
  gameTimeMessage: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#ffcc00",
    textAlign: "center",
    fontStyle: "italic",
  },
  gameSessionInfo: {
    marginTop: "10px",
    fontSize: "16px",
    color: "#00ff00",
    textAlign: "center",
    fontWeight: "bold",
    padding: "10px",
    backgroundColor: "rgba(0, 255, 0, 0.1)",
    borderRadius: "10px",
    border: "1px solid rgba(0, 255, 0, 0.3)",
  },
  earnedTimeInfo: {
    marginTop: "5px",
    fontSize: "14px",
    color: "#ffcc00",
    textAlign: "center",
  },
  whiteText: {
    color: "#ffffff",
    marginBottom: "10px",
  },
  startSessionButton: {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "14px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const successAudioRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [progress, setProgress] = useState({ totalDays: 0, completedDays: 0, percentage: 0 });
  const [rewardPoints, setRewardPoints] = useState(0);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [userName, setUserName] = useState("");
  const [dataFetched, setDataFetched] = useState(false);
  
  // Game session states
  const [earnedGameTime, setEarnedGameTime] = useState(0); // in minutes
  const [isGameSessionActive, setIsGameSessionActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0); // in seconds
  const [gameSessionStartTime, setGameSessionStartTime] = useState(null);

  // Helper function to convert time strings to minutes
  const parseTimeToMinutes = (timeString) => {
    if (timeString === "00:00") return 0;
    if (timeString === "20m") return 20;
    if (timeString === "15m") return 15;
    if (timeString === "5m") return 5;
    if (timeString === "1m") return 1;
    return 0;
  };

  // Helper function to format time display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Save user data including game session info
  const saveUserDataToFirestore = async (habitsData, rewardPointsData, progressData, gameSessionData = null) => {
    if (!dataFetched) return;
    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const dataToSave = {
          fullName: userName,
          email: user.email,
          habits: habitsData,
          rewardPoints: rewardPointsData,
          progress: progressData,
        };

        if (gameSessionData) {
          dataToSave.gameSession = gameSessionData;
        }

        await setDoc(userDocRef, dataToSave, { merge: true });
      } catch (error) {
        console.error("Error saving user data to Firestore:", error);
      }
    }
  };

  // Fetch user data including game session info
  const fetchUserDataFromFirestore = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserName(data.fullName || user.email);
          setHabits(data.habits || []);
          setRewardPoints(data.rewardPoints || 0);
          setProgress(data.progress || { totalDays: 0, completedDays: 0, percentage: 0 });
          
          // Restore game session if exists
          if (data.gameSession) {
            const { isActive, startTime, duration, earnedTime } = data.gameSession;
            setEarnedGameTime(earnedTime || 0);
            
            if (isActive && startTime) {
              const now = Date.now();
              const elapsed = Math.floor((now - startTime) / 1000);
              const remaining = (duration * 60) - elapsed;
              
              if (remaining > 0) {
                setIsGameSessionActive(true);
                setRemainingTime(remaining);
                setGameSessionStartTime(startTime);
                startCountdown(remaining);
              } else {
                // Session expired, clean up
                endGameSession();
              }
            }
          }
        } else {
          setUserName(user.email);
        }
        setDataFetched(true);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setDataFetched(true);
      }
    }
  };

  // Start countdown timer
  const startCountdown = (initialTime) => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    
    countdownIntervalRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          endGameSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Start game session
  const startGameSession = () => {
    if (earnedGameTime > 0) {
      const startTime = Date.now();
      const durationInSeconds = earnedGameTime * 60;
      
      setIsGameSessionActive(true);
      setRemainingTime(durationInSeconds);
      setGameSessionStartTime(startTime);
      
      // Save session to database
      const gameSessionData = {
        isActive: true,
        startTime: startTime,
        duration: earnedGameTime,
        earnedTime: earnedGameTime
      };
      
      saveUserDataToFirestore(habits, rewardPoints, progress, gameSessionData);
      startCountdown(durationInSeconds);
    }
  };

  // End game session
  const endGameSession = () => {
    setIsGameSessionActive(false);
    setRemainingTime(0);
    setGameSessionStartTime(null);
    setEarnedGameTime(0);
    
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    
    // Clear session from database
    const gameSessionData = {
      isActive: false,
      startTime: null,
      duration: 0,
      earnedTime: 0
    };
    
    saveUserDataToFirestore(habits, rewardPoints, progress, gameSessionData);
  };

  // Calculate earned game time based on completed habits
  const calculateEarnedGameTime = (habits) => {
    const today = new Date().toDateString();
    const total = habits.length;
    const completedToday = habits.filter(h => h.completedDays.includes(today)).length;

    if (completedToday === 0) return 0;
    if (completedToday === total) return 20; // 1h 30m
    if (completedToday >= Math.ceil(total / 2)) return 15; // 1h
    return 5; // 30m
  };

  const updateProgress = useCallback(() => {
    let totalDays = 0;
    let completedDays = 0;
    habits.forEach(habit => {
      totalDays += 7;
      completedDays += habit.completedDays.length;
    });
    const percentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
    const updatedProgress = { totalDays, completedDays, percentage };
    setProgress(updatedProgress);
    
    // Update earned game time but don't overwrite active session
    if (!isGameSessionActive) {
      const newEarnedTime = calculateEarnedGameTime(habits);
      setEarnedGameTime(newEarnedTime);
    }
    
    saveUserDataToFirestore(habits, rewardPoints, updatedProgress);
  }, [habits, rewardPoints, isGameSessionActive]);

  useEffect(() => {
    fetchMotivationalMessage();
    const timer = setTimeout(() => setShowWelcome(false), 3000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserDataFromFirestore();
      }
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const today = new Date();
    const updatedHabits = habits.map(habit => {
      const sortedDates = [...habit.completedDays].sort((a, b) => new Date(b) - new Date(a));
      if (sortedDates.length === 0) return { ...habit, streak: 0 };

      const lastCompleted = new Date(sortedDates[0]);
      const diffInDays = Math.floor((today - lastCompleted) / (1000 * 3600 * 24));
      return diffInDays > 2 ? { ...habit, streak: 0 } : habit;
    });
    setHabits(updatedHabits);
  }, []);

  useEffect(() => {
    updateProgress();
  }, [habits, updateProgress]);

  useEffect(() => {
    saveUserDataToFirestore(habits, rewardPoints, progress);
  }, [rewardPoints]);

  const fetchMotivationalMessage = () => {
    const messages = [
      "Every small step counts! Keep going! 💪",
      "Consistency is key! 🌟",
      "One day at a time, you're getting better! 🚀",
      "Believe in yourself! You got this! 🎯",
    ];
    setMotivationalMessage(messages[Math.floor(Math.random() * messages.length)]);
  };

  const addHabit = () => {
    if (newHabit.trim() !== "") {
      setHabits([...habits, { name: newHabit, streak: 0, completedDays: [] }]);
      setNewHabit("");
    }
  };

  const markHabitComplete = (index) => {
    const today = new Date().toDateString();
    const updatedHabits = habits.map((habit, i) => {
      if (i === index && !habit.completedDays.includes(today)) {
        triggerFullScreenConfetti();
        successAudioRef.current?.play();
        return {
          ...habit,
          completedDays: [...habit.completedDays, today],
          streak: habit.streak + 1,
        };
      }
      return habit;
    });
    setHabits(updatedHabits);
    setRewardPoints(rewardPoints + 10);
  };

  const triggerFullScreenConfetti = () => {
    const duration = 2000;
    const end = Date.now() + duration;
    const colors = ['#00f7ff', '#1e90ff', '#ffffff', '#66ffff'];
    (function frame() {
      confetti({ particleCount: 6, spread: 360, origin: { x: Math.random(), y: Math.random() }, colors });
      confetti({ particleCount: 6, spread: 360, origin: { x: Math.random(), y: Math.random() }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  const deleteHabit = (index) => {
    setHabits(habits.filter((_, i) => i !== index));
  };

  const handlePlayButtonClick = () => {
    if (isGameSessionActive) {
      navigate("/visual-journey");
    }
  };

  const chartData = {
    labels: habits.map(h => h.name),
    datasets: [{ 
      label: "Completion %", 
      data: habits.map(h => (h.completedDays.length / 7) * 100), 
      backgroundColor: "#00ccff", 
      borderRadius: 5 
    }],
  };

  // Determine button style and text
  const getButtonConfig = () => {
    if (isGameSessionActive) {
      return {
        style: styles.journeyButtonActive,
        text: "🎮 Play Now!",
        disabled: false
      };
    } else if (earnedGameTime > 0) {
      return {
        style: styles.journeyButton,
        text: "🎯 Start Game Session",
        disabled: false
      };
    } else {
      return {
        style: styles.journeyButtonDisabled,
        text: "🎮 Complete Habits to Play",
        disabled: true
      };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <div style={styles.container}>
      {showWelcome && <div style={styles.welcomeBox}>Welcome, {userName || "User"}! 🚀</div>}
      <div style={styles.subheading}>LET'S MAINTAIN STREAKS & TRACK YOUR HABITS!</div>
      <div style={styles.content}>
        <div style={styles.leftSection}>
          <div style={styles.motivation}><FaBell /> {motivationalMessage}</div>
          <div style={styles.inputBox}>
            <input
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHabit()}
              placeholder="Enter a new habit..."
              style={styles.input}
            />
            <button onClick={addHabit} style={styles.addButton}><FaPlus /></button>
          </div>
          <div style={styles.progressContainer}>
            <p>Progress: {progress.percentage}%</p>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${progress.percentage}%` }} />
            </div>
          </div>
          <div style={styles.rewards}>
            <p>🎁 Reward Points: {rewardPoints}</p>
            <p>⏰ Earned Game Time: {earnedGameTime > 0 ? `${earnedGameTime}m` : "0m"}</p>
            {isGameSessionActive && (
              <p>🎮 Active Session: {formatTime(remainingTime)}</p>
            )}
          </div>
          <div style={styles.chartContainer}><Bar data={chartData} /></div>
        </div>

        <div style={styles.rightSection}>
          <h3 style={styles.whiteText}>Your Habits</h3>
          <table style={styles.table}>
            <thead>
              <tr><th>Habit</th><th>Streak</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {habits.map((habit, index) => (
                <tr key={index}>
                  <td>{habit.name}</td>
                  <td>{habit.streak} 🔥</td>
                  <td>
                    <button onClick={() => markHabitComplete(index)} style={styles.completeButton}>
                      ✅ {habit.completedDays.includes(new Date().toDateString()) ? "Completed" : "Mark as Done"}
                    </button>
                    <button onClick={() => deleteHabit(index)} style={styles.deleteButton}>❌ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button 
          onClick={isGameSessionActive ? handlePlayButtonClick : startGameSession}
          style={buttonConfig.style}
          disabled={buttonConfig.disabled}
        >
          {buttonConfig.text}
        </button>
        
        {isGameSessionActive && (
          <div style={styles.gameSessionInfo}>
            🎮 Game Session Active! Time Remaining: {formatTime(remainingTime)}
          </div>
        )}
        
        {!isGameSessionActive && earnedGameTime > 0 && (
          <div style={styles.earnedTimeInfo}>
            🎯 You've earned {earnedGameTime} minutes of game time! Click to start your session.
          </div>
        )}
        
        {!isGameSessionActive && earnedGameTime === 0 && (
          <div style={styles.gameTimeMessage}>
            💡 Complete at least one habit today to unlock game time!
          </div>
        )}
      </div>
      
      <audio ref={successAudioRef} src="/success.mp3" preload="auto" />
    </div>
  );
};

export default Dashboard;