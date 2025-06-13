import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import "./StonePaperScissor.css";

const choices = ["Stone", "Paper", "Scissor"];

const getResult = (userChoice, compChoice) => {
  if (userChoice === compChoice) return "Draw";
  if (
    (userChoice === "Stone" && compChoice === "Scissor") ||
    (userChoice === "Paper" && compChoice === "Stone") ||
    (userChoice === "Scissor" && compChoice === "Paper")
  )
    return "You Win!";
  return "Computer Wins!";
};

const StonePaperScissor = () => {
  const [userChoice, setUserChoice] = useState(null);
  const [compChoice, setCompChoice] = useState(null);
  const [result, setResult] = useState("");
  const [userScore, setUserScore] = useState(0);
  const [compScore, setCompScore] = useState(0);
  const [animateResult, setAnimateResult] = useState(false);
  const [scorePulseUser, setScorePulseUser] = useState(false);
  const [scorePulseComp, setScorePulseComp] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false); // For sparkle overlay
  const maxScore = 10;

  const matchSoundRef = useRef(null);
  const smashSoundRef = useRef(null);
  const successSoundRef = useRef(null);
  const barrierBreakSoundRef = useRef(null);

  const playRound = (choice) => {
    if (userScore >= maxScore || compScore >= maxScore) return;

    const compRandom = choices[Math.floor(Math.random() * choices.length)];
    setUserChoice(choice);
    setCompChoice(compRandom);

    const roundResult = getResult(choice, compRandom);
    setResult(roundResult);

    if (roundResult === "You Win!") {
      setUserScore((score) => {
        setScorePulseUser(true);
        return score + 1;
      });
      matchSoundRef.current?.play();
    } else if (roundResult === "Computer Wins!") {
      setCompScore((score) => {
        setScorePulseComp(true);
        return score + 1;
      });
      barrierBreakSoundRef.current?.play();
    }

    setAnimateResult(true);
  };

  const resetGame = () => {
    setUserChoice(null);
    setCompChoice(null);
    setResult("");
    setUserScore(0);
    setCompScore(0);
    setScorePulseUser(false);
    setScorePulseComp(false);
    setShowSparkles(false);
  };

  useEffect(() => {
    if (animateResult) {
      const timer = setTimeout(() => setAnimateResult(false), 700);
      return () => clearTimeout(timer);
    }
  }, [animateResult]);

  useEffect(() => {
    if (scorePulseUser) {
      const timer = setTimeout(() => setScorePulseUser(false), 600);
      return () => clearTimeout(timer);
    }
  }, [scorePulseUser]);

  useEffect(() => {
    if (scorePulseComp) {
      const timer = setTimeout(() => setScorePulseComp(false), 600);
      return () => clearTimeout(timer);
    }
  }, [scorePulseComp]);

  const gameOver = userScore >= maxScore || compScore >= maxScore;

  // Play final sounds and trigger sparkles if user wins
  useEffect(() => {
    if (gameOver) {
      if (userScore > compScore) {
        successSoundRef.current?.play();

        // Show sparkle overlay
        setShowSparkles(true);

        // Confetti sparkling effect for 5 seconds
        const defaults = {
          particleCount: 20,
          startVelocity: 15,
          spread: 60,
          ticks: 300,
          gravity: 0.4,
          scalar: 1.5,
          drift: 0.2,
          colors: ["#fff", "#ffd700", "#ffa500", "#ff4500"],
          shapes: ["circle"],
          zIndex: 1000,
        };

        const interval = setInterval(() => {
          confetti({
            ...defaults,
            origin: { x: Math.random(), y: 0 },
          });
        }, 250);

        setTimeout(() => {
          clearInterval(interval);
          setShowSparkles(false);
        }, 5000);
      } else if (compScore > userScore) {
        smashSoundRef.current?.play();
      }
    }
  }, [gameOver, userScore, compScore]);

  return (
    <>
      <div className="container">
        <h2 className="title">STONE PAPER SCISSOR</h2>

        <div className="scoreboard">
          Your Score:{" "}
          <span className={`score user-score ${scorePulseUser ? "pulse" : ""}`}>
            {userScore}
          </span>{" "}
          | Computer Score:{" "}
          <span className={`score comp-score ${scorePulseComp ? "pulse" : ""}`}>
            {compScore}
          </span>
        </div>

        <div className="chosen-container">
          {userChoice && (
            <div className="choose-box user-box float-animation">
              You chose: <br />
              <img
                src={`/assets/user-${userChoice.toLowerCase()}.png`}
                alt={`User chose ${userChoice}`}
                className="choice-image"
              />
            </div>
          )}
          {compChoice && (
            <div className="choose-box comp-box float-animation">
              Computer chose: <br />
              <img
                src={`/assets/comp-${compChoice.toLowerCase()}.png`}
                alt={`Computer chose ${compChoice}`}
                className="choice-image"
              />
            </div>
          )}
        </div>

        <div className="choices">
          {choices.map((choice) => (
            <button
              key={choice}
              onClick={() => playRound(choice)}
              disabled={gameOver}
              className="choice-button animated-button"
            >
              {choice === "Stone"
                ? "🪨 Stone"
                : choice === "Paper"
                ? "📄 Paper"
                : "✂️ Scissor"}
            </button>
          ))}
        </div>

        {result && (
          <div
            className={`result-text ${
              animateResult ? "bounce-pulse" : ""
            } ${
              result === "Draw"
                ? "draw"
                : result === "You Win!"
                ? "win"
                : "lose"
            }`}
          >
            {result}
          </div>
        )}

        <button onClick={resetGame} className="reset-button animated-button">
          🔄 Reset Game
        </button>

        {gameOver && (
          <div
            className={`game-over-text ${userScore > compScore ? "win" : "lose"}`}
          >
            {userScore > compScore
              ? "🎉 You won the game! 🎉"
              : "😞 Computer won the game!"}
          </div>
        )}

        {/* Sparkle overlay */}
        {showSparkles && <div className="sparkle-overlay" />}

        {/* Audio elements */}
        <audio ref={matchSoundRef} src="/match.wav" />
        <audio ref={smashSoundRef} src="/smash.mp3" />
        <audio ref={successSoundRef} src="/success.mp3" />
        <audio ref={barrierBreakSoundRef} src="/barrierbreak.wav" />
      </div>
    </>
  );
};

export default StonePaperScissor;
