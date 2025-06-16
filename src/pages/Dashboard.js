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
  whiteText: {
    color: "#ffffff",
    marginBottom: "10px",
  },
};

// const FallingEmojis = () => {
//   const emojis = ["🔥", "⏰"];
//   const count = 30;
//   const [emojiStyles, setEmojiStyles] = useState([]);

//   useEffect(() => {
//     const styleTag = document.createElement("style");
//     styleTag.innerHTML = `
//       @keyframes fall {
//         0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
//         100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
//       }
//     `;
//     document.head.appendChild(styleTag);

//     const generatedStyles = Array.from({ length: count }).map(() => ({
//       position: "absolute",
//       top: `-${Math.random() * 100}px`,
//       left: `${Math.random() * 100}vw`,
//       fontSize: `${Math.random() * 24 + 24}px`,
//       animation: `fall ${Math.random() * 5 + 5}s linear infinite`,
//       animationDelay: `${Math.random() * 5}s`,
//       zIndex: 0,
//       pointerEvents: "none",
//       userSelect: "none",
//     }));

//     setEmojiStyles(generatedStyles);

//     return () => {
//       document.head.removeChild(styleTag);
//     };
//   }, []);

//   return (
//     <div
//       style={{
//         position: "fixed",
//         width: "100vw",
//         height: "100vh",
//         overflow: "hidden",
//         pointerEvents: "none",
//         top: 0,
//         left: 0,
//         zIndex: 0,
//       }}
//     >
//       {emojiStyles.map((style, i) => (
//         <div key={i} style={style}>
//           {emojis[Math.floor(Math.random() * emojis.length)]}
//         </div>
//       ))}
//     </div>
//   );
// };

const Dashboard = () => {
  const navigate = useNavigate();
  const successAudioRef = useRef(null);
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [progress, setProgress] = useState({ totalDays: 0, completedDays: 0, percentage: 0 });
  const [rewardPoints, setRewardPoints] = useState(0);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [userName, setUserName] = useState("");
  const [todayGameTime, setTodayGameTime] = useState("00:00");
  const [dataFetched, setDataFetched] = useState(false);


  // Check if user has earned game time
  const hasGameTime = todayGameTime !== "00:00";

const saveUserDataToFirestore = async (habitsData, rewardPointsData, progressData) => {
  if (!dataFetched) return; // ⛔ prevent premature save
  const user = auth.currentUser;
  if (user) {
    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        fullName: userName,
        email: user.email,
        habits: habitsData,
        rewardPoints: rewardPointsData,
        progress: progressData,
      }, { merge: true });
    } catch (error) {
      console.error("Error saving user data to Firestore:", error);
    }
  }
};

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
      } else {
        // New user — optional: create empty doc or wait for first save
        setUserName(user.email);
      }
      setDataFetched(true); // ✅ Mark data as loaded
    } catch (error) {
      console.error("Error fetching user data:", error);
      setDataFetched(true); // Even if failed, avoid blocking updates
    }
  }
};

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
    unsubscribe(); // Cleanup auth listener
  };
}, []);

  const calculateTodayGameTime = (habits) => {
    const today = new Date().toDateString();
    const total = habits.length;
    const completedToday = habits.filter(h => h.completedDays.includes(today)).length;

    if (completedToday === 0) return "00:00";
    if (completedToday === total) return "1h 30m";
    if (completedToday >= Math.ceil(total / 2)) return "1h 0m";
    return "30m";
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
    saveUserDataToFirestore(habits, rewardPoints, updatedProgress);
    setTodayGameTime(calculateTodayGameTime(habits));
  }, [habits, rewardPoints]);

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
    // localStorage.setItem("habits", JSON.stringify(habits));
    updateProgress();
  }, [habits, updateProgress]);

  useEffect(() => {
    // localStorage.setItem("rewardPoints", JSON.stringify(rewardPoints));
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
    if (hasGameTime) {
      navigate("/visual-journey");
    }
  };

  const chartData = {
    labels: habits.map(h => h.name),
    datasets: [{ label: "Completion %", data: habits.map(h => (h.completedDays.length / 7) * 100), backgroundColor: "#00ccff", borderRadius: 5 }],
  };

  return (
    <div style={styles.container}>
      {/* <FallingEmojis /> */}
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
            <div style={styles.progressBar}><div style={{ ...styles.progressFill, width: `${progress.percentage}%` }} /></div>
          </div>
          <div style={styles.rewards}>
            <p>🎁 Reward Points: {rewardPoints}</p>
            <p>🎮 Game Time Reward: {todayGameTime}</p>
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
          onClick={handlePlayButtonClick} 
          style={hasGameTime ? styles.journeyButton : styles.journeyButtonDisabled}
          disabled={!hasGameTime}
        >
          🎮 {hasGameTime ? "Let's Play" : "Complete Habits to Play"}
        </button>
        
        {!hasGameTime && (
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