// src/components/MenuScreen.jsx
import React from 'react';

const MenuScreen = ({ onStartGame, difficulty, setDifficulty, playSound }) => {
  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    playSound();
  };
  
  return (
    <div className="menu">
      <div className="difficulty-selector">
        <h3>Select Difficulty:</h3>
        <div className="difficulty-buttons">
          <button 
            id="easy-btn" 
            className={`difficulty-btn ${difficulty === 'easy' ? 'active' : ''}`}
            onClick={() => handleDifficultyChange('easy')}
          >
            Easy
          </button>
          <button 
            id="medium-btn" 
            className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
            onClick={() => handleDifficultyChange('medium')}
          >
            Medium
          </button>
          <button 
            id="hard-btn" 
            className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
            onClick={() => handleDifficultyChange('hard')}
          >
            Hard
          </button>
        </div>
      </div>
      
      <button id="start-btn" className="primary-button" onClick={onStartGame}>
        <span className="material-icons">play_arrow</span>
        Play
      </button>
      
      <div className="rules">
        <p>
          <strong>Rules:</strong> Each player chooses a number between 1 and 10. The first to reach 100 wins!
        </p>
      </div>
    </div>
  );
};

export default MenuScreen;