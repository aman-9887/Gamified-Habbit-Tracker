import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import "./FocusFlipGame.css";
import cardImage from "../assets/card.jpg"; // adjust the path if needed

const habits = [
  "Drink Water",
  "Exercise",
  "Junk Food",
  "Sleep Late",
  "Read Book",
  "Procrastinate",
];

const generateCardPairs = () => {
  const shuffled = [...habits, ...habits]
    .sort(() => 0.5 - Math.random())
    .map((habit, index) => ({
      id: index,
      habit,
      flipped: false,
      matched: false,
    }));
  return shuffled;
};

const FocusFlipGame = () => {
  const [cards, setCards] = useState(generateCardPairs());
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Flip all cards for 4 seconds on start or reset
  useEffect(() => {
    if (!gameStarted) {
      setCards((prevCards) =>
        prevCards.map((card) => ({ ...card, flipped: true }))
      );

      const timer = setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card) => ({ ...card, flipped: false }))
        );
        setGameStarted(true);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [gameStarted]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      if (cards[first].habit === cards[second].habit) {
        const newCards = [...cards];
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setMatchedCount((prev) => prev + 1);
      } else {
        setTimeout(() => {
          const newCards = [...cards];
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards(newCards);
        }, 800);
      }
      setFlippedCards([]);
    }
  }, [flippedCards, cards]);

  // Victory confetti + sound effect
  useEffect(() => {
    if (matchedCount === habits.length && !gameCompleted) {
      const audio = new Audio("/success.mp3");
      audio.play();
      setGameCompleted(true);

      // Confetti with bigger, bolder sparkles falling down
      const defaults = {
        particleCount: 20,
        startVelocity: 15,
        spread: 60,
        ticks: 300,
        gravity: 0.4,
        scalar: 1.5,
        drift: 0.2,
        colors: ['#fff', '#ffd700', '#ffa500', '#ff4500'],
        shapes: ['circle'],
        zIndex: 1000,
      };

      const interval = setInterval(() => {
        confetti({
          ...defaults,
          origin: { x: Math.random(), y: 0 },
        });
      }, 250);

      setTimeout(() => clearInterval(interval), 5000); // confetti lasts 5 sec
    }
  }, [matchedCount, gameCompleted]);

  const handleFlip = (index) => {
    if (
      !gameStarted ||
      cards[index].flipped ||
      cards[index].matched ||
      flippedCards.length === 2
    )
      return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    setFlippedCards([...flippedCards, index]);
  };

  const restartGame = () => {
    const newCards = generateCardPairs();
    setCards(newCards);
    setFlippedCards([]);
    setMatchedCount(0);
    setGameCompleted(false);
    setGameStarted(false); // triggers useEffect to show then hide cards
  };

  return (
    <div className="focus-flip-container">
      <h2>🎯 Focus Flip Game</h2>
      <p>Match good and bad habits by flipping the cards!</p>
      <div className="card-grid">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`card ${card.flipped || card.matched ? "flipped" : ""}`}
            onClick={() => handleFlip(index)}
          >
            <div className="card-inner">
              <div className="card-front">
                <img src={cardImage} alt="Card" className="card-image" />
              </div>
              <div className="card-back">{card.habit}</div>
            </div>
          </div>
        ))}
      </div>

      {matchedCount === habits.length && (
        <div className="victory-message">
          🎉 You matched all habits! Great focus!
        </div>
      )}

      <div className="reset-button-ff">
        <button onClick={restartGame}>🔄 Reset Game</button>
      </div>
    </div>
  );
};

export default FocusFlipGame;
