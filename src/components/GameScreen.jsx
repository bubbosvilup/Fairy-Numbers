// src/components/GameScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const GameScreen = ({ isPlayerTurn, playerChoice, aiChoice, total, onPlayerChoice }) => {
  const [playerNumber, setPlayerNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const progressBarRef = useRef(null);
  
  // Update progress bar when total changes
  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${Math.min(total, 100)}%`,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [total]);
  
  // Handle player input
  const handleSubmit = () => {
    const number = parseInt(playerNumber);
    
    if (isNaN(number) || number < 1 || number > 10) {
      setErrorMessage('Please enter a valid number between 1 and 10');
      return;
    }
    
    setErrorMessage('');
    setPlayerNumber('');
    onPlayerChoice(number);
  };
  
  // Handle enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  
  return (
    <div className="game">
      <div className="scores-container flex justify-between gap-4 mb-6">
        <div className="score-card player-card">
          <span className="material-icons">person</span>
          <p><strong>Player:</strong> <span id="player-choice">{playerChoice}</span></p>
        </div>
        <div className="score-card ai-card">
          <span className="material-icons">smart_toy</span>
          <p><strong>AI:</strong> <span id="ai-choice">{aiChoice}</span></p>
        </div>
      </div>
      
      <div className="total-score mb-6">
        <p id="totale"><strong>Total:</strong> <span id="total">{total}</span></p>
        <div className="progress-bar bg-gray-200 h-2 rounded-full overflow-hidden">
          <div 
            ref={progressBarRef}
            id="progress" 
            className="progress bg-purple-600 h-full rounded-full"
            style={{ width: `${Math.min(total, 100)}%` }}
          ></div>
        </div>
      </div>
      
      <div className={`turn ${isPlayerTurn ? 'active' : ''}`}>
        <p id="game-turn-message" className="text-center mb-4">
          {isPlayerTurn 
            ? "It's your turn! Choose a number between 1 and 10." 
            : "It's AI's turn..."}
        </p>
        
        {isPlayerTurn && (
          <div id="player-input" className="flex flex-col items-center">
            {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
            <div className="number-input-container flex gap-2">
              <input
                type="number"
                id="player-number"
                min="1"
                max="10"
                value={playerNumber}
                onChange={(e) => setPlayerNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                required
                className="px-4 py-2 border rounded-lg"
              />
              <button 
                id="submit-number" 
                className="primary-button"
                onClick={handleSubmit}
              >
                <span className="material-icons">send</span>
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameScreen;