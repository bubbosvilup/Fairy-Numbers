// Only updating the loading part of App.jsx
// src/App.jsx
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import ParticlesBackground from "./components/ParticlesBackground";
import VideoIntro from "./components/VideoIntro";
import MenuScreen from "./components/MenuScreen";
import DiceRollScreen from "./components/DiceRollScreen";
import GameScreen from "./components/GameScreen";
import Footer from "./components/Footer";
import "./App.css";

// Import audio assets
import backgroundMusicFile from "./assets/backgroundMusic.mp3";
import clickPlaySoundFile from "./assets/clickPlay.wav";
import diceRollSoundFile from "./assets/diceRoll.mp3";
import confirmSoundFile from "./assets/conferma.mp3";
import lostSoundFile from "./assets/lost.wav";
import playerTurnSoundFile from "./assets/playerTurn.wav";
import winSoundFile from "./assets/win.wav";

function App() {
  // Game state
  const [currentScreen, setCurrentScreen] = useState("menu");
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [playerChoice, setPlayerChoice] = useState(0);
  const [aiChoice, setAiChoice] = useState(0);
  const [total, setTotal] = useState(0);
  const [diceResult, setDiceResult] = useState({
    player: 0,
    ai: 0,
    message: "",
  });
  const [showDiceResult, setShowDiceResult] = useState(false);
  const [gameDifficulty, setGameDifficulty] = useState("easy");
  const [isMuted, setIsMuted] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Audio refs
  const backgroundMusic = useRef(new Audio(backgroundMusicFile));
  const clickPlaySound = useRef(new Audio(clickPlaySoundFile));
  const diceRollSound = useRef(new Audio(diceRollSoundFile));
  const confirmSound = useRef(new Audio(confirmSoundFile));
  const lostSound = useRef(new Audio(lostSoundFile));
  const playerTurnSound = useRef(new Audio(playerTurnSoundFile));
  const winSound = useRef(new Audio(winSoundFile));

  // Set up loading
  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Set up loading with a more visible animation
  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Slightly longer loading time to show animation
    
    return () => clearTimeout(timer);
  }, []);

  // Set up audio
  useEffect(() => {
    // Configure audio elements
    backgroundMusic.current.loop = true;
    backgroundMusic.current.volume = 0.2;
    clickPlaySound.current.volume = 0.3;
    diceRollSound.current.volume = 0.3;
    confirmSound.current.volume = 0.3;
    lostSound.current.volume = 0.4;
    playerTurnSound.current.volume = 0.3;
    winSound.current.volume = 0.4;

    // Clean up when component unmounts
    return () => {
      backgroundMusic.current.pause();
      backgroundMusic.current.currentTime = 0;
    };
  }, []);

  // Update mute status for all audio
  useEffect(() => {
    backgroundMusic.current.muted = isMuted;
    clickPlaySound.current.muted = isMuted;
    diceRollSound.current.muted = isMuted;
    confirmSound.current.muted = isMuted;
    lostSound.current.muted = isMuted;
    playerTurnSound.current.muted = isMuted;
    winSound.current.muted = isMuted;
  }, [isMuted]);

  // Play sound function (with cloning to allow multiple instances)
  const playSound = (sound) => {
    if (!isMuted) {
      const soundClone = sound.current.cloneNode();
      soundClone.volume = sound.current.volume;
      soundClone.play().catch((err) => {
        console.log("Error playing audio:", err);
      });
    }
  };

  // Handle start button click
  const handleStartGame = () => {
    playSound(clickPlaySound);

    // Start background music if not already playing
    if (backgroundMusic.current.paused) {
      backgroundMusic.current.play().catch(() => {
        console.log("Autoplay blocked, music will start after interaction");
      });
    }

    setCurrentScreen("diceRoll");
  };

  // Handle dice roll
  const rollDice = () => {
    playSound(diceRollSound);

    const playerRoll = Math.floor(Math.random() * 6) + 1;
    const aiRoll = Math.floor(Math.random() * 6) + 1;

    setDiceResult({
      player: playerRoll,
      ai: aiRoll,
      message: playerRoll === aiRoll ? "It's a Tie! Roll again!" : "",
    });

    setShowDiceResult(true);

    // If tie, allow re-roll
    if (playerRoll === aiRoll) {
      return;
    }

    // Determine who goes first and start game after 1.5 seconds
    setTimeout(() => {
      const playerFirst = playerRoll > aiRoll;
      setIsPlayerTurn(playerFirst);
      setCurrentScreen("game");

      // If AI goes first, start AI turn
      if (!playerFirst) {
        setTimeout(() => {
          handleAiTurn();
        }, 1000);
      }
    }, 1500);
  };

  // Handle player choice
  const handlePlayerChoice = (number) => {
    if (!isPlayerTurn) return;

    playSound(confirmSound);

    const choice = parseInt(number);
    setPlayerChoice(choice);
    setTotal((prevTotal) => prevTotal + choice);

    // Check for winner after player's turn
    setTimeout(() => {
      if (total + choice >= 100) {
        playSound(winSound);
        setTimeout(() => {
          alert("You won!");
          resetGame();
        }, 1000);
        return;
      }

      setIsPlayerTurn(false);
      setTimeout(() => {
        handleAiTurn();
      }, 1000);
    }, 500);
  };

  // Handle AI turn
  const handleAiTurn = () => {
    // AI strategy logic based on difficulty
    const calculateAiChoice = () => {
      // Key numbers to control the game (Fibonacci sequence for more interesting strategy)
      const keyNumbers = [12, 23, 34, 45, 56, 67, 78, 89];
      let aiNumber;

      // Winning move if possible
      if (total >= 90 && total <= 99) {
        aiNumber = 100 - total;
      }
      // Strategic play
      else {
        // Determine the next key number to reach
        const nextTarget = keyNumbers.find((num) => num > total);

        if (nextTarget) {
          // Calculate how much is needed to reach the target
          const neededNumber = nextTarget - total;
          if (neededNumber <= 10) {
            aiNumber = neededNumber;
          } else {
            // Try to position for next key number
            const maxAllowedTotal = nextTarget - 11;
            const numberToReachMax = maxAllowedTotal - total;
            if (numberToReachMax > 0 && numberToReachMax <= 10) {
              aiNumber = numberToReachMax;
            } else {
              // Adaptive strategy based on player's last move
              aiNumber = Math.min(10, Math.max(1, 11 - playerChoice));
            }
          }
        } else {
          // Beyond key numbers, aim for 100
          const remainingToWin = 100 - total;
          if (remainingToWin <= 10) {
            aiNumber = remainingToWin;
          } else {
            // Adaptive strategy
            aiNumber = Math.min(10, Math.max(1, 11 - playerChoice));
          }
        }
      }

      // Ensure the number is valid
      aiNumber = Math.min(10, Math.max(1, aiNumber));

      // Add some randomness to make AI less predictable
      // (more randomness on easy, less on hard)
      const randomChance =
        gameDifficulty === "easy"
          ? 0.3
          : gameDifficulty === "medium"
          ? 0.15
          : 0.05;

      if (Math.random() < randomChance) {
        aiNumber = Math.floor(Math.random() * 10) + 1;
      }

      return aiNumber;
    };

    const aiNumber = calculateAiChoice();
    setAiChoice(aiNumber);
    setTotal((prevTotal) => prevTotal + aiNumber);

    // Check for winner after AI's turn
    setTimeout(() => {
      if (total + aiNumber >= 100) {
        playSound(lostSound);
        setTimeout(() => {
          alert("AI won!");
          resetGame();
        }, 1000);
        return;
      }

      playSound(playerTurnSound);
      setIsPlayerTurn(true);
    }, 500);
  };

  // Reset game
  const resetGame = () => {
    setCurrentScreen("menu");
    setIsPlayerTurn(true);
    setPlayerChoice(0);
    setAiChoice(0);
    setTotal(0);
    setShowDiceResult(false);
  };

  // Skip intro
  const skipIntro = () => {
    setShowIntro(false);

    // Start background music after intro
    backgroundMusic.current.play().catch(() => {
      console.log("Autoplay blocked, music will start after interaction");
    });
  };

  return (
    <div className="app">
      {isLoading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading Fairy's Numbers...</p>
        </div>
      ) : (
        <>
          {showIntro && (
            <VideoIntro
              onSkip={skipIntro}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
            />
          )}

          <ParticlesBackground />

          <div className="container">
            <h1 className="game-title">The Fairy's Numbers</h1>
            
            {currentScreen === "menu" && (
              <MenuScreen
                onStartGame={handleStartGame}
                difficulty={gameDifficulty}
                setDifficulty={setGameDifficulty}
                playSound={() => playSound(clickPlaySound)}
              />
            )}

            {currentScreen === "diceRoll" && (
              <DiceRollScreen
                onRollDice={rollDice}
                diceResult={diceResult}
                showResult={showDiceResult}
              />
            )}

            {currentScreen === "game" && (
              <GameScreen
                isPlayerTurn={isPlayerTurn}
                playerChoice={playerChoice}
                aiChoice={aiChoice}
                total={total}
                onPlayerChoice={handlePlayerChoice}
              />
            )}
          </div>

          <button
            id="mute-btn"
            className="audio-btn fixed top-4 right-4 z-10"
            onClick={() => setIsMuted(!isMuted)}
          >
            <span className="material-icons">
              {isMuted ? "volume_off" : "volume_up"}
            </span>
          </button>

          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
